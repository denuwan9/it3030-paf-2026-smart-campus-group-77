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
 */
@Service
@RequiredArgsConstructor
public class CustomOidcUserService extends OidcUserService {

    private final UserRepository userRepository;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);
        return processOidcUser(oidcUser);
    }

    private OidcUser processOidcUser(OidcUser oidcUser) {
        String email = oidcUser.getEmail();
        
        // Domain restriction check (SLIIT specific)
        if (email == null || (!email.toLowerCase().endsWith("@sliit.lk") && !email.toLowerCase().endsWith("@my.sliit.lk"))) {
            throw new OAuth2AuthenticationException(
                new OAuth2Error("invalid_domain"), 
                "Unauthorized: Only SLIIT institutional emails (@sliit.lk or @my.sliit.lk) are permitted."
            );
        }

        String name = oidcUser.getFullName();
        
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isEmpty()) {
            User user = User.builder()
                    .email(email)
                    .fullName(name != null ? name : email.split("@")[0])
                    .role(Role.ROLE_USER)
                    .isVerified(true) // Google accounts are implicitly verified
                    .isActive(true)
                    .provider("google")
                    .createdAt(Instant.now())
                    .build();
            userRepository.save(user);
        } else {
            // Update name if changed
            User user = userOptional.get();
            if (name != null && !name.equals(user.getFullName())) {
                user.setFullName(name);
                userRepository.save(user);
            }
        }
        
        return oidcUser;
    }
}
