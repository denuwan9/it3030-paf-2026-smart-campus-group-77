package com.smartcampus.hub.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * Per-user preferences that control which notification types they receive.
 * One row per user — created lazily on first access.
 */
@Entity
@Table(name = "notification_settings", uniqueConstraints = {
        @UniqueConstraint(columnNames = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    /** Whether the user wants email copies of notifications. */
    @Column(name = "email_enabled", nullable = false)
    @Builder.Default
    private Boolean emailEnabled = true;

    @Column(name = "booking_alerts", nullable = false)
    @Builder.Default
    private Boolean bookingAlerts = true;

    @Column(name = "ticket_alerts", nullable = false)
    @Builder.Default
    private Boolean ticketAlerts = true;

    @Column(name = "system_alerts", nullable = false)
    @Builder.Default
    private Boolean systemAlerts = true;

    @Column(name = "announcement_alerts", nullable = false)
    @Builder.Default
    private Boolean announcementAlerts = true;
}
