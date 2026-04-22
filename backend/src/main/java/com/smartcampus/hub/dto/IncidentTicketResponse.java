package com.smartcampus.hub.dto;

import com.smartcampus.hub.entity.TicketPriority;
import com.smartcampus.hub.entity.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentTicketResponse {
    private UUID id;
    private String category;
    private String description;
    private TicketPriority priority;
    private String location;
    private String contactDetails;
    private TicketStatus status;
    private List<String> attachmentUrls;
    private String rejectionReason;
    private String resolutionNotes;
    
    private String reporterName;
    private UUID reporterId;
    
    private String technicianName;
    private UUID technicianId;
    
    private Instant createdAt;
    private Instant updatedAt;
}
