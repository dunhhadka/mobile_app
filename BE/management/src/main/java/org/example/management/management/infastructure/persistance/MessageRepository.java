package org.example.management.management.infastructure.persistance;

import org.example.management.management.domain.chat.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {
    List<Message> findByChatRoomId(int roomId);
}
