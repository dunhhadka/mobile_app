package org.example.management.management.domain.task.events;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.example.management.ddd.DomainEvent;

import java.time.Instant;

@NoArgsConstructor
@AllArgsConstructor
public class TaskReOpenEvent implements DomainEvent, TaskEvent {
    private int currentProcessorId;
    private int openerId;
    private int taskId;

    @Override
    public Instant happenedAt() {
        return Instant.now();
    }

    @Override
    public String type() {
        return getClass().getName();
    }

    @Override
    public int creatorId() {
        return this.openerId;
    }

    @Override
    public int taskId() {
        return this.taskId;
    }

    @Override
    public int processorId() {
        return this.currentProcessorId;
    }
}
