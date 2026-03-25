package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Role is required")
    private String role; // ROLE_USER, ROLE_TECHNICIAN, ROLE_ADMIN

    /**
     * Soft-delete flag. When {@code false}, the account is deactivated
     * and the user cannot authenticate. Defaults to {@code true} on creation.
     */
    @Builder.Default
    @Column(nullable = false)
    private boolean isActive = true;

    /** Timestamp recorded when the user self-deactivates their account. */
    private LocalDateTime deactivatedAt;

    /** OAuth2 provider used for sign-in (e.g. "google"). */
    private String provider;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private UserPreferences preferences;
}

