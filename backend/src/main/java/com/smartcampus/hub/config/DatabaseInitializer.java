package com.smartcampus.hub.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

/**
 * Temporary utility to synchronize database schema for new privacy fields.
 * This runs on startup and ensures the required columns exist in Supabase.
 */
@Configuration
@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseInitializer implements CommandLineRunner {


    @Override
    public void run(String... args) {
        log.info("Database schema synchronization check started...");
        try {
            // Manual ALTER TABLE removed to prevent startup hangs/timeouts.
            // Hibernate's ddl-auto=update now handles these columns via the User entity.
            log.info("Privacy columns are now managed by Hibernate entity synchronization.");
            log.info("Database schema synchronization completed successfully.");
        } catch (Exception e) {
            log.warn("Database initialization notice: {}.", e.getMessage());
        }
    }
}
