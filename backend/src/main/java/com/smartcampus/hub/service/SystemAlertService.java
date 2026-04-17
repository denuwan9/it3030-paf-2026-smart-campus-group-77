package com.smartcampus.hub.service;

import com.smartcampus.hub.entity.NotificationType;
import com.smartcampus.hub.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service to handle automated system-level alerts (Security & Maintenance).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SystemAlertService {

    private final NotificationService notificationService;

    /**
     * Generate an alert for security events like login or password change.
     */
    @Transactional
    public void sendSecurityAlert(User user, String action) {
        log.info("Generating security alert for user: {} (ID: {}) for action: {}", user.getEmail(), user.getId(), action);
        
        String title = "Security Alert";
        String message = String.format("A security event (%s) was detected on your account. If this was not you, please contact support immediately.", action);
        
        createNotification(user.getId(), NotificationType.SECURITY, title, message, "/profile/security");
    }

    /**
     * Broadcast an alert to users impacted by resource maintenance.
     */
    @Transactional
    public void sendMaintenanceBroadcast(String resourceName, List<UUID> userIds) {
        log.info("Broadcasting maintenance alert for resource: {} to {} users", resourceName, userIds.size());
        
        String title = "Maintenance Alert";
        String message = String.format("Resource '%s' is now OUT_OF_SERVICE for maintenance. Any active or pending bookings for this resource may be affected.", resourceName);
        
        for (UUID userId : userIds) {
            createNotification(userId, NotificationType.SYSTEM, title, message, "/bookings");
        }
    }

    /**
     * Internal helper to create a notification.
     */
    private void createNotification(UUID recipientId, NotificationType type, String title, String message, String actionUrl) {
        notificationService.createNotification(recipientId, type, title, message, actionUrl);
    }
}
