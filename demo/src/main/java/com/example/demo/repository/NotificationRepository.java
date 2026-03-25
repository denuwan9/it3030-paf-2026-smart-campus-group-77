package com.example.demo.repository;

import com.example.demo.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /**
     * All notifications for a user, newest first.
     * Used by {@code GET /api/notifications}.
     */
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * Unread notifications only — used for the badge count on the web UI.
     */
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);

    /** Count of unread notifications for a user (for the bell badge). */
    long countByUserIdAndIsReadFalse(Long userId);

    /**
     * Bulk-mark all of a user's notifications as read.
     * Called by {@code PATCH /api/notifications/read-all}.
     */
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.userId = :userId AND n.isRead = false")
    int markAllReadByUserId(Long userId);
}
