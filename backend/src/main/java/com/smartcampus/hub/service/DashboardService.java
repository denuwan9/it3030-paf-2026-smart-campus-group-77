package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.AdminDashboardStatsDTO;
import com.smartcampus.hub.dto.DashboardStatsDTO;
import com.smartcampus.hub.dto.RecentActivityDTO;
import com.smartcampus.hub.entity.*;
import com.smartcampus.hub.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final FacilityRepository facilityRepository;
    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    private final NotificationRepository notificationRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDTO getUserStats() {
        try {
            User user = getCurrentUser();
            log.info("Fetching user stats for: {}", user.getEmail());

            List<?> bookings = bookingRepository.findUserBookings(user.getId(), BookingStatus.APPROVED, null, null);
            long activeBookings = bookings != null ? bookings.size() : 0;

            long pendingTickets = ticketRepository.findByReporterIdOrderByCreatedAtDesc(user.getId()).stream()
                    .filter(t -> t != null && (t.getStatus() == TicketStatus.OPEN || t.getStatus() == TicketStatus.IN_PROGRESS))
                    .count();
            
            return DashboardStatsDTO.builder()
                    .activeBookings(activeBookings)
                    .pendingTickets(pendingTickets)
                    .totalResources(resourceRepository.count())
                    .notificationsCount(notificationRepository.countByRecipientIdAndIsRead(user.getId(), false))
                    .build();
        } catch (Exception e) {
            log.error("Error in getUserStats: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public AdminDashboardStatsDTO getAdminStats() {
        try {
            return AdminDashboardStatsDTO.builder()
                    .totalResources(resourceRepository.count())
                    .activeBookings(bookingRepository.findAllBookings(BookingStatus.APPROVED, null, null, null, null).size())
                    .pendingTickets(ticketRepository.countByStatus(TicketStatus.OPEN) + ticketRepository.countByStatus(TicketStatus.IN_PROGRESS))
                    .activeUsers(userRepository.count())
                    .totalFacilities(facilityRepository.count())
                    .build();
        } catch (Exception e) {
            log.error("Error in getAdminStats: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public List<RecentActivityDTO> getRecentActivity() {
        List<RecentActivityDTO> activities = new ArrayList<>();
        
        try {
            User user = getCurrentUser();
            boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;
            log.info("Fetching {} activity for user: {}", isAdmin ? "global admin" : "personalized", user.getEmail());

            // 1. Fetch Bookings
            List<Booking> bookings;
            if (isAdmin) {
                // Admin sees all recent bookings
                bookings = bookingRepository.findAllBookings(null, null, null, null, null);
            } else {
                // User sees only their own
                bookings = bookingRepository.findUserBookings(user.getId(), null, null, null);
            }

            bookings.stream()
                .filter(b -> b != null && b.getResource() != null)
                .limit(10)
                .forEach(b -> {
                    String title = b.getResource().getName();
                    // Humanize technical facility names
                    if (title != null && title.startsWith("__FACILITY_BOOKING_SLOT__") && b.getResource().getFacility() != null) {
                        title = b.getResource().getFacility().getName();
                    }
                    
                    activities.add(RecentActivityDTO.builder()
                        .id(b.getId().toString())
                        .title(title)
                        .type("BOOKING")
                        .status(b.getStatus() != null ? b.getStatus().name() : "PENDING")
                        .user(b.getRequestedBy() != null ? b.getRequestedBy().getFullName() : "Unknown")
                        .timestamp(b.getCreatedAt())
                        .build());
                });

            // 2. Fetch Tickets
            List<Ticket> tickets;
            if (isAdmin) {
                tickets = ticketRepository.findAll();
            } else {
                tickets = ticketRepository.findByReporterIdOrderByCreatedAtDesc(user.getId());
            }

            tickets.stream()
                .filter(t -> t != null)
                .sorted(Comparator.comparing(t -> t.getCreatedAt() != null ? t.getCreatedAt() : Instant.MIN, Comparator.reverseOrder()))
                .limit(10)
                .forEach(t -> activities.add(RecentActivityDTO.builder()
                        .id(t.getId().toString())
                        .title(t.getTitle())
                        .type("TICKET")
                        .status(t.getStatus() != null ? t.getStatus().name() : "OPEN")
                        .user(t.getReporter() != null ? t.getReporter().getFullName() : "Anonymous")
                        .timestamp(t.getCreatedAt())
                        .build()));

        } catch (Exception e) {
            log.warn("Partial failure in getRecentActivity: {}", e.getMessage());
        }

        return activities.stream()
                .sorted(Comparator.comparing(RecentActivityDTO::getTimestamp, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(4)
                .collect(Collectors.toList());
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }
}
