package org.example.management.management.domain.project;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.management.ddd.DomainEvent;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectCreatedEvent implements DomainEvent {

    private Instant happenedAt;
    private int projectId;
    private int createdBy;
    private List<Integer> memberIds;

    @Override
    public Instant happenedAt() {
        return happenedAt;
    }

    @Override
    public String type() {
        return getClass().getSimpleName();
    }
}
