package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.ApiResponse;
import com.smartcampus.hub.dto.NotificationDTO;
import com.smartcampus.hub.dto.NotificationSettingDTO;
import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST endpoints for the Notifications module.
 *
 * <p>All routes under /api/v1/notifications are authenticated.
 * The /broadcast endpoint is restricted to ROLE_ADMIN.</p>
 */
@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // ─── Notification CRUD ────────────────────────────────────────────────────

    /**
     * GET /api/v1/notifications
     * Returns the current user's notifications (newest first, max 50).
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getNotifications(
            @AuthenticationPrincipal User currentUser) {

        List<NotificationDTO> data = notificationService.getNotifications(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved", data));
    }

    /**
     * GET /api/v1/notifications/unread-count
     * Returns a simple count used by the navbar badge.
     */
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(
            @AuthenticationPrincipal User currentUser) {

        long count = notificationService.getUnreadCount(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Unread count", Map.of("count", count)));
    }

    /**
     * PATCH /api/v1/notifications/{id}/read
     * Marks a single notification as read.
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationDTO>> markAsRead(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser) {

        NotificationDTO dto = notificationService.markAsRead(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", dto));
    }

    /**
     * PATCH /api/v1/notifications/read-all
     * Marks every unread notification for the current user as read.
     */
    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal User currentUser) {

        notificationService.markAllAsRead(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }

    /**
     * DELETE /api/v1/notifications/{id}
     * Permanently deletes a notification owned by the current user.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser) {

        notificationService.deleteNotification(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Notification deleted", null));
    }

    // ─── Settings ─────────────────────────────────────────────────────────────

    /**
     * GET /api/v1/notifications/settings
     * Returns the current user's notification preferences (lazy-creates defaults).
     */
    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<NotificationSettingDTO>> getSettings(
            @AuthenticationPrincipal User currentUser) {

        NotificationSettingDTO dto = notificationService.getSettings(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Settings retrieved", dto));
    }

    /**
     * PUT /api/v1/notifications/settings
     * Updates the current user's notification preferences.
     */
    @PutMapping("/settings")
    public ResponseEntity<ApiResponse<NotificationSettingDTO>> updateSettings(
            @AuthenticationPrincipal User currentUser,
            @RequestBody NotificationSettingDTO dto) {

        NotificationSettingDTO updated = notificationService.updateSettings(currentUser.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Settings updated", updated));
    }

    // ─── Admin broadcast ──────────────────────────────────────────────────────

    /**
     * POST /api/v1/notifications/broadcast
     * Admin-only: sends a SYSTEM notification to all active users.
     *
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
