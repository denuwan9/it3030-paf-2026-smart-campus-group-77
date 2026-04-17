package com.smartcampus.hub.config;

import com.smartcampus.hub.entity.Resource;
import com.smartcampus.hub.entity.ResourceStatus;
import com.smartcampus.hub.entity.ResourceType;
import com.smartcampus.hub.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.List;

/**
 * Temporary utility to synchronize database schema for new privacy fields.
 * This runs on startup and ensures the required columns exist in Supabase.
 */
@Configuration
@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseInitializer implements CommandLineRunner {

    private final ResourceRepository resourceRepository;

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

        seedResources();
    }

    private void seedResources() {
        if (resourceRepository.count() == 0) {
            log.info("Seeding initial resources for testing...");
            Resource r1 = Resource.builder()
                    .name("Main Auditorium")
                    .type(ResourceType.LECTURE_HALL)
                    .capacity(200)
                    .location("Building A, 1st Floor")
                    .availabilityStart(LocalTime.of(8, 0))
                    .availabilityEnd(LocalTime.of(18, 0))
                    .status(ResourceStatus.ACTIVE)
                    .description("Large lecture hall equipped with dual projectors and surround sound.")
                    .build();

            Resource r2 = Resource.builder()
                    .name("Software Engineering Lab")
                    .type(ResourceType.LAB)
                    .capacity(40)
                    .location("Computing Centre, Floor 3")
                    .availabilityStart(LocalTime.of(8, 30))
                    .availabilityEnd(LocalTime.of(17, 30))
                    .status(ResourceStatus.ACTIVE)
                    .description("High-performance workstations configured for heavy software development.")
                    .build();

            Resource r3 = Resource.builder()
                    .name("Executive Meeting Room")
                    .type(ResourceType.MEETING_ROOM)
                    .capacity(15)
                    .location("Administration Block")
                    .availabilityStart(LocalTime.of(9, 0))
                    .availabilityEnd(LocalTime.of(17, 0))
                    .status(ResourceStatus.ACTIVE)
                    .description("Comfortable meeting room with video-conferencing support.")
                    .build();

            Resource r4 = Resource.builder()
                    .name("Sony 4K Projector Pro")
                    .type(ResourceType.EQUIPMENT)
                    .capacity(1)
                    .location("IT Support Desk")
                    .availabilityStart(LocalTime.of(8, 0))
                    .availabilityEnd(LocalTime.of(16, 0))
                    .status(ResourceStatus.ACTIVE)
                    .description("Portable 4K smart projector for presentations.")
                    .build();

            resourceRepository.saveAll(List.of(r1, r2, r3, r4));
            log.info("Successfully added 4 initial resources.");
        }
    }
}
