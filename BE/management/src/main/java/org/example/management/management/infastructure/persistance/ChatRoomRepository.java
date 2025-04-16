package org.example.management.management.infastructure.persistance;

import org.example.management.management.domain.chat.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> {

    ChatRoom findByProjectId(int projectId);

    List<ChatRoom> findByIdIn(List<Integer> ids);
}
