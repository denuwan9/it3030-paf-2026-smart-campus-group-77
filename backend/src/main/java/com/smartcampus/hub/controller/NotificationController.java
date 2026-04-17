package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.ApiResponse;
import com.smartcampus.hub.dto.NotificationDTO;
import com.smartcampus.hub.dto.NotificationSettingDTO;
import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.service.NotificationService;
import com.smartcampus.hub.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST endpoints for the Notifications module.
 * Uses UserService.getCurrentUser() to resolve the authenticated user
 * (consistent with all other controllers in this project — the JWT filter
 * stores the email String as the principal, not the User entity).
 */
@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService         userService;

    // ─── Helper ───────────────────────────────────────────────────────────────

    /** Resolves the currently authenticated user via SecurityContextHolder → DB. */
    private UUID currentUserId() {
        return userService.getCurrentUser().getId();
    }

    // ─── Notification CRUD ────────────────────────────────────────────────────

    /**
     * GET /api/v1/notifications
     * Returns the current user's notifications (newest first, max 50).
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getNotifications() {
        List<NotificationDTO> data = notificationService.getNotifications(currentUserId());
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved", data));
    }

    /**
     * GET /api/v1/notifications/unread-count
     * Returns the unread count used by the navbar badge.
     */
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount() {
        long count = notificationService.getUnreadCount(currentUserId());
        return ResponseEntity.ok(ApiResponse.success("Unread count", Map.of("count", count)));
    }

    /**
     * PATCH /api/v1/notifications/{id}/read
     * Marks a single notification as read.
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationDTO>> markAsRead(@PathVariable UUID id) {
        NotificationDTO dto = notificationService.markAsRead(id, currentUserId());
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", dto));
    }

    /**
     * PATCH /api/v1/notifications/read-all
     * Marks every unread notification for the current user as read.
     */
    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        notificationService.markAllAsRead(currentUserId());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }

    /**
     * DELETE /api/v1/notifications/{id}
     * Permanently deletes a notification owned by the current user.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable UUID id) {
        notificationService.deleteNotification(id, currentUserId());
        return ResponseEntity.ok(ApiResponse.success("Notification deleted", null));
    }

    // ─── Settings ─────────────────────────────────────────────────────────────

    /**
     * GET /api/v1/notifications/settings
     * Returns the current user's notification preferences (lazy-creates defaults).
     */
    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<NotificationSettingDTO>> getSettings() {
        NotificationSettingDTO dto = notificationService.getSettings(currentUserId());
        return ResponseEntity.ok(ApiResponse.success("Settings retrieved", dto));
    }

    /**
     * PUT /api/v1/notifications/settings
     * Updates the current user's notification preferences.
     */
    @PutMapping("/settings")
    public ResponseEntity<ApiResponse<NotificationSettingDTO>> updateSettings(
            @RequestBody NotificationSettingDTO dto) {
        NotificationSettingDTO updated = notificationService.updateSettings(currentUserId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Settings updated", updated));
    }

    // ─── Admin broadcast ──────────────────────────────────────────────────────

    /**
     * POST /api/v1/notifications/broadcast
     * Admin-only: sends a SYSTEM notification to all active users.
     * Body: { "title": "...", "message": "..." }
     */
    @PostMapping("/broadcast")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> broadcast(
            @RequestBody Map<String, String> body) {

        String title   = body.get("title");
        String message = body.get("message");

        if (title == null || title.isBlank() || message == null || message.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("'title' and 'message' are required"));
        }

        int count = notificationService.broadcastSystemNotification(title, message);
        return ResponseEntity.ok(ApiResponse.success(
                "Broadcast sent to " + count + " users",
                Map.of("recipientCount", count)
        ));
    }
}
