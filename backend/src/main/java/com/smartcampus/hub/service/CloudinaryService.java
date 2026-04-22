package com.smartcampus.hub.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @jakarta.annotation.PostConstruct
    public void validateConfig() {
        if (cloudinary.config.cloudName == null || cloudinary.config.cloudName.isEmpty()) {
            log.error("Cloudinary cloud name is not configured! Check application.properties.");
        }
    }

    public String uploadImage(MultipartFile file, String folder) throws IOException {
        try {
            log.info("Uploading file to Cloudinary folder: {}", folder);
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("folder", folder));
            
            Object secureUrl = uploadResult.get("secure_url");
            if (secureUrl == null) {
                secureUrl = uploadResult.get("url");
            }
            
            log.info("Cloudinary upload successful. URL: {}", secureUrl);
            return secureUrl != null ? secureUrl.toString() : null;
        } catch (Exception e) {
            log.error("Cloudinary upload failed for folder {}: {}", folder, e.getMessage());
            
            // Fallback for development/testing if keys are not set
            if (e.getMessage().contains("Unknown API key") || e.getMessage().contains("Must supply api_key")) {
                log.warn("USING FALLBACK IMAGE: Cloudinary keys are missing or invalid. Returning placeholder URL.");
                // Return a nice high-quality architectural placeholder for facilities
                return "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop";
            }
            
            throw new IOException("Failed to upload image to Cloudinary: " + e.getMessage(), e);
        }
    }

    public void deleteImage(String publicId) throws IOException {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            log.error("Cloudinary delete failed: {}", e.getMessage());
            throw new IOException("Failed to delete image from Cloudinary", e);
        }
    }
}
