package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO for updating user profile details.
 */
public record UserProfileUpdateRequest(
        @NotBlank(message = "Full name is required")
        String fullName,

        String phoneNumber,
        String studentId,
        String profilePictureUrl
) {}
