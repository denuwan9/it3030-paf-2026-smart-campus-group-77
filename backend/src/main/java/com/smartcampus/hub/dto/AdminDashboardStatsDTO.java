package com.smartcampus.hub.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminDashboardStatsDTO {
    private long totalResources;
    private long activeBookings;
    private long pendingTickets;
    private long activeUsers;
    private long totalFacilities;
}
