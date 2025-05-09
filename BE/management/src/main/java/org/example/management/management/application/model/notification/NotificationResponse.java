package org.example.management.management.application.model.notification;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.example.management.management.application.model.user.response.UserResponse;
import org.example.management.management.domain.event.Notification;

import java.time.Instant;

@Getter
@Setter
@Builder
public class NotificationResponse {

    private int id;

    private String receiveMessage;

    private int eventId;

    private UserResponse receive;

    private boolean isRead;

    private Notification.Type type;

    private Instant createdAt;

    private String data;
}
