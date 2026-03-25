package com.example.demo.dto;

import com.example.demo.entity.Notification.NotificationType;
import java.time.LocalDateTime;

/**
 * Read-only projection of a {@link com.example.demo.entity.Notification} sent to
 * the web UI via {@code GET /api/notifications}.
 */
public record NotificationResponse(
        Long id,
        Long userId,
        String message,
        NotificationType type,
        boolean isRead,
        LocalDateTime createdAt
) {}
