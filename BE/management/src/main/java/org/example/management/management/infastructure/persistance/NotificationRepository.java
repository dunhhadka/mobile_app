package org.example.management.management.infastructure.persistance;

import org.example.management.management.domain.event.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByReceiveIdIn(List<Integer> userIds);

    int countByReceiveIdAndIsRead(int receiveId, boolean read);
}
