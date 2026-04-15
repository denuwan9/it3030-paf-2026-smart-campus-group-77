package com.smartcampus.hub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request/response DTO for reading and updating a user's
 * notification preferences.
 *
 * NOTE: No @Builder.Default here — defaults are handled in NotificationService
 * via getOrCreateSettings(). Keeping plain nullable Booleans so Jackson
 * deserialization is straightforward.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationSettingDTO {

    private Boolean emailEnabled;
    private Boolean bookingAlerts;
    private Boolean ticketAlerts;
    private Boolean systemAlerts;
    private Boolean announcementAlerts;
}
