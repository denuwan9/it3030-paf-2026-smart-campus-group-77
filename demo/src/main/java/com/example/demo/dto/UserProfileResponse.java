package com.example.demo.dto;

import java.time.LocalDateTime;

/**
 * Read-only projection of the authenticated user's profile returned by
 * {@code GET /api/users/me}.  Avoids exposing internal entity fields like
 * {@code preferences} (lazy-loaded) to the API consumer.
 */
public record UserProfileResponse(
        Long id,
        String fullName,
        String email,
        String role,
        String phoneNumber,
        String studentId,
        String profilePictureUrl,
        boolean isActive,
        String provider,
        LocalDateTime createdAt
) {}
