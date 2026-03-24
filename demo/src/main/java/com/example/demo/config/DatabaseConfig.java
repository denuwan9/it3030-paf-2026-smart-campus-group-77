package com.example.demo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class DatabaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);

    @Bean
    public CommandLineRunner verifyConnection(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                logger.info("Verifying database connection...");
                jdbcTemplate.execute("SELECT 1");
                logger.info("✅ Database connection to Supabase (PostgreSQL) successfully verified!");
            } catch (Exception e) {
                logger.error("❌ Failed to connect to the database. Error: {}", e.getMessage());
            }
        };
    }
}
