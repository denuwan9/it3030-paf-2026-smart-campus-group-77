package com.smartcampus.hub.dto;

import com.smartcampus.hub.entity.ResourceStatus;
import com.smartcampus.hub.entity.ResourceType;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
public class ResourceResponse {
    private UUID id;
    private String name;
    private ResourceType type;
    private Integer capacity;
    private String location;
    private LocalTime availabilityStart;
    private LocalTime availabilityEnd;
    private ResourceStatus status;
    private String description;
    private Instant createdAt;
    private Instant updatedAt;
}