package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.PasswordUpdateRequest;
import com.example.demo.dto.UserProfileResponse;
import com.example.demo.dto.UserProfileUpdateRequest;
import com.example.demo.entity.UserPreferences;
import com.example.demo.service.UserService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


/**
 * REST controller for the authenticated user's own profile operations.
 *
 * <p>All endpoints in this controller require a valid JWT and only operate
 * on the currently authenticated user — users cannot access each other's
 * data through these routes.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // ── Endpoint 1: GET /api/users/me ────────────────────────────────────────

    /**
     * Returns the current authenticated user's profile and role.
     *
     * <ul>
     *   <li>{@code 200 OK} — profile returned successfully</li>
     *   <li>{@code 401 Unauthorized} — no or invalid JWT</li>
     *   <li>{@code 404 Not Found} — JWT valid but user not in local DB</li>
     * </ul>
     */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser(@AuthenticationPrincipal String email) {
        UserProfileResponse profile = userService.getCurrentUserProfile(email);
        return ResponseEntity.ok(ApiResponse.ok("User profile retrieved successfully.", profile));
    }


    // ── Endpoint 2: PUT /api/users/profile ───────────────────────────────────

    /**
     * Updates the authenticated user's profile details.
     */
    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody UserProfileUpdateRequest request) {
        UserProfileResponse updated = userService.updateProfile(email, request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully.", updated));
    }


    // ── Endpoint 3: PUT /api/users/security/password ─────────────────────────

    /**
     * Updates the authenticated user's password.
     */
    @PutMapping("/security/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> updatePassword(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody PasswordUpdateRequest request) {
        userService.updatePassword(email, request);
        return ResponseEntity.ok(ApiResponse.ok("Password updated successfully."));
    }



    // ── Endpoint 4: DELETE /api/users/profile/deactivate ─────────────────────

    /**
     * Soft-deletes the currently authenticated user's account.
     *
     * <p>Sets {@code isActive = false} and records {@code deactivatedAt}.
     * The database row is retained for audit purposes.
     *
     * <ul>
     *   <li>{@code 200 OK} — account deactivated</li>
     *   <li>{@code 400 Bad Request} — account is already deactivated</li>
     *   <li>{@code 401 Unauthorized} — no or invalid JWT</li>
     *   <li>{@code 404 Not Found} — user record not found</li>
     * </ul>
     */
    @DeleteMapping("/profile/deactivate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deactivateAccount(@AuthenticationPrincipal String email) {
        userService.deactivateCurrentUser(email);
        return ResponseEntity.ok(ApiResponse.ok(
                "Your account has been deactivated. Contact an administrator to reactivate."));
    }


    // ── Preferences (unchanged) ───────────────────────────────────────────────

    @PostMapping("/preferences")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserPreferences> createPreferences(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody UserPreferences preferences) {
        return ResponseEntity.ok(userService.saveUserPreferences(email, preferences));
    }

}

