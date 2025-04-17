package org.example.management.management.infastructure.persistance;

import org.example.management.management.domain.event.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
}
