package com.smartcampus.hub.dto;

import lombok.Builder;
import lombok.Data;
import java.time.Instant;

@Data
@Builder
public class RecentActivityDTO {
    private String id;
    private String title;
    private String type; // e.g., "BOOKING"
    private String status;
    private String user;
    private Instant timestamp;
}
