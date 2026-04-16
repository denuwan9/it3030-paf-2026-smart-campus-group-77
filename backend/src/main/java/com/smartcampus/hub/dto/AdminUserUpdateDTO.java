package com.smartcampus.hub.dto;

import com.smartcampus.hub.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for Admin-only user updates.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserUpdateDTO {
    private String password; // Optional: Overwrites current password hash
    private Role role;       // New Role for the user
    private Boolean isActive; // Account activation status
}
