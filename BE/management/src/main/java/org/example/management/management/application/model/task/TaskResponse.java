package org.example.management.management.application.model.task;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.example.management.management.application.model.images.ImageResponse;
import org.example.management.management.application.model.user.response.UserResponse;
import org.example.management.management.domain.task.Task;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class TaskResponse {
    private int id;

    private String title;
    private String description;

    private int projectId;

    private Integer assignId;
    private UserResponse assign;

    private Integer processId;
    private UserResponse process;

    private Task.Priority priority;
    private Task.Difficulty difficulty;
    private Task.Status status;

    private Instant createdOn;

    private Instant modifiedOn;

    private Instant finishedOn;

    private List<ImageResponse> images;

    private BigDecimal processValue;

    private LocalTime startDate;

    private LocalTime dueDate;

    private LocalTime completedAt;

    private BigDecimal estimatedTime;

    private BigDecimal actualTime;

    private List<Task.Tag> tags;
}
