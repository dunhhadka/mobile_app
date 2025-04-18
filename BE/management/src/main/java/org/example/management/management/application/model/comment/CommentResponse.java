package org.example.management.management.application.model.comment;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.example.management.management.application.model.user.response.UserResponse;

import java.time.Instant;

@Getter
@Setter
@Builder
public class CommentResponse {
    private int id;

    private String content;

    private UserResponse user;

    private Instant createdAt;
}
