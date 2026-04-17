package com.smartcampus.hub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementDTO {
    /**
     * ALL, ROLE, USER
     */
    private String targetType;

    /**
     * Role name (e.g. ROLE_USER) or User UUID string
     */
    private String targetValue;

    private String message;
}
