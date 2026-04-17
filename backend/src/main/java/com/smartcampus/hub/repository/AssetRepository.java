package com.smartcampus.hub.repository;

import com.smartcampus.hub.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface AssetRepository extends JpaRepository<Asset, UUID> {
}
