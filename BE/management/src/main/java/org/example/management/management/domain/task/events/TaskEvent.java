package org.example.management.management.domain.task.events;

public interface TaskEvent {
    int creatorId();

    int taskId();

    int processorId();
}
