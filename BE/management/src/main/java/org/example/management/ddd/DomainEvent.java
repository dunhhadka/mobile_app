package org.example.management.ddd;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.example.management.management.domain.project.ProjectCreatedEvent;

import java.time.Instant;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "ProjectCreatedEvent"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = ProjectCreatedEvent.class, name = "ProjectCreatedEvent")
})
public interface DomainEvent {
    Instant happenedAt();

    String type();
}
