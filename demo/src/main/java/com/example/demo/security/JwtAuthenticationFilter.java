package com.example.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import com.example.demo.service.UserSyncService;


import java.io.IOException;
import java.util.Collections;

/**
 * Stateless JWT authentication filter.
 *
 * <p>For every inbound request this filter:
 * <ol>
 *   <li>Extracts the {@code Bearer} token from the {@code Authorization} header.</li>
 *   <li>Validates the token signature and expiry using {@link JwtUtils}.</li>
 *   <li>Reads the {@code sub} (email) and {@code role} claims directly from the
 *       token — <strong>no database lookup required</strong>.</li>
 *   <li>Populates the Spring Security context so that downstream {@code @PreAuthorize}
 *       and {@code hasRole()} checks work correctly.</li>
 * </ol>
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserSyncService userSyncService;


    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = parseJwt(request);

            if (jwt != null && jwtUtils.validateToken(jwt)) {
                String email = jwtUtils.getEmailFromToken(jwt);
                String role  = jwtUtils.getRoleFromToken(jwt);
                String name  = jwtUtils.getNameFromToken(jwt);
                String avatarUrl = jwtUtils.getAvatarUrlFromToken(jwt);
                String provider = jwtUtils.getProviderFromToken(jwt);

                logger.info("🔐 [JWT] Successful validation for: {} | role: {} | provider: {}", email, role, provider);

                // Sync user to local database if they don't exist.
                // findOrCreate ensures the public.users record is always present.
                userSyncService.findOrCreate(email, name, avatarUrl, provider);

                // Fall back to default role if the claim is missing.
                if (role == null || role.isBlank()) {
                    role = "ROLE_USER";
                }

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                Collections.singletonList(new SimpleGrantedAuthority(role)));

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                logger.info("✅ [JWT] SecurityContext populated for user: {}", email);
            } else if (jwt != null) {
                logger.warn("❌ [JWT] Token validation failed for request to: {}", request.getRequestURI());
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        return null;
    }
}

