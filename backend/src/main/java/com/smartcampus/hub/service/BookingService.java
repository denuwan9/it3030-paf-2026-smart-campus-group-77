package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.BookingDecisionRequest;
import com.smartcampus.hub.dto.BookingResponse;
import com.smartcampus.hub.dto.CreateBookingRequest;
import com.smartcampus.hub.entity.*;
import com.smartcampus.hub.repository.BookingRepository;
import com.smartcampus.hub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceService resourceService;
    private final UserRepository userRepository;

    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request) {
        validateBookingTimeOrder(request.getStartTime(), request.getEndTime());

        Resource resource = resourceService.getResourceEntityById(request.getResourceId());
        validateResourceIsBookable(resource);
        validateWithinAvailability(resource, request.getStartTime(), request.getEndTime());

        if (request.getExpectedAttendees() != null && request.getExpectedAttendees() > resource.getCapacity()) {
            throw new RuntimeException("Expected attendees exceed resource capacity");
        }

        ensureNoConflict(resource.getId(), request.getBookingDate(), request.getStartTime(), request.getEndTime(),
                List.of(BookingStatus.PENDING, BookingStatus.APPROVED));

        User requester = getCurrentUser();

        Booking booking = Booking.builder()
                .resource(resource)
                .requestedBy(requester)
                .bookingDate(request.getBookingDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose().trim())
                .expectedAttendees(request.getExpectedAttendees())
                .status(BookingStatus.PENDING)
                .build();

        return toResponse(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getCurrentUserBookings(BookingStatus status,
                                                        LocalDate fromDate,
                                                        LocalDate toDate) {
        User currentUser = getCurrentUser();
        validateDateRange(fromDate, toDate);

        return bookingRepository.findUserBookings(currentUser.getId(), status, fromDate, toDate)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings(BookingStatus status,
                                                UUID resourceId,
                                                UUID requesterId,
                                                LocalDate fromDate,
                                                LocalDate toDate) {
        validateDateRange(fromDate, toDate);
        return bookingRepository.findAllBookings(status, resourceId, requesterId, fromDate, toDate)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public BookingResponse reviewBooking(UUID bookingId, BookingDecisionRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be reviewed");
        }

        if (request.getDecision() != BookingStatus.APPROVED && request.getDecision() != BookingStatus.REJECTED) {
            throw new RuntimeException("Decision must be APPROVED or REJECTED");
        }

        if (request.getDecision() == BookingStatus.REJECTED && (request.getReason() == null || request.getReason().isBlank())) {
            throw new RuntimeException("Rejection reason is required");
        }

        if (request.getDecision() == BookingStatus.APPROVED) {
            ensureNoConflict(booking.getResource().getId(), booking.getBookingDate(), booking.getStartTime(), booking.getEndTime(),
                    List.of(BookingStatus.APPROVED));
        }

        User admin = getCurrentUser();
        booking.setStatus(request.getDecision());
        booking.setReviewReason(request.getReason());
        booking.setReviewedBy(admin);
        booking.setReviewedAt(Instant.now());

        return toResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse cancelBooking(UUID bookingId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new RuntimeException("Only approved bookings can be cancelled");
        }

        User currentUser = getCurrentUser();
        boolean isOwner = booking.getRequestedBy().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;
        if (!isOwner && !isAdmin) {
            throw new RuntimeException("You are not allowed to cancel this booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelReason(reason == null || reason.isBlank() ? null : reason.trim());

        return toResponse(bookingRepository.save(booking));
    }

    private void validateBookingTimeOrder(java.time.LocalTime startTime, java.time.LocalTime endTime) {
        if (!startTime.isBefore(endTime)) {
            throw new RuntimeException("Booking start time must be before end time");
        }
    }

    private void validateResourceIsBookable(Resource resource) {
        if (resource.getStatus() != ResourceStatus.ACTIVE) {
            throw new RuntimeException("Resource is currently out of service");
        }
    }

    private void validateWithinAvailability(Resource resource,
                                            java.time.LocalTime bookingStart,
                                            java.time.LocalTime bookingEnd) {
        if (bookingStart.isBefore(resource.getAvailabilityStart()) || bookingEnd.isAfter(resource.getAvailabilityEnd())) {
            throw new RuntimeException("Booking is outside the resource availability window");
        }
    }

    private void validateDateRange(LocalDate fromDate, LocalDate toDate) {
        if (fromDate != null && toDate != null && fromDate.isAfter(toDate)) {
            throw new RuntimeException("From date cannot be after to date");
        }
    }

    private void ensureNoConflict(UUID resourceId,
                                  LocalDate bookingDate,
                                  java.time.LocalTime startTime,
                                  java.time.LocalTime endTime,
                                  List<BookingStatus> statuses) {
        long conflicts = bookingRepository.countConflictingBookings(resourceId, bookingDate, startTime, endTime, statuses);
        if (conflicts > 0) {
            throw new RuntimeException("Requested time overlaps with an existing booking");
        }
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .resourceId(booking.getResource().getId())
                .resourceName(booking.getResource().getName())
                .resourceType(booking.getResource().getType())
                .resourceLocation(booking.getResource().getLocation())
                .requestedById(booking.getRequestedBy().getId())
                .requestedByName(booking.getRequestedBy().getFullName())
                .requestedByEmail(booking.getRequestedBy().getEmail())
                .bookingDate(booking.getBookingDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .purpose(booking.getPurpose())
                .expectedAttendees(booking.getExpectedAttendees())
                .status(booking.getStatus())
                .reviewReason(booking.getReviewReason())
                .cancelReason(booking.getCancelReason())
                .reviewedById(booking.getReviewedBy() != null ? booking.getReviewedBy().getId() : null)
                .reviewedByName(booking.getReviewedBy() != null ? booking.getReviewedBy().getFullName() : null)
                .reviewedAt(booking.getReviewedAt())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}