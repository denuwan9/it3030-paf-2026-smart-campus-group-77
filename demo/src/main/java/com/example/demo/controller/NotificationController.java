package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.NotificationResponse;
import com.example.demo.entity.User;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Module D — Notifications.
 *
 * <p>All endpoints derive the acting user from the JWT (via
 * {@link Authentication#getName()} which holds the email).  The email is
 * resolved to a database user ID once per request; no session is used.
 *
 * <h3>Endpoint summary</h3>
 * <ul>
 *   <li>{@code GET  /api/notifications}           — all notifications, newest first</li>
 *   <li>{@code GET  /api/notifications/unread}     — unread only</li>
 *   <li>{@code GET  /api/notifications/unread/count} — badge count</li>
 *   <li>{@code PATCH /api/notifications/{id}/read} — mark single as read</li>
 *   <li>{@code PATCH /api/notifications/read-all}  — mark all as read</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/notifications")
@PreAuthorize("isAuthenticated()")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    // ── GET /api/notifications ─────────────────────────────────────────────────

    /**
     * Returns all notifications for the authenticated user, newest first.
     *
     * <ul>
     *   <li>{@code 200 OK} — list returned (may be empty)</li>
     *   <li>{@code 401 Unauthorized} — missing or invalid JWT</li>
     * </ul>
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getMyNotifications(
            Authentication authentication) {

        Long userId = resolveUserId(authentication);
        List<NotificationResponse> notifications =
                notificationService.getNotificationsForUser(userId);

        return ResponseEntity.ok(ApiResponse.ok(
                notifications.size() + " notification(s) retrieved.", notifications));
    }

    // ── GET /api/notifications/unread ──────────────────────────────────────────

    /**
     * Returns only unread notifications for the authenticated user.
     * Useful for populating the notification dropdown on first open.
     */
    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getUnreadNotifications(
            Authentication authentication) {

        Long userId = resolveUserId(authentication);
        List<NotificationResponse> unread =
                notificationService.getUnreadNotificationsForUser(userId);

        return ResponseEntity.ok(ApiResponse.ok(
                unread.size() + " unread notification(s).", unread));
    }

    // ── GET /api/notifications/unread/count ────────────────────────────────────

    /**
     * Returns the count of unread notifications for the bell-icon badge.
     *
     * <p>Intentionally lightweight — returns a single long, not a full list.
     */
    @GetMapping("/unread/count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(Authentication authentication) {
        Long userId = resolveUserId(authentication);
        long count = notificationService.countUnread(userId);
        return ResponseEntity.ok(ApiResponse.ok("Unread notification count.", count));
    }

    // ── PATCH /api/notifications/{id}/read ────────────────────────────────────

    /**
     * Marks a single notification as read.
     *
     * <p>Users may only mark their own notifications. Attempting to mark
     * another user's notification returns {@code 400 Bad Request}.
     *
     * <ul>
     *   <li>{@code 200 OK} — notification marked as read, updated record returned</li>
     *   <li>{@code 400 Bad Request} — notification belongs to another user</li>
     *   <li>{@code 404 Not Found} — no notification with the given id</li>
     * </ul>
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(
            @PathVariable Long id,
            Authentication authentication) {

        Long userId = resolveUserId(authentication);
        NotificationResponse updated = notificationService.markAsRead(id, userId);
        return ResponseEntity.ok(ApiResponse.ok("Notification marked as read.", updated));
    }

    // ── PATCH /api/notifications/read-all ─────────────────────────────────────

    /**
     * Bulk-marks all of the authenticated user's unread notifications as read.
     * Called when the user opens the notification panel and dismisses everything.
     */
    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(Authentication authentication) {
        Long userId = resolveUserId(authentication);
        int count = notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.ok(count + " notification(s) marked as read."));
    }

    // ── Private helper ─────────────────────────────────────────────────────────

    /**
     * Resolves the authenticated user's email to their database ID.
     * Throws {@link ResourceNotFoundException} if the user record is missing,
     * which {@link com.example.demo.exception.GlobalExceptionHandler} converts to 404.
     */
    private Long resolveUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Authenticated user not found in database: " + email));
        return user.getId();
    }
}
