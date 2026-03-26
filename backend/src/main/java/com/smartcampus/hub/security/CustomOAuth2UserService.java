package com.smartcampus.hub.security;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        String email = oauth2User.getAttribute("email");
        
        System.out.println("Processing Standard OAuth2 Login for: " + email);
        
        if (email == null || (!email.toLowerCase().endsWith("@sliit.lk") && !email.toLowerCase().endsWith("@my.sliit.lk"))) {
            throw new OAuth2AuthenticationException(
                new OAuth2Error("invalid_domain"), 
                "Unauthorized: Only SLIIT institutional emails (@sliit.lk or @my.sliit.lk) are permitted."
            );
        }
        
        return oauth2User;
    }
}
