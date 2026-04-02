package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.ApiResponse;
import com.smartcampus.hub.dto.BookingCancelRequest;
import com.smartcampus.hub.dto.BookingCheckInResponse;
import com.smartcampus.hub.dto.BookingResponse;
import com.smartcampus.hub.dto.CreateBookingRequest;
import com.smartcampus.hub.entity.BookingStatus;
import com.smartcampus.hub.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER','ADMIN')")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(@Valid @RequestBody CreateBookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking request submitted", bookingService.createBooking(request)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Bookings fetched successfully",
                bookingService.getCurrentUserBookings(status, fromDate, toDate)
        ));
    }

    @GetMapping("/{bookingId}/check-in-qr")
    public ResponseEntity<ApiResponse<BookingCheckInResponse>> getCheckInQr(@PathVariable UUID bookingId) {
        return ResponseEntity.ok(ApiResponse.success(
                "Check-in QR generated successfully",
                bookingService.getCheckInQrData(bookingId)
        ));
    }

    @PatchMapping("/{bookingId}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(@PathVariable UUID bookingId,
                                                                      @RequestBody(required = false) BookingCancelRequest request) {
        String reason = request == null ? null : request.getReason();
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", bookingService.cancelBooking(bookingId, reason)));
    }
}