package com.smartcampus.hub.security;

import com.smartcampus.hub.entity.Role;
import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

/**
 * Custom OIDC user service to provision or sync users from Google OAuth 1st login.
 * 
 * Task List:
 * - [x] Backend: Add explicit logging to `UserService.updateProfile`
 * - [x] Frontend: Update `AuthContext.jsx` to fetch profile from `/me` on load
 * - [x] Frontend: Refactor `updateUserProfile` to use backend data source
 * - [x] Frontend: Verify profile persistence after refresh
 * - [x] Update `SecurityConfig.java` with a custom `OAuth2AuthorizationRequestResolver`
 * - [x] Create `CustomOAuth2FailureHandler.java` for error-specific redirects
 * - [x] Update `CustomOidcUserService.java` with Login vs Signup logic and No-Update policy
 * - [x] Update `SecurityConfig.java` to link the new failure handler
 */
@Service
@RequiredArgsConstructor
public class CustomOidcUserService extends OidcUserService {

    private final UserRepository userRepository;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        System.out.println("Processing OIDC Login Attempt...");
        OidcUser oidcUser = super.loadUser(userRequest);
        return processOidcUser(oidcUser);
    }

    private OidcUser processOidcUser(OidcUser oidcUser) {
        String email = oidcUser.getEmail() != null ? oidcUser.getEmail().toLowerCase().trim() : null;
        System.out.println("Processing OIDC Login for email: [" + email + "]");

        // Capture 'action' from session
        String action = "login";
        var attributes = org.springframework.web.context.request.RequestContextHolder.getRequestAttributes();
        if (attributes instanceof org.springframework.web.context.request.ServletRequestAttributes) {
            jakarta.servlet.http.HttpSession session = ((org.springframework.web.context.request.ServletRequestAttributes) attributes).getRequest().getSession(false);
            if (session != null) {
                String sessionAction = (String) session.getAttribute("oauth2_action");
                if (sessionAction != null) action = sessionAction;
            }
        }
        System.out.println("OAuth2 Action Context: " + action);
        
        // 1. Domain restriction check (SLIIT specific)
        if (email == null || (!email.endsWith("@sliit.lk") && !email.endsWith("@my.sliit.lk"))) {
            throw new OAuth2AuthenticationException(
                new OAuth2Error("invalid_domain"), 
                "Unauthorized: Only SLIIT institutional emails (@sliit.lk or @my.sliit.lk) are permitted."
            );
        }

        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (action.equalsIgnoreCase("login")) {
            // LOGIN FLOW: User MUST exist
            if (userOptional.isEmpty()) {
                throw new OAuth2AuthenticationException(
                    new OAuth2Error("user_not_found"),
                    "No existing account found. Please create an account first."
                );
            }
            // NO-UPDATE POLICY: Return immediately without changing DB
            System.out.println("Login Successful (No-Update maintained) for: " + email);
            return oidcUser;
        } else {
            // SIGNUP FLOW: User MUST NOT exist
            if (userOptional.isPresent()) {
                throw new OAuth2AuthenticationException(
                    new OAuth2Error("user_already_exists"),
                    "Account already exists. Please login instead."
                );
            }

            // Provision new user
            System.out.println("Provisioning new SLIIT user: " + email);
            String name = oidcUser.getFullName();
            String picture = oidcUser.getPicture();

            User user = User.builder()
                    .email(email)
                    .fullName(name != null ? name : email.split("@")[0])
                    .role(Role.ROLE_USER)
                    .isVerified(true)
                    .isActive(true)
                    .provider("google")
                    .profileImageUrl(picture)
                    .createdAt(Instant.now())
                    .build();
            userRepository.save(user);
        }
        
        return oidcUser;
    }
}
