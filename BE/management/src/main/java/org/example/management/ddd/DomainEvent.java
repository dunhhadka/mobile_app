package org.example.management.ddd;

import java.time.Instant;

public interface DomainEvent {
    Instant happenedAt();

    String eventName();
}
