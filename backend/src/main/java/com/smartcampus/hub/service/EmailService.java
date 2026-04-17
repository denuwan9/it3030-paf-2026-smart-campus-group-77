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
        log.info("Attempting to send simple email from: {} to: {} with subject: {}", fromEmail, to, subject);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Simple email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send simple email to {}: {}", to, e.getMessage());
            throw e;
        }
    }

    public void sendHtmlEmail(String to, String subject, String htmlBody) throws MessagingException {
        log.info("Attempting to send HTML email from: {} to: {} with subject: {}", fromEmail, to, subject);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            
            mailSender.send(message);
            log.info("HTML email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send HTML email to {}: {}", to, e.getMessage());
            throw e;
        }
    }

    public void sendOtpEmail(String to, String otp) {
        String subject = "Smart Campus Hub - Verification Code";
        String body = "Your verification code is: " + otp + "\n\nThis code expires in 10 minutes.";
        sendEmail(to, subject, body);
    }

    public void sendPasswordResetEmail(String to, String token) throws MessagingException {
        String subject = "Smart Campus Hub — Password Recovery Request";
        String resetLink = frontendUrl + "/reset-password?token=" + token;
        
        String htmlBody = "<html><body style='font-family: \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px; color: #1e293b;'>" +
                "<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); overflow: hidden;'>" +
                "  <div style='background-color: #1a1a1a; padding: 30px; text-align: center;'>" +
                "    <h1 style='color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;'>SMART CAMPUS HUB</h1>" +
                "  </div>" +
                "  <div style='padding: 40px;'>" +
                "    <h2 style='margin-top: 0; font-size: 20px; font-weight: 800; color: #0f172a;'>Identity Recovery</h2>" +
                "    <p style='line-height: 1.6; color: #64748b;'>Hello,</p>" +
                "    <p style='line-height: 1.6; color: #64748b;'>We received a request to recover accessibility for your account. If you initiated this, please click the button below to establish a new password:</p>" +
                "    <div style='text-align: center; margin: 35px 0;'>" +
                "      <a href='" + resetLink + "' style='display: inline-block; background-color: #1a1a1a; color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; transition: background-color 0.2s;'>Securely Reset Password</a>" +
                "    </div>" +
                "    <p style='font-size: 14px; line-height: 1.5; color: #94a3b8;'>This link is strictly confidential and will automatically expire in <b style='color: #475569;'>15 minutes</b> for your security.</p>" +
                "    <p style='font-size: 14px; line-height: 1.5; color: #94a3b8;'>If you did not authorize this request, please disregard this transmission immediately. No further action is required.</p>" +
                "    <div style='margin-top: 40px; padding-top: 25px; border-top: 1px solid #f1f5f9; text-align: center;'>" +
                "      <p style='margin: 0; color: #1a1a1a; font-weight: 800; font-size: 13px;'>NEXER SECURITY PROTOCOL V1.0</p>" +
                "      <p style='margin: 5px 0 0; color: #94a3b8; font-size: 12px;'>Automated System Internal Notification — Do Not Reply</p>" +
                "    </div>" +
                "  </div>" +
                "</div>" +
                "</body></html>";
        
        sendHtmlEmail(to, subject, htmlBody);
    }
}
