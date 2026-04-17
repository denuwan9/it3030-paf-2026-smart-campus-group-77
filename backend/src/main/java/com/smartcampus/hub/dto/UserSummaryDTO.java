package com.smartcampus.hub.dto;

import com.smartcampus.hub.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDTO {
    private UUID id;
    private String fullName;
    private String email;
    private Role role;
}
