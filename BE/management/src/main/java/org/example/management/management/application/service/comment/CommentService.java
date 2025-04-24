package org.example.management.management.application.service.comment;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.apache.commons.collections4.CollectionUtils;
import org.example.management.management.application.model.comment.CommentRequest;
import org.example.management.management.application.model.comment.CommentResponse;
import org.example.management.management.application.model.user.response.UserResponse;
import org.example.management.management.application.service.user.UserService;
import org.example.management.management.domain.comment.Comment;
import org.example.management.management.infastructure.exception.ConstrainViolationException;
import org.example.management.management.infastructure.persistance.CommentRepository;
import org.example.management.management.infastructure.persistance.TaskRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserService userService;

    private final ApplicationEventPublisher applicationEventPublisher;

    @Transactional
    public CommentResponse createComment(int taskId, CommentRequest request) {
        var task = this.taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new ConstrainViolationException(
                                "task",
                                "Không tìm thấy task với id là " + taskId
                        ));

        var user = this.userService.findById(request.getUserId());

        var comment = Comment.builder()
                .content(request.getContent())
                .userId(user.getId())
                .createdAt(Instant.now())
                .build();

        task.addComment(comment);

        commentRepository.save(comment);

        this.applicationEventPublisher.publishEvent(new CommentCreatedEvent(user.getId(), taskId));

        this.taskRepository.save(task);

        return this.getCommentId(comment.getId());
    }

    @AllArgsConstructor
    @Getter
    public static class CommentCreatedEvent {
        private int senderId;
        private int taskId;
    }

    private CommentResponse getCommentId(int id) {
        var comment = this.commentRepository.findById(id)
                .orElseThrow(() ->
                        new ConstrainViolationException(
                                "comment",
                                "Comment not found"
                        ));

        var user = this.userService.findById(comment.getUserId());

        return this.toResponse(comment, user);
    }

    private CommentResponse toResponse(Comment comment, UserResponse user) {
        return CommentResponse.builder()
                .id(comment.getId())
                .user(user)
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }

    public List<CommentResponse> getByTaskId(int taskId) {
        var comments = this.commentRepository.findByTaskId(taskId);

        if (CollectionUtils.isEmpty(comments)) {
            return List.of();
        }

        var userIds = comments.stream()
                .map(Comment::getUserId)
                .distinct()
                .toList();
        var userMap = this.userService.getByIds(userIds)
                .stream().collect(Collectors.toMap(UserResponse::getId, Function.identity()));

        return comments.stream()
                .map(comment -> this.toResponse(comment, userMap.get(comment.getUserId())))
                .toList();
    }

    public void deleteId(int commentId, int taskId) {
        var task = this.taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new ConstrainViolationException(
                                "task",
                                "Task not found"
                        ));

        task.deleteComment(commentId);
    }
}
