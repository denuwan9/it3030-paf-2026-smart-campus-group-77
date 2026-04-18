package com.smartcampus.hub.repository;

import com.smartcampus.hub.entity.Resource;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, UUID> {
    List<Resource> findByFacilityId(UUID facilityId);

    Optional<Resource> findFirstByFacilityIdAndName(UUID facilityId, String name);

    @Query("SELECT r FROM Resource r JOIN FETCH r.facility")
    List<Resource> findAllWithFacility();
}
