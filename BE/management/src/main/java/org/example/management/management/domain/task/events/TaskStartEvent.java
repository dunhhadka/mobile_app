package org.example.management.management.domain.task.events;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.management.ddd.DomainEvent;

import java.time.Instant;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TaskStartEvent implements DomainEvent {
    private int creatorId;
    private int starterId;
    private int taskId;

    @Override
    public Instant happenedAt() {
        return Instant.now();
    }

    @Override
    public String type() {
        return getClass().getName();
    }
}
