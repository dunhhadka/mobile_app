package org.example.management.management.application.model.chat;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.example.management.management.application.model.user.response.UserResponse;

import java.time.Instant;

@Getter
@Setter
@Builder
public class ChatMemberResponse {
    private int id;

    private UserResponse user;

    private ChatRoomResponse chatRoom;

    private Instant joinedAt;

    private boolean unRead;

    private int unReadCount;

    private LastMessage lastMessage;

    @Builder
    @Getter
    public static class LastMessage {
        private UserResponse userLastSend;
        private Instant sendTime;
        private String content;
    }
}
