package com.smartcampus.hub.repository;

import com.smartcampus.hub.entity.Resource;
import com.smartcampus.hub.entity.ResourceStatus;
import com.smartcampus.hub.entity.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, UUID> {

    @Query("""
            SELECT r FROM Resource r
            WHERE (CAST(:type AS string) IS NULL OR r.type = :type)
              AND (CAST(:status AS string) IS NULL OR r.status = :status)
              AND (CAST(:minCapacity AS int) IS NULL OR r.capacity >= :minCapacity)
              AND (CAST(:location AS string) IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', CAST(:location AS string), '%')))
              AND (CAST(:search AS string) IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))
            ORDER BY r.name ASC
            """)
    List<Resource> searchResources(@Param("type") ResourceType type,
                                   @Param("status") ResourceStatus status,
                                   @Param("minCapacity") Integer minCapacity,
                                   @Param("location") String location,
                                   @Param("search") String search);
}