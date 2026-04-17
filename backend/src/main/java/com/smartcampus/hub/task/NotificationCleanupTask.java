package com.smartcampus.hub.task;

import com.smartcampus.hub.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

/**
 * Periodically cleans up notifications by archiving old system alerts.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationCleanupTask {

    private final NotificationRepository notificationRepository;

    /**
     * Mark SYSTEM alerts as 'Archived' after 7 days.
     * Runs every day at midnight.
     */
    @Transactional
    @Scheduled(cron = "0 0 0 * * *")
    public void archiveOldSystemAlerts() {
        Instant cutoff = Instant.now().minus(7, ChronoUnit.DAYS);
        log.info("Starting automated cleanup: Archiving SYSTEM alerts created before {}", cutoff);
        
        int archivedCount = notificationRepository.archiveOldSystemAlerts(cutoff, com.smartcampus.hub.entity.NotificationType.SYSTEM);
        
        log.info("Cleanup complete. {} notifications were archived.", archivedCount);
    }
}
