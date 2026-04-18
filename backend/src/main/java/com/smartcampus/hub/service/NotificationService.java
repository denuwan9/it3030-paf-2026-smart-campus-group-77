package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.*;
import com.smartcampus.hub.entity.*;
import com.smartcampus.hub.repository.NotificationRepository;
import com.smartcampus.hub.repository.NotificationSettingRepository;
import com.smartcampus.hub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Core service for the Notifications module.
 *
 * <p>Other services (Booking, Ticket, etc.) should call
 * {@link #createNotification} to deliver in-app alerts.
 * Admins can also broadcast system-wide messages via
 * {@link #broadcastSystemNotification}.</p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository       notificationRepo;
    private final NotificationSettingRepository settingRepo;
    private final UserRepository               userRepo;

    // ─── Read operations ─────────────────────────────────────────────────────

    /**
     * Returns all notifications for a user, newest first (max 50).
     */
    @Transactional(readOnly = true)
    public List<NotificationDTO> getNotifications(UUID userId) {
        return notificationRepo
                .findByRecipientIdOrderByCreatedAtDesc(userId)
                .stream()
                .filter(n -> !Boolean.TRUE.equals(n.getIsArchived()))
                .limit(50)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Returns the count of unread notifications for the badge.
     */
    @Transactional(readOnly = true)
    public long getUnreadCount(UUID userId) {
        return notificationRepo.countByRecipientIdAndIsReadFalse(userId);
    }

    // ─── Write operations ────────────────────────────────────────────────────

    /**
     * Marks a single notification as read.
     * Throws {@link AccessDeniedException} if the notification doesn't belong to the caller.
     */
    @Transactional
    public NotificationDTO markAsRead(UUID notificationId, UUID callerUserId) {
        Notification notification = notificationRepo.findById(notificationId)
                .orElseThrow(() -> new NoSuchElementException("Notification not found: " + notificationId));

        if (!notification.getRecipientId().equals(callerUserId)) {
            throw new AccessDeniedException("You do not own this notification.");
        }

        notification.setIsRead(true);
        return toDTO(notificationRepo.save(notification));
    }

    /**
     * Marks ALL unread notifications for the user as read.
     */
    @Transactional
    public void markAllAsRead(UUID userId) {
        notificationRepo.markAllAsReadByRecipientId(userId);
    }

    /**
     * Deletes a single notification owned by the caller.
     */
    @Transactional
    public void deleteNotification(UUID notificationId, UUID callerUserId) {
        Notification notification = notificationRepo.findById(notificationId)
                .orElseThrow(() -> new NoSuchElementException("Notification not found: " + notificationId));

        if (!notification.getRecipientId().equals(callerUserId)) {
            throw new AccessDeniedException("You do not own this notification.");
        }

        notificationRepo.delete(notification);
    }

    // ─── Internal creation hook ───────────────────────────────────────────────

    /**
     * Creates a notification for a specific user.
     * Call this from Booking, Ticket, or any other service to deliver alerts.
     *
     * @param recipientId target user UUID
     * @param type        notification category
     * @param title       short heading (max 255 chars)
     * @param message     full body text
     * @param actionUrl   optional deep-link (may be null)
     */
    @Transactional
    public NotificationDTO createNotification(UUID recipientId,
                                              NotificationType type,
                                              String title,
                                              String message,
                                              String actionUrl) {
        return createNotification(recipientId, type, title, message, actionUrl, false);
    }

    /**
     * Advanced version of createNotification that allows setting the announcement flag.
     */
    @Transactional
    public NotificationDTO createNotification(UUID recipientId,
                                              NotificationType type,
                                              String title,
                                              String message,
                                              String actionUrl,
                                              boolean isAnnouncement) {
        // Respect the user's category preferences
        NotificationSetting setting = getOrCreateSettings(recipientId);
        if (!isCategoryEnabled(setting, type)) {
            log.info("Notification suppressed for user {} — category {} is disabled in settings", recipientId, type);
            return null; 
        }

        Notification n = Notification.builder()
                .recipientId(recipientId)
                .type(type)
                .title(title)
                .message(message)
                .actionUrl(actionUrl)
                .isAnnouncement(isAnnouncement)
                .build();

        log.debug("Saving notification (Type: {}) for user {}", type, recipientId);
        return toDTO(notificationRepo.save(n));
    }

    /**
     * Creates a targeted announcement based on the provided selection.
     * Supports targeting ALL users, a specific ROLE, or a single USER.
     *
     * @param dto Announcement payload
     * @return Number of recipients targeted
     */
    @Transactional
    public int createTargetedAnnouncement(AnnouncementDTO dto) {
        String type = dto.getTargetType().toUpperCase();
        String val  = dto.getTargetValue();
        String msg  = dto.getMessage();

        List<User> targets;

        if ("ALL".equals(type)) {
            targets = userRepo.findAll().stream()
                    .filter(User::getIsActive)
                    .collect(Collectors.toList());
        } else if ("ROLE".equals(type)) {
            Role role = Role.valueOf(val);
            targets = userRepo.findAll().stream()
                    .filter(u -> u.getIsActive() && u.getRole() == role)
                    .collect(Collectors.toList());
        } else if ("USER".equals(type)) {
            User user = userRepo.findById(UUID.fromString(val))
                    .orElseThrow(() -> new NoSuchElementException("Target user not found: " + val));
            targets = List.of(user);
        } else {
            throw new IllegalArgumentException("Invalid target type: " + type);
        }

        for (User user : targets) {
            createNotification(
                    user.getId(),
                    NotificationType.ANNOUNCEMENT,
                    "Announcement",
                    msg,
                    null,
                    true
            );
        }

        log.info("Targeted announcement sent to {} recipients (Type: {})", targets.size(), type);
        return targets.size();
    }

    /**
     * Admin-only: sends a notification to every active user in the system.
     * @deprecated Use {@link #createTargetedAnnouncement} for more flexibility.
     */
    @Transactional
    public int broadcastSystemNotification(String title, String message) {
        return createTargetedAnnouncement(AnnouncementDTO.builder()
                .targetType("ALL")
                .targetValue("ALL_USERS")
                .message(message)
                .build());
    }

    // ─── Settings ─────────────────────────────────────────────────────────────

    /**
     * Returns the notification settings for a user, creating default settings
     * on first access (lazy initialisation).
     */
    @Transactional
    public NotificationSettingDTO getSettings(UUID userId) {
        NotificationSetting setting = getOrCreateSettings(userId);
        return toSettingDTO(setting);
    }

    /**
     * Persists updated notification preferences for a user.
     */
    @Transactional
    public NotificationSettingDTO updateSettings(UUID userId, NotificationSettingDTO dto) {
        NotificationSetting setting = getOrCreateSettings(userId);

        if (dto.getEmailEnabled()        != null) setting.setEmailEnabled(dto.getEmailEnabled());
        if (dto.getBookingAlerts()       != null) setting.setBookingAlerts(dto.getBookingAlerts());
        if (dto.getTicketAlerts()        != null) setting.setTicketAlerts(dto.getTicketAlerts());
        if (dto.getSystemAlerts()        != null) setting.setSystemAlerts(dto.getSystemAlerts());
        if (dto.getAnnouncementAlerts()  != null) setting.setAnnouncementAlerts(dto.getAnnouncementAlerts());
        if (dto.getSecurityAlerts()      != null) setting.setSecurityAlerts(dto.getSecurityAlerts());
        if (dto.getSoundEnabled()         != null) setting.setSoundEnabled(dto.getSoundEnabled());

        return toSettingDTO(settingRepo.save(setting));
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    /** Lazy-creates default settings if none exist yet. */
    private NotificationSetting getOrCreateSettings(UUID userId) {
        return settingRepo.findByUserId(userId).orElseGet(() -> {
            NotificationSetting defaults = NotificationSetting.builder()
                    .userId(userId)
                    .build();
            return settingRepo.save(defaults);
        });
    }

    private boolean isCategoryEnabled(NotificationSetting s, NotificationType type) {
        return switch (type) {
            case BOOKING      -> Boolean.TRUE.equals(s.getBookingAlerts());
            case TICKET       -> Boolean.TRUE.equals(s.getTicketAlerts());
            case SYSTEM       -> Boolean.TRUE.equals(s.getSystemAlerts());
            case ANNOUNCEMENT -> Boolean.TRUE.equals(s.getAnnouncementAlerts());
            case SECURITY     -> Boolean.TRUE.equals(s.getSecurityAlerts());
        };
    }

    private NotificationDTO toDTO(Notification n) {
        return NotificationDTO.builder()
                .id(n.getId())
                .recipientId(n.getRecipientId())
                .type(n.getType())
                .title(n.getTitle())
                .message(n.getMessage())
                .actionUrl(n.getActionUrl())
                .isRead(n.getIsRead())
                .isAnnouncement(n.getIsAnnouncement())
                .isArchived(n.getIsArchived())
                .createdAt(n.getCreatedAt())
                .build();
    }

    private NotificationSettingDTO toSettingDTO(NotificationSetting s) {
        NotificationSettingDTO dto = new NotificationSettingDTO();
        dto.setEmailEnabled(s.getEmailEnabled());
        dto.setBookingAlerts(s.getBookingAlerts());
        dto.setTicketAlerts(s.getTicketAlerts());
        dto.setSystemAlerts(s.getSystemAlerts());
        dto.setAnnouncementAlerts(s.getAnnouncementAlerts());
        dto.setSecurityAlerts(s.getSecurityAlerts());
        dto.setSoundEnabled(s.getSoundEnabled());
        return dto;
    }
}
