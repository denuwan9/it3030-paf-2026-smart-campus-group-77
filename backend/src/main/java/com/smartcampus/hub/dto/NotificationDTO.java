package com.smartcampus.hub.dto;

import com.smartcampus.hub.entity.NotificationType;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

/**
 * Read-only DTO returned to the client for each notification.
 */
@Data
@Builder
public class NotificationDTO {

    private UUID id;
    private UUID recipientId;
    private NotificationType type;
    private String title;
    private String message;
    private String actionUrl;
    private Boolean isRead;
    private Boolean isAnnouncement;
    private Instant createdAt;
}
