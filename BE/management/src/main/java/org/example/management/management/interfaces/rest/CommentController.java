package org.example.management.management.interfaces.rest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.management.management.application.model.comment.CommentRequest;
import org.example.management.management.application.model.comment.CommentResponse;
import org.example.management.management.application.service.comment.CommentService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    @MessageMapping("/submitComment/{taskId}")
    @SendTo("/topic/comment-task/{taskId}")
    public CommentResponse createComment(@DestinationVariable int taskId, CommentRequest request) {
        log.info("📨 [Comment] Nhận comment tới taskId = {}", taskId);
        log.info("📝 Nội dung comment: {}", request.getContent());

        return this.commentService.createComment(taskId, request);
    }

    @GetMapping("/{taskId}/comments")
    public List<CommentResponse> findByTaskId(@PathVariable int taskId) {
        return this.commentService.getByTaskId(taskId);
    }

//    @DeleteMapping("/{taskId}/{commentId}")
//    public void deleteComment(@PathVariable int commentId, @PathVariable int taskId) {
//        this.commentService.deleteId(commentId, taskId);
//    }
}
