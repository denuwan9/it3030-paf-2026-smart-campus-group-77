package com.smartcampus.hub.config;

import com.smartcampus.hub.entity.*;
import com.smartcampus.hub.repository.FacilityRepository;
import com.smartcampus.hub.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Temporary utility to synchronize database schema and seed initial data.
 */
@Configuration
@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseInitializer implements CommandLineRunner {

    private final FacilityRepository facilityRepository;
    private final ResourceRepository resourceRepository;

    @Override
    public void run(String... args) {
        log.info("Database schema synchronization check started...");
        try {
            // Hibernate's ddl-auto=update now handles these columns via the User entity.
            log.info("Privacy columns are now managed by Hibernate entity synchronization.");
            log.info("Database schema synchronization completed successfully.");
        } catch (Exception e) {
            log.warn("Database initialization notice: {}.", e.getMessage());
        }

        seedData();
    }

    private void seedData() {
        if (facilityRepository.count() == 0) {
            log.info("Seeding initial facilities and resources for testing...");

            // 1. Seed Facilities
            Facility f1 = Facility.builder()
                    .name("Main Auditorium")
                    .description("Grand auditorium with 500+ seating capacity.")
                    .location("Administration Block, Floor 1")
                    .capacity(500)
                    .status(FacilityStatus.AVAILABLE)
                    .build();

            Facility f2 = Facility.builder()
                    .name("Advanced Computing Lab")
                    .description("Specialized lab for AI and Data Science research.")
                    .location("Computing Centre, Floor 3")
                    .capacity(50)
                    .status(FacilityStatus.AVAILABLE)
                    .build();

            Facility f3 = Facility.builder()
                    .name("Executive Meeting Room")
                    .description("Modern conference room with hybrid meeting support.")
                    .location("Main Building, Floor 2")
                    .capacity(15)
                    .status(FacilityStatus.AVAILABLE)
                    .build();

            List<Facility> facilities = facilityRepository.saveAll(List.of(f1, f2, f3));

            // 2. Seed Resources into Facilities
            Resource r1 = Resource.builder()
                    .name("Panasonic 4K Projector")
                    .description("High-brightness projector for daylight viewing.")
                    .type(ResourceType.EQUIPMENT)
                    .quantity(1)
                    .status(ResourceStatus.AVAILABLE)
                    .facility(facilities.get(0))
                    .build();

            Resource r2 = Resource.builder()
                    .name("Dell Precision Workstations")
                    .description("Workstations with NVIDIA RTX GPUs.")
                    .type(ResourceType.EQUIPMENT)
                    .quantity(30)
                    .status(ResourceStatus.AVAILABLE)
                    .facility(facilities.get(1))
                    .build();

            Resource r3 = Resource.builder()
                    .name("Conference Phone")
                    .description("High-fidelity audio conference system.")
                    .type(ResourceType.EQUIPMENT)
                    .quantity(1)
                    .status(ResourceStatus.AVAILABLE)
                    .facility(facilities.get(2))
                    .build();

            resourceRepository.saveAll(List.of(r1, r2, r3));
            log.info("Successfully seeded facilities and resources.");
        }
    }
}
