package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.ApiResponse;
import com.smartcampus.hub.dto.BookingCancelRequest;
import com.smartcampus.hub.dto.BookingCheckInResponse;
import com.smartcampus.hub.dto.BookingResponse;
import com.smartcampus.hub.dto.CreateBookingRequest;
import com.smartcampus.hub.dto.UpdateBookingRequest;
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

    @PutMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBooking(@PathVariable UUID bookingId,
                                                                      @Valid @RequestBody UpdateBookingRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Booking updated successfully", bookingService.updateBooking(bookingId, request)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(
            @RequestParam(name = "status", required = false) BookingStatus status,
            @RequestParam(name = "fromDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(name = "toDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
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

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<Void>> deleteBookingForCurrentUser(@PathVariable UUID bookingId) {
        bookingService.deleteBookingForCurrentUser(bookingId);
        return ResponseEntity.ok(ApiResponse.success("Booking removed from your list", null));
    }
}