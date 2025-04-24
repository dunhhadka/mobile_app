package org.example.management.management.domain.chat;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "chat_members")
public class ChatMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Positive
    private int userId;

    private int chatRoomId;

    @NotNull
    private Instant joinedAt;

    private boolean unRead;

    private int unReadCount;

    @Embedded
    @Valid
    @JsonUnwrapped
    private LastMessage lastMessage;

    public void updateUnReadMessage(Message unReadMessage) {
        this.unReadCount++;

        this.unRead = true;

        this.lastMessage = LastMessage.builder()
                .senderId(unReadMessage.getSenderId())
                .content(unReadMessage.getContent())
                .sendTime(unReadMessage.getTime())
                .build();
    }

    public void clearLastMessage() {
        this.unReadCount = 0;
        this.unRead = false;
        this.lastMessage = null;
    }
}
