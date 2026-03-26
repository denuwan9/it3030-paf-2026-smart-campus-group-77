package com.example.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

/**
 * Custom OIDC User Service for Google Sign-in.
 *
 * <p>This service is invoked by Spring Security after a successful Google OAuth2
 * token exchange.  It delegates to {@link UserSyncService} to ensure the user
 * exists in the Supabase {@code users} table before the JWT success handler runs.
 *
 * <p>On the user's <strong>first login</strong> a new row is created with
 * {@code ROLE_USER}.  On subsequent logins, the display name is updated if it
 * has changed in their Google profile.
 */
@Service
public class CustomOidcUserService extends OidcUserService {

    private static final Logger logger = LoggerFactory.getLogger(CustomOidcUserService.class);

    @Autowired
    private UserSyncService userSyncService;

    /**
     * Called by Spring Security after the OIDC token exchange with Google.
     * The returned {@link OidcUser} is the principal used by the JWT redirect
     * success handler in {@link com.example.demo.config.SecurityConfig}.
     */
    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        // 1. Delegate to Spring's default implementation to exchange the OIDC token.
        OidcUser oidcUser = super.loadUser(userRequest);

        try {
            // 2. Persist / update the user in Supabase (first-time login creates the row).
            String email = oidcUser.getEmail();
            String name  = oidcUser.getFullName();
            String avatarUrl = oidcUser.getPicture();
            String provider = "google";

            if (name == null || name.isBlank()) {
                name = email.split("@")[0];
            }

            userSyncService.findOrCreate(email, name, avatarUrl, provider);

        } catch (Exception ex) {
            // Log but do not block login — the JWT redirect handler will still run.
            logger.error("Failed to provision user in local database: {}", ex.getMessage(), ex);
        }

        return oidcUser;
    }
}
