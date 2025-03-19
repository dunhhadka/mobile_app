package org.example.management.management.domain.task;

import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import org.example.management.management.application.converter.StringListConverter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

@Getter
@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Size(max = 255)
    private String title;

    @Size(max = 255)
    private String description;

    @Positive
    private int projectId;

    //NOTE: Hiện tại mới support 1 task (1 assignee, 1 user)
    @Positive
    private Integer assignId; // userId

    @Positive
    private Integer processId;

    @Enumerated(value = EnumType.STRING)
    private Priority priority;

    @Enumerated(value = EnumType.STRING)
    private Difficulty difficulty;

    @Enumerated(value = EnumType.STRING)
    private Status status;

    @CreationTimestamp
    private Instant createdOn;

    @UpdateTimestamp
    private Instant modifiedOn;

    private Instant finishedOn;

    @Convert(converter = StringListConverter.class)
    private List<String> files;

    protected Task() {
    }

    public Task(
            String title,
            String description,
            int projectId,
            Integer assignId,
            Integer processId,
            Priority priority,
            Difficulty difficulty,
            Status status
    ) {
        this.title = title;
        this.description = description;

        this.projectId = projectId;

        this.assignId = assignId;
        this.processId = processId;

        this.priority = priority;
        this.difficulty = difficulty;
        this.status = status;
    }

    public void updateUser(Integer assignId, Integer processId) {
        if (!Objects.equals(assignId, this.assignId)) {
            this.internalSetAssignedUser(assignId);
        }
        if (!Objects.equals(processId, this.processId)) {
            this.internalSetProcessId(processId);
        }
    }

    private void internalSetProcessId(Integer processId) {
        this.processId = processId;
        //TODO: Bổ sung thêm event để làm thông báo
    }

    private void internalSetAssignedUser(Integer assignId) {
        this.assignId = assignId;
        //TODO: Bổ sung thêm event để làm thông báo
    }

    public void update(Priority priority, Difficulty difficulty, Status status) {
        this.internalSetPriority(priority);
        this.internalSetDifficulty(difficulty);
        this.internalSetStatus(status);
        //TODO: Bổ sung thêm event để làm thông báo
    }

    private void internalSetStatus(Status status) {
        if (Objects.equals(this.status, status)) {
            return;
        }
        this.status = status;
    }

    private void internalSetDifficulty(Difficulty difficulty) {
        if (Objects.equals(this.difficulty, difficulty)) {
            return;
        }

        this.difficulty = difficulty;
    }

    private void internalSetPriority(Priority priority) {
        if (Objects.equals(priority, this.priority)) {
            return;
        }

        this.priority = priority;
    }

    public void markupFinished(Instant finishedOn) {
        this.status = Status.finish;
        this.finishedOn = finishedOn;

        //TODO: event
    }

    public enum Status {
        to_do,
        in_process,
        finish
    }

    public enum Difficulty {
        very_easy,
        easy // TODO: Thêm
    }

    public enum Priority {
        low,
        medium,
        high
    }
}
