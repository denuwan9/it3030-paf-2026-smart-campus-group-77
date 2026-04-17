package com.smartcampus.hub.repository;

import com.smartcampus.hub.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    List<Notification> findByRecipientIdOrderByCreatedAtDesc(UUID recipientId);

    long countByRecipientIdAndIsReadFalse(UUID recipientId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.recipientId = :recipientId AND n.isRead = false")
    void markAllAsReadByRecipientId(@Param("recipientId") UUID recipientId);

    @Modifying
    @Query("UPDATE Notification n SET n.isArchived = true WHERE n.type = :type AND n.createdAt < :cutoff AND n.isArchived = false")
    int archiveOldSystemAlerts(@Param("cutoff") java.time.Instant cutoff, @Param("type") com.smartcampus.hub.entity.NotificationType type);
}
