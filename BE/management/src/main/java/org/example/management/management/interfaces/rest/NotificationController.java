package org.example.management.management.interfaces.rest;

import lombok.RequiredArgsConstructor;
import org.example.management.management.application.model.notification.NotificationResponse;
import org.example.management.management.application.service.NotificationService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/{userId}")
    public List<NotificationResponse> getNotificationByUserId(@PathVariable int userId) {
        return this.notificationService.getByUserId(userId);
    }

    @PutMapping("/{id}/mark-as-read")
    public void markIsRead(@PathVariable int id) {
        this.notificationService.markIsRead(id);
    }

    @GetMapping("/{userId}/un-read")
    public int countUnRead(@PathVariable int userId) {
        return this.notificationService.countUnRead(userId);
    }
}
