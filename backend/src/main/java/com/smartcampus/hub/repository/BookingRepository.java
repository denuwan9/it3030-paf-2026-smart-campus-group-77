package com.smartcampus.hub.repository;

import com.smartcampus.hub.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    
    @Query("SELECT b.userId FROM Booking b WHERE b.assetId = :assetId AND (b.status = 'ACTIVE' OR b.status = 'PENDING')")
    List<UUID> findImpactedUserIds(@Param("assetId") UUID assetId);
}
