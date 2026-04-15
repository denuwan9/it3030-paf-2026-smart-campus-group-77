package com.smartcampus.hub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request/response DTO for reading and updating a user's
 * notification preferences.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationSettingDTO {

    @Builder.Default
    private Boolean emailEnabled = true;
    @Builder.Default
    private Boolean bookingAlerts = true;
    @Builder.Default
    private Boolean ticketAlerts = true;
    @Builder.Default
    private Boolean systemAlerts = true;
    @Builder.Default
    private Boolean announcementAlerts = true;
}
