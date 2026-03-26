package com.smartcampus.hub.entity;

/**
 * RBAC roles used across the Smart Campus Hub.
 * Stored as string in the database (EnumType.STRING).
 */
public enum Role {
    ROLE_USER,
    ROLE_ADMIN,
    ROLE_TECHNICIAN
}
