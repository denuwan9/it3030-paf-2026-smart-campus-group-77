package com.smartcampus.hub.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
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

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        log.info("Checking database schema for missing privacy columns...");
        try {
            // Add is_email_public if missing
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_email_public BOOLEAN DEFAULT FALSE");
            log.info("Column 'is_email_public' verified/added.");

            // Add is_phone_public if missing
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_phone_public BOOLEAN DEFAULT FALSE");
            log.info("Column 'is_phone_public' verified/added.");

            // Ensure they are NOT NULL (if Hibernate requires it)
            jdbcTemplate.execute("UPDATE users SET is_email_public = FALSE WHERE is_email_public IS NULL");
            jdbcTemplate.execute("UPDATE users SET is_phone_public = FALSE WHERE is_phone_public IS NULL");
            
            log.info("Database schema synchronization completed successfully.");
        } catch (Exception e) {
            log.warn("Database initialization notice: {}. This is expected if columns already exist or permissions are restricted.", e.getMessage());
        }
    }
}
