package org.example.management.management.application.service.task;

public record TaskCreatedEvent(
        int projectId,
        int userId,
        int taskId
) {
}
