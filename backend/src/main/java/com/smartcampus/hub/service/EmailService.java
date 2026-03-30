package com.smartcampus.hub.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public void sendEmail(String to, String subject, String body) {
        log.info("Sending simple email to: {} with subject: {}", to, subject);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
        log.info("Simple email sent successfully to: {}", to);
    }

    public void sendHtmlEmail(String to, String subject, String htmlBody) throws MessagingException {
        log.info("Preparing HTML email for: {} with subject: {}", to, subject);
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);
        
        mailSender.send(message);
        log.info("HTML email sent successfully to: {}", to);
    }

    public void sendOtpEmail(String to, String otp) {
        String subject = "Smart Campus Hub - Verification Code";
        String body = "Your verification code is: " + otp + "\n\nThis code expires in 10 minutes.";
        sendEmail(to, subject, body);
    }

    public void sendPasswordResetEmail(String to, String token) throws MessagingException {
        String subject = "Lumina Hub — Password Reset Request";
        String resetLink = frontendUrl + "/reset-password?token=" + token;
        
        String htmlBody = "<html><body style='font-family: sans-serif;'>" +
                "<h2>Password Reset Request</h2>" +
                "<p>Hello,</p>" +
                "<p>We received a request to reset your password for your Lumina Hub account. Click the button below to set a new password:</p>" +
                "<div style='margin: 30px 0;'>" +
                "<a href='" + resetLink + "' style='background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;'>Reset Password</a>" +
                "</div>" +
                "<p>If you didn't request this, you can safely ignore this email. This link will expire in <b>15 minutes</b>.</p>" +
                "<hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;'>" +
                "<p style='color: #666; font-size: 12px;'>Smart Campus Hub Security Team</p>" +
                "</body></html>";
        
        sendHtmlEmail(to, subject, htmlBody);
    }
}
