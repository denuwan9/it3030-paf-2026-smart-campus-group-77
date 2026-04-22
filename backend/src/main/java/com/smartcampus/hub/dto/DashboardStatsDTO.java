package com.smartcampus.hub.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsDTO {
    private long activeBookings;

    private long totalResources;
    private long notificationsCount;
}
