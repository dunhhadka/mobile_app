package org.example.management.management.application.model.task;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.example.management.management.domain.task.Task;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class TaskCreateRequest {

    @Size(max = 255)
    private String title;

    @Size(max = 255)
    private String description;

    @Positive
    private int projectId;

    //NOTE: Hiện tại mới support 1 task (1 assignee, 1 user)
    private Integer assignId; // userId

    private Integer processId;

    private Task.Priority priority;

    private Task.Difficulty difficulty;

    private Task.Status status;

    private BigDecimal processValue;

    private List<@Valid TaskImageRequest> images;
}
