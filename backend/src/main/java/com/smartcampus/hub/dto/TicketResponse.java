package com.smartcampus.hub.dto;

import com.smartcampus.hub.entity.TicketPriority;
import com.smartcampus.hub.entity.TicketStatus;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponse {
    private UUID id;
    private String title;
    private String description;
    private String location;
    private String category;
    private TicketStatus status;
    private TicketPriority priority;
    private String reporterName;
    private UUID reporterId;
    private String assigneeName;
    private UUID assigneeId;
    private Instant createdAt;
    private Instant updatedAt;
}
