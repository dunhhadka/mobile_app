package org.example.management.management.application.model.chat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class MessageRequest {

    @Positive
    private int senderId;

    @Positive
    private int chatRoomId;

    @Positive
    private int chatMemberId;

    @NotBlank
    private String content;

    @NotNull
    private Instant time;
}
