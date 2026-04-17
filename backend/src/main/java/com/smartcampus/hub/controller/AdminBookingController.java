package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.ApiResponse;
import com.smartcampus.hub.dto.BookingCheckInResponse;
import com.smartcampus.hub.dto.BookingDecisionRequest;
import com.smartcampus.hub.dto.BookingResponse;
import com.smartcampus.hub.dto.CheckInVerifyRequest;
import com.smartcampus.hub.entity.BookingStatus;
import com.smartcampus.hub.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/bookings")
@RequiredArgsConstructor
public class AdminBookingController {

    private final BookingService bookingService;

    @GetMapping
        @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings(
            @RequestParam(name = "status", required = false) BookingStatus status,
            @RequestParam(name = "resourceId", required = false) UUID resourceId,
            @RequestParam(name = "requesterId", required = false) UUID requesterId,
            @RequestParam(name = "fromDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(name = "toDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Bookings fetched successfully",
                bookingService.getAllBookings(status, resourceId, requesterId, fromDate, toDate)
        ));
    }

    @PatchMapping("/{bookingId}/decision")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponse>> reviewBooking(@PathVariable UUID bookingId,
                                                                      @Valid @RequestBody BookingDecisionRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Booking reviewed successfully", bookingService.reviewBooking(bookingId, request)));
    }

    @GetMapping("/check-in/lookup")
    public ResponseEntity<ApiResponse<BookingCheckInResponse>> lookupCheckIn(@RequestParam(name = "token") String token) {
        return ResponseEntity.ok(ApiResponse.success(
                "Check-in token validated",
                bookingService.previewCheckInByToken(token)
        ));
    }

    @PostMapping("/check-in/verify")
    public ResponseEntity<ApiResponse<BookingCheckInResponse>> verifyCheckIn(@Valid @RequestBody CheckInVerifyRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Booking checked in successfully",
                bookingService.verifyCheckIn(request)
        ));
    }
}