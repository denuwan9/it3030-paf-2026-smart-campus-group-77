package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * Request body for {@code PUT /api/admin/users/{id}/role}.
 *
 * <p>The {@code role} field is validated to be one of the three permitted values.
 */
public record UpdateRoleRequest(

        @NotBlank(message = "Role must not be blank")
        @Pattern(
            regexp = "ROLE_USER|ROLE_TECHNICIAN|ROLE_ADMIN",
            message = "Role must be one of: ROLE_USER, ROLE_TECHNICIAN, ROLE_ADMIN"
        )
        String role
) {}
