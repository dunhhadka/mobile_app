package org.example.management.management.application.model.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequest {
    @Positive
    private int taskId;

    @Positive
    private int userId;

    @NotBlank
    private String content;
}
