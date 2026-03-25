package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service responsible for ensuring a Google-authenticated user exists in the
 * local Supabase {@code users} table.
 *
 * <p>This service is called by {@link CustomOidcUserService} immediately after
 * a successful Google Sign-in.  It is NOT called on every API request — the
 * {@link com.example.demo.security.JwtAuthenticationFilter} reads the role
 * directly from the JWT, keeping the hot-path stateless and database-free.
 */
@Service
public class UserSyncService {
    private static final Logger logger = LoggerFactory.getLogger(UserSyncService.class);

    @Autowired
    private UserRepository userRepository;

    /**
     * Looks up the user by {@code email}. If not found, creates a new record
     * with a default {@code ROLE_USER} role.
     *
     * @param email the Google account e-mail address (unique identifier)
     * @param name  the display name from the OIDC {@code name} claim
     * @return the persisted {@link User} entity (never {@code null})
     */
    @Transactional
    public User findOrCreate(String email, String name) {
        Optional<User> existing = userRepository.findByEmail(email);

        if (existing.isPresent()) {
            User user = existing.get();
            // Keep the display name in sync with Google profile.
            if (!user.getName().equals(name)) {
                user.setName(name);
                return userRepository.save(user);
            }
            return user;
        }

        logger.info("First-time login — creating user record for: {}", email);
        User newUser = User.builder()
                .email(email)
                .name(name)
                .role("ROLE_USER")
                .build();
        return userRepository.save(newUser);
    }
}

