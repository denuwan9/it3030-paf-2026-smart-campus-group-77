package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.*;
import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.service.NotificationService;
import com.smartcampus.hub.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {

    private final UserService userService;
    private final NotificationService notificationService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success("Users fetched successfully", userService.getAllUsers()));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<User>> updateUser(@PathVariable UUID id, @RequestBody AdminUserUpdateDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", userService.adminUpdateUser(id, dto)));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    @GetMapping("/users/summary")
    public ResponseEntity<ApiResponse<List<UserSummaryDTO>>> getUserSummary() {
        List<UserSummaryDTO> summary = userService.getAllUsers().stream()
                .filter(User::getIsActive)
                .map(u -> UserSummaryDTO.builder()
                        .id(u.getId())
                        .fullName(u.getFullName())
                        .email(u.getEmail())
                        .role(u.getRole())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("User summary fetched", summary));
    }

    @PostMapping("/announcements")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> createAnnouncement(@RequestBody AnnouncementDTO dto) {
        int count = notificationService.createTargetedAnnouncement(dto);
        return ResponseEntity.ok(ApiResponse.success("Announcement broadcast to " + count + " users", Map.of("recipientCount", count)));
    }
}
