package com.smartcampus.hub.dto;

import lombok.Data;

/**
 * Request/response DTO for reading and updating a user's
 * notification preferences.
 */
@Data
public class NotificationSettingDTO {

    private Boolean emailEnabled;
    private Boolean bookingAlerts;
    private Boolean ticketAlerts;
    private Boolean systemAlerts;
    private Boolean announcementAlerts;
}
