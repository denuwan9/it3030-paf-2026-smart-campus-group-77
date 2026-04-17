package com.smartcampus.hub.service;

import com.smartcampus.hub.entity.Asset;
import com.smartcampus.hub.repository.AssetRepository;
import com.smartcampus.hub.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;
    private final BookingRepository bookingRepository;
    private final SystemAlertService systemAlertService;

    @Transactional
    public void updateAssetStatus(UUID assetId, String newStatus) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        log.info("Updating asset {} status from {} to {}", asset.getName(), asset.getStatus(), newStatus);
        
        asset.setStatus(newStatus);
        assetRepository.save(asset);

        // Maintenance Trigger: If OUT_OF_SERVICE, notify all impacted users
        if ("OUT_OF_SERVICE".equalsIgnoreCase(newStatus)) {
            List<UUID> impactedUserIds = bookingRepository.findImpactedUserIds(assetId);
            if (!impactedUserIds.isEmpty()) {
                systemAlertService.sendMaintenanceBroadcast(asset.getName(), impactedUserIds);
            }
        }
    }
}
