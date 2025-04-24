package org.example.management.management.domain.task.events;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.management.ddd.DomainEvent;

import java.time.Instant;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TaskFinishEvent implements DomainEvent, TaskEvent {

    private int creatorId;
    private int finisherId;
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
        return this.creatorId;
    }

    @Override
    public int taskId() {
        return this.taskId;
    }

    @Override
    public int processorId() {
        return this.finisherId;
    }
}
