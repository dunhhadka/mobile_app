package org.example.management.management.application.model.chat;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.example.management.management.application.model.user.response.UserResponse;

import java.time.Instant;

@Getter
@Setter
@Builder
public class MessageResponse {
    private int id;

    private int senderId;

    private ChatRoomResponse chatRoom;

    private ChatMemberResponse chatMember;

    private String content;

    private Instant time;

    private UserResponse sender;
}
