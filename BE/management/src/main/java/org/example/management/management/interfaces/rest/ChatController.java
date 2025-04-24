package org.example.management.management.interfaces.rest;

import lombok.RequiredArgsConstructor;
import org.checkerframework.checker.units.qual.A;
import org.example.management.management.application.model.chat.ChatMemberResponse;
import org.example.management.management.application.model.chat.ChatRoomResponse;
import org.example.management.management.application.model.chat.MessageResponse;
import org.example.management.management.application.service.chat.ChatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chats")
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/members/{userId}")
    public List<ChatMemberResponse> getChatMemberByUserId(@PathVariable int userId) {
        return this.chatService.getChatMemberByUserId(userId);
    }

    @GetMapping("/rooms/{id}")
    public ChatRoomResponse getRoomById(@PathVariable int id) {
        return this.chatService.getRoomById(id);
    }

    @GetMapping("/rooms/{roomId}/messages")
    public List<MessageResponse> getMessageByRoomId(@PathVariable int roomId) {
        return this.chatService.getMessageByRoomId(roomId);
    }

    @GetMapping("/markup-read/{memberId}")
    public void markupReadRoomMessage(@PathVariable int memberId) {
        this.chatService.markupRead(memberId);
    }
}
