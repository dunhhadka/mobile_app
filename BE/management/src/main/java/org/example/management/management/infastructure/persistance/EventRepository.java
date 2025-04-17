package org.example.management.management.infastructure.persistance;

import org.example.management.management.domain.event.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Integer> {
}
