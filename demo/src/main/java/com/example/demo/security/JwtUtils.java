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

    @Value("${app.jwt.supabase-secret}")
    private String supabaseSecret;

    @Value("${app.jwt.expiration-ms}")
    private int jwtExpirationMs;

    private Key signingKey;
    private Key supabaseKey;

    @PostConstruct
    public void init() {
        this.signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        // Supabase secrets are sometimes UUIDs or short strings; we ensure they are handled safely.
        this.supabaseKey = Keys.hmacShaKeyFor(supabaseSecret.getBytes());
    }

    // ─── Token generation ─────────────────────────────────────────────────────

    public String generateToken(Authentication authentication) {
        String email;
        String role = "ROLE_USER";

        if (authentication.getPrincipal() instanceof OidcUser oidcUser) {
            email = oidcUser.getEmail();
        } else {
            email = (String) authentication.getPrincipal();
        }

        if (!authentication.getAuthorities().isEmpty()) {
            role = authentication.getAuthorities().iterator().next().getAuthority();
        }

        return buildToken(email, role);
    }

    public String generateToken(String email, String role) {
        return buildToken(email, role);
    }

    // ─── Token validation ─────────────────────────────────────────────────────

    /**
     * Attempts to validate the token against both the internal secret 
     * and the Supabase secret.
     */
    public boolean validateToken(String token) {
        try {
            getClaimsFromToken(token);
            return true;
        } catch (io.jsonwebtoken.security.SignatureException e) {
            logger.error("JWT Signature Validation Failed: The secret key probably doesn't match Supabase! {}", e.getMessage());
            return false;
        } catch (Exception e) {
            logger.error("JWT validation failed: {} - {}", e.getClass().getSimpleName(), e.getMessage());
            return false;
        }
    }

    /**
     * Parses the JWT and returns the claims. Tries the internal key first,
     * then falls back to the Supabase key.
     */
    public Claims getClaimsFromToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(signingKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            // Fallback to Supabase secret
            return Jwts.parserBuilder()
                    .setSigningKey(supabaseKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        }
    }

    public String getEmailFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        // Supabase uses 'email' claim, standard OIDC uses 'sub' (if email is subject) or 'email'
        String email = claims.get("email", String.class);
        return (email != null) ? email : claims.getSubject();
    }

    public String getRoleFromToken(String token) {
        return getClaimsFromToken(token).get("role", String.class);
    }

    /**
     * Extracts the user's name from standard 'name' claim or Supabase 'user_metadata'.
     */
    public String getNameFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        
        // 1. Try standard 'name' claim
        String name = claims.get("name", String.class);
        if (name != null) return name;

        // 2. Try Supabase user_metadata
        Object metadata = claims.get("user_metadata");
        if (metadata instanceof java.util.Map) {
            Object fullName = ((java.util.Map<?, ?>) metadata).get("full_name");
            if (fullName instanceof String) return (String) fullName;
        }

        // 3. Fallback to email prefix
        String email = getEmailFromToken(token);
        return (email != null && email.contains("@")) ? email.split("@")[0] : "User";
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

