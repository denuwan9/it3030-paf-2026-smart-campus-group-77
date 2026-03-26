package com.example.demo.service;

import com.example.demo.dto.UserRegistrationDto;
import com.example.demo.entity.User;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.UserAlreadyExistsException;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Transactional
    public User registerUser(UserRegistrationDto registrationDto) {
        String email = registrationDto.getEmail().toLowerCase();
        if (!email.endsWith("@sliit.lk") && !email.endsWith("@my.sliit.lk")) {
            throw new IllegalArgumentException("Only SLIIT campus members can join this hub!");
        }

        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("A user with this email already exists.");
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(1000000));
        java.time.LocalDateTime expiry = java.time.LocalDateTime.now().plusMinutes(10);

        User user = User.builder()
                .fullName(registrationDto.getFullName())
                .email(email)
                .password(passwordEncoder.encode(registrationDto.getPassword()))
                .role("ROLE_USER")
                .provider("email")
                .isVerified(false)
                .otpCode(otp)
                .otpExpiry(expiry)
                .supabaseId(registrationDto.getSupabaseId())
                .build();

        User savedUser = userRepository.save(user);
        
        // Use the new logging-enabled service
        emailService.sendOtpEmail(email, otp);

        return savedUser;
    }

    @Transactional
    public void verifyOtp(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        if (user.isVerified()) {
            return; // Already verified
        }

        if (user.getOtpCode() == null || !user.getOtpCode().equals(code)) {
            throw new IllegalArgumentException("Invalid verification code.");
        }

        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new IllegalArgumentException("Verification code has expired. Please request a new one.");
        }

        user.setVerified(true);
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
    }
}
