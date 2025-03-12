package org.example.management.ddd;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Transient;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@MappedSuperclass
public abstract class AggregateRoot<R extends AggregateRoot<R>> extends DomainEntity<R> {

    @Transient
    private List<DomainEvent> events;

    @JsonIgnore
    public List<DomainEvent> getEvents() {
        if (this.events == null) {
            return Collections.emptyList();
        }
        return Collections.unmodifiableList(this.events);
    }

    protected void addDomainEvent(DomainEvent event) {
        if (this.events == null) this.events = new ArrayList<>();
        this.events.add(event);
    }
}
