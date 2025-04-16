package org.example.management.management.application.model.chat;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.example.management.management.application.model.project.ProjectResponse;
import org.example.management.management.application.model.user.response.UserResponse;

import java.time.Instant;

@Getter
@Setter
@Builder
public class ChatRoomResponse {
    private int id;

    private String name;

    private ProjectResponse project;

    private UserResponse createdBy;

    private LastMessage lastMessage;

    @Getter
    @Setter
    public static class LastMessage {
        private UserResponse sender;

        private String content;

        private Instant sendTime;
    }
}
