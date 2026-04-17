package com.smartcampus.hub.dto;

import com.smartcampus.hub.entity.FacilityStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacilityDTO {
    private UUID id;
    private String name;
    private String description;
    private String location;
    private Integer capacity;
    private FacilityStatus status;
    private String imageUrl;
}
