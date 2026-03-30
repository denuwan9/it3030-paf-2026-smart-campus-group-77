package com.smartcampus.hub.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

/**
 * Custom Failure Handler for OAuth2.
 * Redirects the user back to either /login or /signup on the frontend with
 * specific error codes based on the authentication failure reason.
 */
@Component
public class CustomOAuth2FailureHandler implements AuthenticationFailureHandler {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        // Read the action context from the session (populated by the AuthorizationRequestResolver)
        String action = (String) request.getSession().getAttribute("oauth2_action");
        if (action == null) action = "login"; // Default fallback

        String errorMessage = exception.getMessage();
        String errorCode = "auth_failed";

        // Map exception messages to specific error codes
        if (errorMessage != null) {
            if (errorMessage.contains("institutional emails")) {
                errorCode = "invalid_domain";
            } else if (errorMessage.contains("account found")) {
                errorCode = "user_not_found";
            } else if (errorMessage.contains("already exists")) {
                errorCode = "user_already_exists";
            }
        }

        // Determine the base redirect URL based on the action intent
        String basePage = action.equalsIgnoreCase("signup") ? "/register" : "/login";
        
        String targetUrl = UriComponentsBuilder.fromUriString(frontendUrl + basePage)
                .queryParam("error", errorCode)
                .build().toUriString();

        response.sendRedirect(targetUrl);
    }
}
