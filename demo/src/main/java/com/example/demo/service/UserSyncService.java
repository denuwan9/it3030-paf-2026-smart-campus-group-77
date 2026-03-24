package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@Service
public class UserSyncService {
    private static final Logger logger = LoggerFactory.getLogger(UserSyncService.class);

    @Autowired
    private UserRepository userRepository;

    @Transactional
    @SuppressWarnings("unchecked")
    public User syncUserFromClaims(Map<String, Object> claims) {
        String email = (String) claims.get("email");
        String name = (String) ((Map<String, Object>) claims.get("user_metadata")).get("full_name");
        
        if (name == null) {
            name = (String) ((Map<String, Object>) claims.get("user_metadata")).get("name");
        }
        
        if (name == null) {
            name = email.split("@")[0];
        }

        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            // Update name if it changed
            if (!user.getName().equals(name)) {
                user.setName(name);
                return userRepository.save(user);
            }
            return user;
        } else {
            logger.info("Creating new user from Supabase login: {}", email);
            User newUser = User.builder()
                    .email(email)
                    .name(name)
                    .role("ROLE_USER") // Default role
                    .build();
            return userRepository.save(newUser);
        }
    }
}
