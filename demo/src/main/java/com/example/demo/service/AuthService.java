package com.example.demo.service;

import com.example.demo.dto.UserRegistrationDto;
import com.example.demo.entity.User;
import com.example.demo.exception.UserAlreadyExistsException;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User registerUser(UserRegistrationDto registrationDto) {
        String email = registrationDto.getEmail().toLowerCase();
        if (!email.endsWith("@sliit.lk") && !email.endsWith("@my.sliit.lk")) {
            throw new IllegalArgumentException("Only SLIIT campus members can join this hub!");
        }

        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("A user with this email already exists.");
        }

        User user = User.builder()
                .fullName(registrationDto.getFullName())
                .email(email)
                .password(passwordEncoder.encode(registrationDto.getPassword()))
                .role("ROLE_USER")
                .isVerified(false)
                .build();

        return userRepository.save(user);
    }
}
