package com.smartcampus.hub.dto;

import com.smartcampus.hub.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingDecisionRequest {

    @NotNull(message = "Decision is required")
    private BookingStatus decision;

    private String reason;
}