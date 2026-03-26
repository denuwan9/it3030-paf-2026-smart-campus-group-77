package com.example.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        logger.info("📧 [Email] Attempting to send OTP to: {}", to);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@smartcampus.lk");
            message.setTo(to);
            message.setSubject("Smart Campus Hub - Email Verification");
            message.setText("Your verification code is: " + otp + "\n\nThis code will expire in 10 minutes.");
            
            mailSender.send(message);
            logger.info("✅ [Email] OTP sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("❌ [Email] Failed to send email to: {}. Error: {}", to, e.getMessage());
            throw new RuntimeException("Could not send verification email. Please check your SMTP settings. " + e.getMessage());
        }
    }
}
