package com.smartcampus.hub.repository;

import com.smartcampus.hub.entity.NotificationSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificationSettingRepository extends JpaRepository<NotificationSetting, UUID> {

    Optional<NotificationSetting> findByUserId(UUID userId);
}
