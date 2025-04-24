package org.example.management.management.application.service.chat;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.example.management.management.application.model.chat.ChatMemberResponse;
import org.example.management.management.application.model.chat.ChatRoomResponse;
import org.example.management.management.application.model.chat.MessageRequest;
import org.example.management.management.application.model.chat.MessageResponse;
import org.example.management.management.application.model.user.response.UserResponse;
import org.example.management.management.application.service.projects.ProjectCreatedEvent;
import org.example.management.management.application.service.projects.ProjectService;
import org.example.management.management.application.service.user.UserService;
import org.example.management.management.domain.chat.ChatMember;
import org.example.management.management.domain.chat.ChatRoom;
import org.example.management.management.domain.chat.LastMessage;
import org.example.management.management.domain.chat.Message;
import org.example.management.management.domain.project.Project;
import org.example.management.management.infastructure.exception.ConstrainViolationException;
import org.example.management.management.infastructure.persistance.ChatMemberRepository;
import org.example.management.management.infastructure.persistance.ChatRoomRepository;
import org.example.management.management.infastructure.persistance.MessageRepository;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMemberRepository chatMemberRepository;
    private final MessageRepository messageRepository;

    private final UserService userService;

    @Async
    @Transactional
    @EventListener(ProjectCreatedEvent.class)
    public void handleProjectCreated(ProjectCreatedEvent event) {

        log.info("Handle Room Create From Project Id {}", event.projectId());

        int projectId = event.projectId();

        var room = chatRoomRepository.findByProjectId(projectId);

        if (room != null) {
            log.error("Room of project existed");
            return;
        }

        var newRoom = ChatRoom.builder()
                .projectId(projectId)
                .name(generateRoomName(event.project()))
                .createdBy(event.project().getCreatedId())
                .build();
        var roomSaved = this.chatRoomRepository.save(newRoom);

        var allUserIds = Stream.concat(
                        Stream.of(event.project().getCreatedId()),
                        event.userInProjectInfo().addIds().stream())
                .distinct()
                .toList();

        var chatMembers = allUserIds.stream()
                .map(id -> createNewChatMember(id, roomSaved))
                .toList();
        this.chatMemberRepository.saveAll(chatMembers);
    }

    @Async
    @EventListener(ProjectService.UpdateProjectEvent.class)
    public void handleProjectUpdated(ProjectService.UpdateProjectEvent event) {
        var projectId = event.projectId();
        var addedUserIds = event.addedUserIds();
        if (CollectionUtils.isEmpty(addedUserIds)) {
            log.info("No users added for project {}", projectId);
            return;
        }

        var chatRoom = this.chatRoomRepository.findByProjectId(projectId);
        if (chatRoom == null) {
            log.info("Room chưa tồn tại");
            return;
        }

        var chatMembers = this.chatMemberRepository.getByUserIdInAndChatRoomId(addedUserIds, chatRoom.getId())
                .stream()
                .collect(Collectors.toMap(
                        ChatMember::getUserId,
                        Function.identity(),
                        (first, second) -> second
                ));

        var usersShouldAddToRoom = addedUserIds.stream()
                .filter(userId -> chatMembers.get(userId) == null)
                .toList();
        if (CollectionUtils.isEmpty(usersShouldAddToRoom)) {
            return;
        }

        var chatMembersCreate = usersShouldAddToRoom.stream()
                .map(id -> createNewChatMember(id, chatRoom))
                .toList();
        this.chatMemberRepository.saveAll(chatMembersCreate);
    }

    private ChatMember createNewChatMember(Integer userId, ChatRoom room) {
        return ChatMember.builder()
                .userId(userId)
                .joinedAt(Instant.now())
                .chatRoomId(room.getId())
                .build();
    }

    private String generateRoomName(Project project) {
        var title = project.getTitle();
        return "Dự án - " + title;
    }

    public List<ChatMemberResponse> getChatMemberByUserId(int userId) {
        var chatMembers = this.chatMemberRepository.getByUserId(userId);

        if (CollectionUtils.isEmpty(chatMembers)) {
            return Collections.emptyList();
        }

        var allUsers = this.getAllUsers(chatMembers);

        var roomIds = chatMembers.stream()
                .map(ChatMember::getChatRoomId)
                .distinct()
                .toList();
        var roomMap = this.chatRoomRepository.findByIdIn(roomIds)
                .stream().collect(Collectors.toMap(ChatRoom::getId, Function.identity()));

        return chatMembers.stream()
                .map(member -> this.toMemberResponse(member, allUsers, roomMap.get(member.getChatRoomId())))
                .toList();
    }

    private Map<Integer, UserResponse> getAllUsers(List<ChatMember> chatMembers) {
        if (CollectionUtils.isEmpty(chatMembers)) {
            return Map.of();
        }

        var memberUserIds = chatMembers.stream()
                .map(ChatMember::getUserId)
                .distinct()
                .toList();
        var lastSenderUserIds = chatMembers.stream()
                .filter(member -> member.getLastMessage() != null)
                .map(member -> member.getLastMessage().getSenderId())
                .distinct()
                .toList();
        var allUserIds = Stream.concat(memberUserIds.stream(), lastSenderUserIds.stream()).distinct().toList();

        return this.userService.getByIds(allUserIds).stream()
                .collect(Collectors.toMap(
                        UserResponse::getId,
                        Function.identity()));
    }

    private ChatMemberResponse toMemberResponse(ChatMember member, Map<Integer, UserResponse> allUsers, ChatRoom chatRoom) {
        var user = allUsers.get(member.getUserId());
        if (user == null) return null;

        var lastSendUser = member.getLastMessage() != null ? allUsers.get(member.getLastMessage().getSenderId()) : null;

        return ChatMemberResponse.builder()
                .id(member.getId())
                .user(user)
                .chatRoom(toChatRoomResponse(chatRoom))
                .joinedAt(member.getJoinedAt())
                .lastMessage(buildLastMessage(lastSendUser, member.getLastMessage()))
                .unReadCount(member.getUnReadCount())
                .build();
    }

    private ChatMemberResponse.LastMessage buildLastMessage(UserResponse lastSendUser, LastMessage lastMessage) {
        if (lastSendUser == null || lastMessage == null) {
            log.info("No last message for member");
            return null;
        }

        return ChatMemberResponse.LastMessage.builder()
                .userLastSend(lastSendUser)
                .sendTime(lastMessage.getSendTime())
                .content(lastMessage.getContent())
                .build();
    }

    private ChatRoomResponse toChatRoomResponse(ChatRoom chatRoom) {
        return ChatRoomResponse.builder()
                .id(chatRoom.getId())
                .name(chatRoom.getName())
                .build();
    }

    public ChatRoomResponse getRoomById(int id) {
        var room = this.chatRoomRepository.findById(id)
                .orElseThrow(() ->
                        new ConstrainViolationException(
                                "room",
                                "Không tìm thấy phòng chat"
                        ));
        return this.toChatRoomResponse(room);
    }

    @Transactional
    // TODO: Đang không check gì cả. Làm nhanh
    public MessageResponse saveMessage(int roomId, MessageRequest request) {
        var room = this.chatRoomRepository.findById(roomId)
                .orElseThrow(() ->
                        new ConstrainViolationException(
                                "room",
                                "Không tìm thấy phòng chat"
                        ));

        var message = Message.builder()
                .chatRoomId(roomId)
                .senderId(request.getSenderId())
                .chatMemberId(request.getChatMemberId())
                .content(request.getContent())
                .time(request.getTime())
                .build();

        var member = ChatMember.builder().build();

        var sender = this.userService.getUserById(request.getSenderId());

        var messageSaved = this.messageRepository.save(message);

        this.updateChatMember(messageSaved);

        return this.toMessageResponse(messageSaved, room, member, sender);
    }

    private void updateChatMember(Message messageSaved) {
        var chatRoomId = messageSaved.getChatRoomId();
        var chatMembers = this.chatMemberRepository.getByChatRoomId(chatRoomId);

        if (CollectionUtils.isEmpty(chatMembers)) {
            log.info("No member in roomId {}", chatRoomId);
            return;
        }

        chatMembers.stream()
                .filter(member -> member.getUserId() != messageSaved.getSenderId())
                .forEach(member -> member.updateUnReadMessage(messageSaved));

        this.chatMemberRepository.saveAll(chatMembers);
    }

    private MessageResponse toMessageResponse(Message message, ChatRoom room, ChatMember member, UserResponse sender) {
        return MessageResponse.builder()
                .id(message.getId())
                .sender(sender)
                .content(message.getContent())
                .time(message.getTime())
                .senderId(message.getSenderId())
                .chatRoom(toChatRoomResponse(room))
                .chatMember(toMemberResponse(member))
                .build();
    }

    private ChatMemberResponse toMemberResponse(ChatMember member) {
        return ChatMemberResponse.builder()
                .id(member.getId())
                .build();
    }

    public List<MessageResponse> getMessageByRoomId(int roomId) {
        var messages = this.messageRepository.findByChatRoomId(roomId);
        if (CollectionUtils.isEmpty(messages)) {
            return List.of();
        }

        var userIds = messages.stream()
                .map(Message::getSenderId)
                .distinct()
                .toList();
        var users = this.userService.getByIds(userIds)
                .stream()
                .collect(Collectors.toMap(UserResponse::getId, Function.identity()));

        return messages.stream()
                .map(message -> toMessageResponse(message, users.get(message.getSenderId())))
                .toList();
    }

    private MessageResponse toMessageResponse(Message message, UserResponse sender) {
        return MessageResponse.builder()
                .id(message.getId())
                .sender(sender)
                .content(message.getContent())
                .time(message.getTime())
                .senderId(message.getSenderId())
                .build();
    }

    public int countUnRead(int userId) {
        var chatMembers = this.chatMemberRepository.getByUserId(userId);
        if (CollectionUtils.isEmpty(chatMembers)) {
            return 0;
        }

        return (int) chatMembers.stream()
                .filter(ChatMember::isUnRead)
                .count();
    }

    public void markupRead(int memberId) {
        var chatMember = this.chatMemberRepository.findById(memberId)
                .orElse(null);
        if (chatMember == null) {
            return;
        }

        chatMember.clearLastMessage();

        chatMemberRepository.save(chatMember);
    }
}
