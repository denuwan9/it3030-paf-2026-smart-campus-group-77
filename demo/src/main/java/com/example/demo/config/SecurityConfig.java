package com.example.demo.config;

import com.example.demo.security.JwtAuthenticationFilter;
import com.example.demo.security.JwtUtils;
import com.example.demo.service.CustomOidcUserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Central security configuration for the Smart Campus API.
 *
 * <p>Authentication strategy:
 * <ol>
 *   <li>Google OAuth 2.0 / OIDC — handled by Spring Security's built-in flow.
 *       After a successful Google login {@link CustomOidcUserService} provisions
 *       the user in Supabase, then {@link OAuthSuccessHandler} issues a signed JWT
 *       and redirects the browser to the React frontend.</li>
 *   <li>Stateless JWT — every subsequent API request must carry the JWT in the
 *       {@code Authorization: Bearer <token>} header.  The
 *       {@link JwtAuthenticationFilter} validates the token and populates the
 *       Spring Security context so that {@code @PreAuthorize} and role checks work.</li>
 * </ol>
 *
 * <p>Roles:
 * <ul>
 *   <li>{@code ROLE_USER}  — granted by default on first Google Sign-in.</li>
 *   <li>{@code ROLE_ADMIN} — must be set manually in the database.</li>
 * </ul>
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity   // enables @PreAuthorize / @Secured on controller methods
public class SecurityConfig {

    // ─── Dependencies ────────────────────────────────────────────────────────

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private CustomOidcUserService customOidcUserService;

    @Autowired
    private JwtUtils jwtUtils;

    // ─── Security Filter Chain ────────────────────────────────────────────────

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Allow cross-origin requests from the React frontend (configured in WebConfig).
            .cors(Customizer.withDefaults())

            // Disable CSRF — not needed for stateless JWT APIs.
            .csrf(csrf -> csrf.disable())

            // Stateless: no HTTP session is created or used.
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // ── Authorization rules ──────────────────────────────────────────
            .authorizeHttpRequests(auth -> auth
                // Public endpoints: standard auth routes + the OAuth2 initiation/callback paths.
                .requestMatchers(
                    "/login",
                    "/login/**",
                    "/oauth2/**",
                    "/api/auth/**"
                ).permitAll()

                // Role-gated endpoints.
                .requestMatchers("/api/admin/**").hasRole("ADMIN")  // ROLE_ADMIN
                .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN")  // ROLE_USER or ROLE_ADMIN

                // Everything else requires authentication.
                .anyRequest().authenticated()
            )

            // ── Google OAuth 2.0 / OIDC ──────────────────────────────────────
            .oauth2Login(oauth2 -> oauth2
                // Register our custom OIDC service that saves the user to Supabase.
                .userInfoEndpoint(userInfo ->
                    userInfo.oidcUserService(customOidcUserService))

                // After successful Google login: issue a JWT and redirect to the frontend.
                .successHandler((request, response, authentication) -> {
                    String jwt = jwtUtils.generateToken(authentication);

                    // Redirect to the React app with the token as a query parameter.
                    // The frontend should immediately exchange/store it (e.g. in memory/localStorage).
                    response.sendRedirect("http://localhost:3000/oauth2/callback?token=" + jwt);
                })

                // On OAuth2 failure redirect back to login with an error flag.
                .failureHandler((request, response, exception) -> {
                    response.sendRedirect("http://localhost:3000/login?error=oauth_failed");
                })
            )

            // ── JWT filter ────────────────────────────────────────────────────
            // Run before Spring's username/password filter so that JWT-authenticated
            // requests are resolved without a session.
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setContentType("application/json");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write(
                        "{\"error\":\"Unauthorized\",\"message\":\"" + authException.getMessage() + "\"}"
                    );
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setContentType("application/json");
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.getWriter().write(
                        "{\"error\":\"Forbidden\",\"message\":\"You do not have permission to access this resource.\"}"
                    );
                })
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ─── Beans ────────────────────────────────────────────────────────────────

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}

