package com.smartcampus.hub.dto;

import com.smartcampus.hub.entity.BookingStatus;
import com.smartcampus.hub.entity.ResourceType;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
public class BookingResponse {
    private UUID id;

    private UUID resourceId;
    private String resourceName;
    private ResourceType resourceType;
    private String resourceLocation;

    private UUID requestedById;
    private String requestedByName;
    private String requestedByEmail;

    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private Integer expectedAttendees;

    private BookingStatus status;
    private String reviewReason;
    private String cancelReason;
    private UUID reviewedById;
    private String reviewedByName;
    private Instant reviewedAt;

    private Instant createdAt;
    private Instant updatedAt;
}