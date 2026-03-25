package com.example.demo.service;

import com.example.demo.dto.NotificationResponse;
import com.example.demo.entity.Notification;
import com.example.demo.entity.Notification.NotificationType;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Core service for Module D — Notifications.
 *
 * <p>Other modules (Bookings, Maintenance) call {@link #createNotification}
 * as a simple event hook — they only need to know the target user's database ID
 * and a message string.  The notification type is passed as an enum to keep the
 * API discoverable and prevent magic-string bugs.
 *
 * <h3>Integration example (Booking module)</h3>
 * <pre>{@code
 *   // Inside BookingService, after status change:
 *   notificationService.createNotification(
 *       booking.getUserId(),
 *       "Your booking #" + booking.getId() + " has been APPROVED.",
 *       NotificationType.BOOKING_APPROVED
 *   );
 * }</pre>
 */
@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    // ── createNotification ────────────────────────────────────────────────────

    /**
     * Creates and persists a notification for the given user.
     * This is the primary integration point for other modules.
     *
     * @param userId  target user's database ID
     * @param message human-readable notification text (max 512 chars)
     * @param type    one of the {@link NotificationType} values
     * @return the persisted {@link Notification} entity
     * @throws ResourceNotFoundException if {@code userId} does not exist
     * @throws BadRequestException       if {@code message} is blank
     */
    @Transactional
    public Notification createNotification(Long userId, String message, NotificationType type) {
        // Validate user exists so callers get a clear error on misconfiguration.
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cannot create notification — user not found with id: " + userId));

        if (message == null || message.isBlank()) {
            throw new BadRequestException("Notification message must not be blank.");
        }

        Notification notification = Notification.builder()
                .userId(userId)
                .message(message.length() > 512 ? message.substring(0, 509) + "..." : message)
                .type(type)
                .isRead(false)
                .build();

        Notification saved = notificationRepository.save(notification);
        logger.info("Notification created [id={}, userId={}, type={}]",
                saved.getId(), userId, type);
        return saved;
    }

    /**
     * Convenience overload that defaults to {@link NotificationType#SYSTEM}.
     * Keeps call sites in other modules concise for generic messages.
     *
     * @param userId  target user's database ID
     * @param message human-readable notification text
     * @return the persisted {@link Notification} entity
     */
    @Transactional
    public Notification createNotification(Long userId, String message) {
        return createNotification(userId, message, NotificationType.SYSTEM);
    }

    // ── Read operations ───────────────────────────────────────────────────────

    /**
     * Returns all notifications for a user, newest first.
     * Called by {@code GET /api/notifications}.
     *
     * @param userId the requesting user's database ID
     */
    public List<NotificationResponse> getNotificationsForUser(Long userId) {
        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Returns only unread notifications for use in UI badge / summary views.
     *
     * @param userId the requesting user's database ID
     */
    public List<NotificationResponse> getUnreadNotificationsForUser(Long userId) {
        return notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /** Returns the count of unread notifications (for the bell-icon badge). */
    public long countUnread(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    // ── Write operations ──────────────────────────────────────────────────────

    /**
     * Marks a single notification as read.
     * Users may only mark their own notifications — ownership is checked here.
     *
     * @param notificationId the notification to mark
     * @param userId         the authenticated user's ID (ownership guard)
     * @throws ResourceNotFoundException if the notification does not exist
     * @throws BadRequestException       if the notification belongs to a different user
     */
    @Transactional
    public NotificationResponse markAsRead(Long notificationId, Long userId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Notification not found with id: " + notificationId));

        if (!n.getUserId().equals(userId)) {
            throw new BadRequestException("Notification id=" + notificationId +
                    " does not belong to the authenticated user.");
        }

        n.setRead(true);
        return toResponse(notificationRepository.save(n));
    }

    /**
     * Marks every unread notification for a user as read in bulk.
     * Called by {@code PATCH /api/notifications/read-all}.
     *
     * @param userId the authenticated user's ID
     * @return number of records updated
     */
    @Transactional
    public int markAllAsRead(Long userId) {
        int updated = notificationRepository.markAllReadByUserId(userId);
        logger.info("Marked {} notification(s) as read for userId={}", updated, userId);
        return updated;
    }

    // ── Mapper ────────────────────────────────────────────────────────────────

    private NotificationResponse toResponse(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getUserId(),
                n.getMessage(),
                n.getType(),
                n.isRead(),
                n.getCreatedAt()
        );
    }
}
