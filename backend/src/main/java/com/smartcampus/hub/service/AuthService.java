package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.*;
import com.smartcampus.hub.entity.PasswordResetToken;
import com.smartcampus.hub.entity.Role;
import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.repository.PasswordResetTokenRepository;
import com.smartcampus.hub.repository.UserRepository;
import com.smartcampus.hub.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Domain restriction check (SLIIT specific)
        if (!request.getEmail().toLowerCase().endsWith("@sliit.lk") && !request.getEmail().toLowerCase().endsWith("@my.sliit.lk")) {
            throw new RuntimeException("Only SLIIT institutional emails (@sliit.lk or @my.sliit.lk) are allowed");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.ROLE_USER)
                .isVerified(false)
                .isActive(true)
                .provider("manual")
                .build();

        generateAndSendOtp(user);
        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getIsVerified()) {
            throw new RuntimeException("Account not verified. Please check your email.");
        }

        String jwt = jwtUtils.generateToken(user);

        return AuthResponse.builder()
                .token(jwt)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .isVerified(user.getIsVerified())
                .profileImageUrl(user.getProfileImageUrl())
                .build();

    }

    @Transactional
    public AuthResponse verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getOtpCode() == null || !user.getOtpCode().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (user.getOtpExpiresAt().isBefore(Instant.now())) {
            throw new RuntimeException("OTP expired");
        }

        user.setIsVerified(true);
        user.setOtpCode(null);
        user.setOtpExpiresAt(null);
        userRepository.save(user);

        String jwt = jwtUtils.generateToken(user);
        return AuthResponse.builder()
                .token(jwt)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .isVerified(true)
                .profileImageUrl(user.getProfileImageUrl())
                .build();

    }

    @Transactional
    public void resendOtp(String email) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getIsVerified()) {
            throw new RuntimeException("Account already verified");
        }

        generateAndSendOtp(user);
        userRepository.save(user);
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        // Silently succeed if email not found — prevents email enumeration attacks.
        // The controller always returns the same generic message regardless.
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElse(null);

        if (user == null) {
            // Don't reveal that the email doesn't exist
            return;
        }

        // Fetch existing token or create a new one to avoid Hibernate duplicate key constraint on insert-after-delete
        PasswordResetToken resetToken = tokenRepository.findByUser(user)
                .orElse(new PasswordResetToken());

        String token = UUID.randomUUID().toString();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(Instant.now().plus(15, ChronoUnit.MINUTES));

        tokenRepository.save(resetToken);

        try {
            emailService.sendPasswordResetEmail(user.getEmail(), token);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send reset email. Please try again later.");
        }
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset link"));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new RuntimeException("Reset link has expired (15-minute limit)");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

    // Cleanup: remove token after successful reset
        tokenRepository.delete(resetToken);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public void deactivateUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(false);
        user.setDeactivatedAt(Instant.now());
        userRepository.save(user);
    }

    private void generateAndSendOtp(User user) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setOtpCode(otp);
        user.setOtpExpiresAt(Instant.now().plus(10, ChronoUnit.MINUTES));
        
        // Use try-catch for dev to not block if SMTP fails
        try {
            emailService.sendOtpEmail(user.getEmail(), otp);
        } catch (Exception e) {
            System.err.println("Failed to send OTP email: " + e.getMessage());
        }
    }
}
