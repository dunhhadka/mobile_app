package org.example.management.management.infastructure.persistance;

import org.example.management.management.domain.chat.ChatMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMemberRepository extends JpaRepository<ChatMember, Integer> {

    List<ChatMember> getByUserId(int userId);

    List<ChatMember> getByUserIdInAndChatRoomId(List<Integer> userIds, int chatRoomId);

    List<ChatMember> getByChatRoomId(int chatRoomId);
}
