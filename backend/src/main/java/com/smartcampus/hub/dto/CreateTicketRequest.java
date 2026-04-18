package com.smartcampus.hub.dto;

import com.smartcampus.hub.entity.TicketPriority;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTicketRequest {
    private String title;
    private String description;
    private String location;
    private String category;
    private TicketPriority priority;
}
