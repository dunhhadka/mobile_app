package org.example.management.management.application.model.task;

import lombok.Getter;
import lombok.Setter;
import org.example.management.management.domain.task.Task;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class TaskFilterRequest {
    private List<Integer> ids;

    private String title;

    private String description;

    private int projectId;

    private int assignId;

    private int processId;

    private Task.Priority priority;

    private Task.Difficulty difficulty;

    private Task.Status status;

    private Instant createdOn;

    private Instant modifiedOn;

    private Instant finishedOn;

    private LocalDate startDate;

    private LocalDate actualStartDate;

    private LocalDate dueDate;

    private LocalDate completedAt;
}
