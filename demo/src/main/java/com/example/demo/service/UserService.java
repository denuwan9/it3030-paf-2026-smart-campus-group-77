package com.example.demo.service;

import com.example.demo.dto.PasswordUpdateRequest;
import com.example.demo.dto.UserProfileResponse;
import com.example.demo.dto.UserProfileUpdateRequest;
import com.example.demo.entity.User;
import com.example.demo.entity.UserPreferences;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.UserPreferencesRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    /** Whitelist of roles that can be assigned via the API. */
    private static final Set<String> ALLOWED_ROLES =
            Set.of("ROLE_USER", "ROLE_TECHNICIAN", "ROLE_ADMIN");

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserPreferencesRepository userPreferencesRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    // ──────────────────────────────────────────────────────────────────────────
    // Endpoint 1 — GET /api/users/me
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Returns the authenticated user's profile as a safe DTO (no lazy collections).
     *
     * @param email the subject extracted from the JWT by {@link com.example.demo.security.JwtAuthenticationFilter}
     * @throws ResourceNotFoundException if no matching user record exists
     */
    public UserProfileResponse getCurrentUserProfile(String email) {
        logger.info("🔍 [User] DB Lookup for profile email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Authenticated user not found in database: " + email));
        return toProfileResponse(user);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Endpoint 2 — POST /api/admin/users/sync
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Manual sync trigger. Returns a summary of all users currently in the
     * local database. In a production scenario this would also reconcile
     * records against an external identity provider.
     *
     * @return list of every user profile in the system
     */
    public List<UserProfileResponse> syncAllUsers() {
        List<User> users = userRepository.findAll();
        logger.info("Manual sync triggered — {} user(s) in database.", users.size());
        return users.stream().map(this::toProfileResponse).toList();
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Endpoint 3 — PUT /api/admin/users/{id}/role
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Promotes or changes a user's role.
     *
     * <p>Business rules:
     * <ul>
     *   <li>The new role must be one of {@code ROLE_USER}, {@code ROLE_TECHNICIAN},
     *       or {@code ROLE_ADMIN}.</li>
     *   <li>The target user must be active (deactivated accounts cannot be
     *       modified to prevent data inconsistency).</li>
     * </ul>
     *
     * @param id      target user's primary key
     * @param newRole the desired role string
     * @throws ResourceNotFoundException if no user with {@code id} exists
     * @throws BadRequestException       if the role is invalid or the account is deactivated
     */
    @Transactional
    public UserProfileResponse updateUserRole(Long id, String newRole) {
        if (!ALLOWED_ROLES.contains(newRole)) {
            throw new BadRequestException(
                    "Invalid role '" + newRole + "'. Allowed values: " + ALLOWED_ROLES);
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (!user.isActive()) {
            throw new BadRequestException(
                    "Cannot update role for deactivated account (id=" + id + ").");
        }

        logger.info("Admin changing role of user {} from {} to {}", user.getEmail(), user.getRole(), newRole);
        user.setRole(newRole);
        return toProfileResponse(userRepository.save(user));
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Endpoint 4 — DELETE /api/users/profile/deactivate
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Soft-deletes the currently authenticated user's account.
     *
     * <p>Sets {@code isActive = false} and records {@code deactivatedAt}.
     * The row is retained in the database for audit purposes.
     *
     * @param email the authenticated user's email from the JWT
     * @throws ResourceNotFoundException if no matching user record exists
     * @throws BadRequestException       if the account is already deactivated
     */
    @Transactional
    public void deactivateCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Authenticated user not found in database: " + email));

        if (!user.isActive()) {
            throw new BadRequestException("Account for '" + email + "' is already deactivated.");
        }

        user.setActive(false);
        user.setDeactivatedAt(LocalDateTime.now());
        userRepository.save(user);
        logger.info("User {} self-deactivated their account.", email);
    }

    /**
     * Updates profile fields: name, phone, and avatar URL.
     */
    @Transactional
    public UserProfileResponse updateProfile(String email, UserProfileUpdateRequest request) {
        User user = getUserByEmail(email);

        logger.info("Updating profile for user {}: fullName={}, phone={}", email, request.fullName(), request.phoneNumber());

        user.setFullName(request.fullName());
        user.setPhoneNumber(request.phoneNumber());
        user.setStudentId(request.studentId());
        user.setProfilePictureUrl(request.profilePictureUrl());

        return toProfileResponse(userRepository.save(user));
    }

    /**
     * Updates user password after verifying the old one.
     * Prevents password updates for Google-only users who haven't set a local password yet.
     */
    @Transactional
    public void updatePassword(String email, PasswordUpdateRequest request) {
        User user = getUserByEmail(email);

        // Check if the old password matches
        if (user.getPassword() == null) {
            throw new BadRequestException("This account does not have a local password set (Google Auth).");
        }

        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new BadRequestException("Current password does not match.");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        logger.info("Restricted: Password changed for user {}", email);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Existing helpers (kept for backwards-compatibility with AdminUserController)
    // ──────────────────────────────────────────────────────────────────────────


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Transactional
    public UserPreferences saveUserPreferences(String email, UserPreferences preferences) {
        User user = getUserByEmail(email);
        preferences.setUser(user);
        return userPreferencesRepository.save(preferences);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    // ── Private mapper ────────────────────────────────────────────────────────

    private UserProfileResponse toProfileResponse(User u) {
        return new UserProfileResponse(
                u.getId(),
                u.getFullName(),
                u.getEmail(),
                u.getRole(),
                u.getPhoneNumber(),
                u.getStudentId(),
                u.getProfilePictureUrl(),
                u.isActive(),
                u.getProvider(),
                u.getCreatedAt()
        );
    }

}

