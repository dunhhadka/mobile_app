
package org.example.management.management.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.example.management.management.application.model.notification.NotificationResponse;
import org.example.management.management.application.model.user.response.UserResponse;
import org.example.management.management.application.service.user.UserService;
import org.example.management.management.domain.event.Notification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {


    private final UserService userService;

    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotificationToUser(int userId, NotificationResponse response) {
        String destination = "/topic/notification/" + userId;
        messagingTemplate.convertAndSend(destination, response);
    }

    public void sendNotifications(List<Notification> notifications) {
        if (CollectionUtils.isEmpty(notifications)) {
            if (log.isDebugEnabled()) {
                log.debug("List Notifications is Empty");
            }
            return;
        }

        var userIds = notifications.stream()
                .map(Notification::getReceiveId)
                .toList();

        var userMap = userService.getByIds(userIds)
                .stream().collect(Collectors.toMap(UserResponse::getId, Function.identity()));

        notifications.stream()
                .map(n -> toResponse(n, userMap.get(n.getReceiveId())))
                .forEach(n -> this.sendNotificationToUser(n.getReceive().getId(), n));
    }

    private NotificationResponse toResponse(Notification notification, UserResponse userResponse) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .receive(userResponse)
                .receiveMessage(notification.getReceiveMessage())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
