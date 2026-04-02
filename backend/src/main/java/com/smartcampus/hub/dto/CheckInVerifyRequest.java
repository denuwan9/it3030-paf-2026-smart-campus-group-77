package com.smartcampus.hub.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CheckInVerifyRequest {
    @NotBlank(message = "token is required")
    private String token;
}
