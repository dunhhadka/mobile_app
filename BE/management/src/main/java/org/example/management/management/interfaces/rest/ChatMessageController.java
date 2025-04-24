package org.example.management.management.interfaces.rest;

import lombok.RequiredArgsConstructor;
import org.example.management.management.application.model.chat.MessageRequest;
import org.example.management.management.application.model.chat.MessageResponse;
import org.example.management.management.application.service.chat.ChatService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ChatMessageController {

    private final ChatService chatService;

    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/group/{roomId}")
    public MessageResponse sendMessage(@DestinationVariable int roomId, MessageRequest request) {
        System.out.println("📨 [ChatMessageController] Nhận message tới roomId = " + roomId);
        System.out.println("📝 Nội dung message: " + request.getContent());

        return chatService.saveMessage(roomId, request);
    }

    @GetMapping("/api/messages/{userId}/un-read")
    public int countUnRead(@PathVariable int userId) {
        return this.chatService.countUnRead(userId);
    }
}
