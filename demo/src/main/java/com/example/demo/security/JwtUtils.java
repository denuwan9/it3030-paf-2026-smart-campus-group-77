package com.example.demo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Component;
import com.example.demo.repository.UserRepository;
import com.example.demo.entity.User;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.ECKey;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.util.DefaultResourceRetriever;
import com.nimbusds.jose.util.Resource;
import java.net.URI;
import java.security.PublicKey;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


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

    @Autowired
    private UserRepository userRepository;


    @Value("${app.jwt.expiration-ms}")
    private int jwtExpirationMs;

    private Key signingKey;
    private Key symmetricSupabaseKey;

    @Value("${app.jwt.supabase-jwks-url}")
    private String supabaseJwksUrl;

    @Value("${app.supabase.anon-key:}")
    private String supabaseAnonKey;

    // Cache for JWK Set
    private JWKSet jwkSet;
    private long lastJwkFetchTime = 0;
    private static final long JWK_REFRESH_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

    @PostConstruct
    public void init() {
        this.signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        // Supabase secrets are often Base64 encoded. Try to decode if possible.
        byte[] supabaseKeyBytes;
        try {
            supabaseKeyBytes = java.util.Base64.getDecoder().decode(supabaseSecret);
        } catch (Exception e) {
            supabaseKeyBytes = supabaseSecret.getBytes();
        }
        this.symmetricSupabaseKey = Keys.hmacShaKeyFor(supabaseKeyBytes);
    }

    /**
     * Fetches public keys from Supabase JWKS endpoint.
     */
    private synchronized void refreshJwkSet() {
        long now = System.currentTimeMillis();
        if (jwkSet == null || (now - lastJwkFetchTime) > JWK_REFRESH_INTERVAL) {
            try {
                logger.info("Fetching JWKS from: {}", supabaseJwksUrl);
                
                // Use custom retriever to add apikey header
                DefaultResourceRetriever retriever = new DefaultResourceRetriever(5000, 5000);
                Map<String, List<String>> headers = new HashMap<>();
                if (supabaseAnonKey != null && !supabaseAnonKey.isEmpty()) {
                    headers.put("apikey", List.of(supabaseAnonKey));
                    headers.put("Authorization", List.of("Bearer " + supabaseAnonKey));
                }
                retriever.setHeaders(headers);
                
                Resource resource = retriever.retrieveResource(URI.create(supabaseJwksUrl).toURL());
                this.jwkSet = JWKSet.parse(resource.getContent());
                
                this.lastJwkFetchTime = now;
                logger.info("Successfully loaded {} JWK(s)", jwkSet.getKeys().size());
            } catch (Exception e) {
                logger.error("Failed to load JWKS from Supabase: {} - {}", supabaseJwksUrl, e.getMessage());
            }
        }
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
     * then handles Supabase tokens (ES256 or fallback HS256).
     */
    public Claims getClaimsFromToken(String token) {
        try {
            // 1. Try internal key (HS256)
            return Jwts.parserBuilder()
                    .setSigningKey(signingKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            // 2. If internal fails, it might be a Supabase token
            return parseSupabaseToken(token);
        }
    }

    private Claims parseSupabaseToken(String token) {
        try {
            // Check headers to see if it's ES256 (asymmetric) or HS256 (symmetric)
            String[] parts = token.split("\\.");
            if (parts.length < 2) throw new MalformedJwtException("Invalid JWT structure");
            
            String headerJson = new String(java.util.Base64.getUrlDecoder().decode(parts[0]));
            logger.info("🔐 [JWT] Token Header: {}", headerJson);
            
            refreshJwkSet();
            if (jwkSet != null) {
                try {
                    // Use the already decoded headerJson
                    String kid = null;
                    if (headerJson.contains("\"kid\":\"")) {
                        kid = headerJson.split("\"kid\":\"")[1].split("\"")[0];
                    }

                    JWK jwk = (kid != null) ? jwkSet.getKeyByKeyId(kid) : jwkSet.getKeys().get(0);
                    if (jwk instanceof ECKey ecKey) {
                        PublicKey publicKey = ecKey.toPublicKey();
                        return Jwts.parserBuilder()
                                .setSigningKey(publicKey)
                                .build()
                                .parseClaimsJws(token)
                                .getBody();
                    }
                } catch (Exception jwkEx) {
                    // Fallback to symmetric if JWKS fails or matches no key
                }
            }

            // Fallback: Try symmetric Supabase secret (HS256)
            return Jwts.parserBuilder()
                    .setSigningKey(symmetricSupabaseKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

        } catch (Exception ex) {
            logger.error("JWT validation failed for both internal and Supabase keys: {}", ex.getMessage());
            throw ex;
        }
    }

    public String getEmailFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        // Supabase uses 'email' claim, standard OIDC uses 'sub' (if email is subject) or 'email'
        String email = claims.get("email", String.class);
        return (email != null) ? email : claims.getSubject();
    }

    public String getRoleFromToken(String token) {
        String role = getClaimsFromToken(token).get("role", String.class);
        // Map Supabase 'authenticated' role to our 'ROLE_USER'
        if ("authenticated".equalsIgnoreCase(role)) {
            return "ROLE_USER";
        }
        return role;
    }

    /**
     * Extracts the user's name from standard 'name' claim or Supabase 'user_metadata'.
     */
    public String getNameFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        
        // 1. Try standard 'name' claim (OIDC or our internal claim)
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

    public String getAvatarUrlFromToken(String token) {
        Claims claims = getClaimsFromToken(token);

        // 1. Try our internal claim
        String avatarUrl = claims.get("avatarUrl", String.class);
        if (avatarUrl != null) return avatarUrl;

        // 2. Try Supabase user_metadata
        Object metadata = claims.get("user_metadata");
        if (metadata instanceof java.util.Map) {
            Object url = ((java.util.Map<?, ?>) metadata).get("avatar_url");
            if (url instanceof String) return (String) url;
        }

        return null;
    }

    public String getProviderFromToken(String token) {
        Claims claims = getClaimsFromToken(token);

        // 1. Try our internal claim
        String provider = claims.get("provider", String.class);
        if (provider != null) return provider;

        // 2. Try Supabase app_metadata
        Object metadata = claims.get("app_metadata");
        if (metadata instanceof java.util.Map) {
            Object p = ((java.util.Map<?, ?>) metadata).get("provider");
            if (p instanceof String) return (String) p;
        }

        return "local";
    }

    // ─── Private helpers ──────────────────────────────────────────────────────

    private String buildToken(String email, String role) {
        Date now     = new Date();
        Date expires = new Date(now.getTime() + jwtExpirationMs);

        // Find the user in the local DB to get more info for the token
        User user = userRepository.findByEmail(email).orElse(null);
        Long userId = (user != null) ? user.getId() : null;
        String name = (user != null) ? user.getName() : null;
        String avatarUrl = (user != null) ? user.getProfilePictureUrl() : null;
        String provider = (user != null) ? user.getProvider() : "local";

        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .claim("userId", userId)
                .claim("name", name)
                .claim("avatarUrl", avatarUrl)
                .claim("provider", provider)
                .setIssuedAt(now)
                .setExpiration(expires)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

}

