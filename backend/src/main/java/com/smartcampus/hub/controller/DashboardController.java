package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.AdminDashboardStatsDTO;
import com.smartcampus.hub.dto.ApiResponse;
import com.smartcampus.hub.dto.DashboardStatsDTO;
import com.smartcampus.hub.dto.RecentActivityDTO;
import com.smartcampus.hub.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/user-stats")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getUserStats() {
        return ResponseEntity.ok(ApiResponse.success("User stats fetched", dashboardService.getUserStats()));
    }

    @GetMapping("/admin-stats")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<AdminDashboardStatsDTO>> getAdminStats() {
        return ResponseEntity.ok(ApiResponse.success("Admin stats fetched", dashboardService.getAdminStats()));
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<ApiResponse<List<RecentActivityDTO>>> getRecentActivity() {
        return ResponseEntity.ok(ApiResponse.success("Recent activity fetched", dashboardService.getRecentActivity()));
    }
}
