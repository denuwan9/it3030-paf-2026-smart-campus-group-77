package com.smartcampus.hub.dto;

import com.smartcampus.hub.entity.ResourceStatus;
import com.smartcampus.hub.entity.ResourceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceDTO {
    private UUID id;
    private String name;
    private String description;
    private ResourceType type;
    private Integer quantity;
    private ResourceStatus status;
    private UUID facilityId;
}
