package com.example.demo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;

/**
 * JWT utility class for issuing and validating tokens in the Smart Campus API.
 *
 * <p>All tokens are signed with the application-level secret ({@code app.jwt.secret})
 * using HMAC-SHA256.  The optional {@code app.jwt.supabase-secret} property is kept
 * for future use (e.g. verifying tokens issued by Supabase Auth directly) but is
 * NOT used in the primary authentication flow.
 */
@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private int jwtExpirationMs;

    private Key signingKey;

    @PostConstruct
    public void init() {
        // The hex-encoded secret must be at least 256 bits (32 bytes) for HS256.
        this.signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // ─── Token generation ─────────────────────────────────────────────────────

    /**
     * Generates a JWT from a successful Spring Security {@link Authentication}.
     * Supports both {@link OidcUser} principals (OAuth2 flow) and plain
     * {@link String} principals (re-authenticated from a previous JWT).
     */
    public String generateToken(Authentication authentication) {
        String email;
        String role = "ROLE_USER";

        if (authentication.getPrincipal() instanceof OidcUser oidcUser) {
            email = oidcUser.getEmail();
        } else {
            // Principal is the email string set by JwtAuthenticationFilter.
            email = (String) authentication.getPrincipal();
        }

        if (!authentication.getAuthorities().isEmpty()) {
            role = authentication.getAuthorities().iterator().next().getAuthority();
        }

        return buildToken(email, role);
    }

    /**
     * Generates a JWT directly from an email + role string.
     * Useful for programmatic token issuance (e.g. tests, admin endpoints).
     */
    public String generateToken(String email, String role) {
        return buildToken(email, role);
    }

    // ─── Token validation ─────────────────────────────────────────────────────

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(signingKey).build().parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }

    public Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String getEmailFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    public String getRoleFromToken(String token) {
        return getClaimsFromToken(token).get("role", String.class);
    }

    // ─── Private helpers ──────────────────────────────────────────────────────

    private String buildToken(String email, String role) {
        Date now     = new Date();
        Date expires = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(now)
                .setExpiration(expires)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }
}

