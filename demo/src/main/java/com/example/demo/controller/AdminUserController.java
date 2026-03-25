package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.UpdateRoleRequest;
import com.example.demo.dto.UserProfileResponse;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin-only REST controller for user and role management.
 *
 * <p>All endpoints require the caller to hold the {@code ROLE_ADMIN} authority,
 * enforced by both the {@link com.example.demo.config.SecurityConfig} URL pattern
 * ({@code /api/admin/**}) and the method-level {@code @PreAuthorize} annotations.
 * Dual enforcement protects against future route refactoring accidentally opening
 * these endpoints up.
 */
@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")   // guard the entire controller
public class AdminUserController {

    @Autowired
    private UserService userService;

    // ── Existing: GET /api/admin/users ─────────────────────────────────────────

    /**
     * Lists all users in the system.
     *
     * <ul>
     *   <li>{@code 200 OK} — list returned (may be empty)</li>
     *   <li>{@code 403 Forbidden} — caller is not an ADMIN</li>
     * </ul>
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok("All users retrieved.", userService.getAllUsers()));
    }

    // ── Endpoint 2: POST /api/admin/users/sync ────────────────────────────────

    /**
     * Manual trigger to sync and return the full user list from the local database.
     *
     * <p>Useful for reconciling records after a bulk import or external IdP change.
     *
     * <ul>
     *   <li>{@code 200 OK} — sync completed, user list returned</li>
     *   <li>{@code 403 Forbidden} — caller is not an ADMIN</li>
     * </ul>
     */
    @PostMapping("/sync")
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> syncUsers() {
        List<UserProfileResponse> synced = userService.syncAllUsers();
        return ResponseEntity.ok(
                ApiResponse.ok("Sync completed. " + synced.size() + " user(s) found.", synced));
    }

    // ── Endpoint 3: PUT /api/admin/users/{id}/role ────────────────────────────

    /**
     * Promotes or changes the role of a specific user.
     *
     * <p>Accepted roles: {@code ROLE_USER}, {@code ROLE_TECHNICIAN}, {@code ROLE_ADMIN}.
     *
     * <ul>
     *   <li>{@code 200 OK} — role updated, updated profile returned</li>
     *   <li>{@code 400 Bad Request} — invalid role or account is deactivated</li>
     *   <li>{@code 403 Forbidden} — caller is not an ADMIN</li>
     *   <li>{@code 404 Not Found} — no user with the given id</li>
     * </ul>
     *
     * @param id   path variable — the target user's database ID
     * @param body validated request body containing the new role string
     */
    @PutMapping("/{id}/role")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRoleRequest body) {

        UserProfileResponse updated = userService.updateUserRole(id, body.role());
        return ResponseEntity.ok(
                ApiResponse.ok("Role updated to " + body.role() + " for user id=" + id + ".", updated));
    }

    // ── Existing: DELETE /api/admin/users/{id} ────────────────────────────────

    /**
     * Hard-deletes a user record (admin action).
     * For self-service soft-delete, use {@code DELETE /api/users/profile/deactivate}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.ok("User id=" + id + " permanently deleted."));
    }
}

