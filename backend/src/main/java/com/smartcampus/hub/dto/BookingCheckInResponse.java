package com.smartcampus.hub.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
public class BookingCheckInResponse {
    private UUID bookingId;
    private String resourceName;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String requestedByName;

    private String checkInToken;
    private String verificationUrl;

    private boolean expired;
    private boolean checkedIn;
    private Instant checkedInAt;
    private Instant lastScannedAt;
    private String checkedInByName;
}
