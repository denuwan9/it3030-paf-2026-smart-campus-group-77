package com.smartcampus.hub.dto;

import com.smartcampus.hub.entity.ResourceStatus;
import com.smartcampus.hub.entity.ResourceType;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.time.LocalTime;

@Data
public class UpdateResourceRequest {
    private String name;
    private ResourceType type;

    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    private String location;
    private LocalTime availabilityStart;
    private LocalTime availabilityEnd;
    private ResourceStatus status;
    private String description;
}