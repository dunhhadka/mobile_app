package org.example.management.management.application.model.task;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.example.management.management.domain.task.Task;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class TaskCreateRequest {

    @Size(max = 255)
    @NotBlank(message = "Title không được để trống")
    private String title;

    @Size(max = 255)
    private String description;

    @Positive
    private int projectId;

    //NOTE: Hiện tại mới support 1 task (1 assignee, 1 user)
    private Integer assignId; // userId

    private Integer processId;

    @NotNull(message = "Độ ưu tiên không dược để trống.")
    private Task.Priority priority;

    @NotNull(message = "Độ khó không được để trống.")
    private Task.Difficulty difficulty;

    private Task.Status status;

    private BigDecimal processValue;

    private List<@Valid TaskImageRequest> images;

    private List<Task.Tag> tags;

    @NotNull(message = "Ngày bắt đầu dự kiến không được để trống")
    private LocalDate startDate;

    @NotNull(message = "Ngày kết thúc dự kiến không được để trống")
    private LocalDate dueDate;

    private LocalDate completedAt;

    private LocalDate actualStartDate;

    private BigDecimal estimatedTime;

    private BigDecimal actualTime;

    private List<String> attachments;
}
