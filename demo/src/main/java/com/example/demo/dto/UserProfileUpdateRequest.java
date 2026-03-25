package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO for updating user profile details.
 */
public record UserProfileUpdateRequest(
        @NotBlank(message = "Name is required")
        String name,

        String phoneNumber,

        String profilePictureUrl
) {}
