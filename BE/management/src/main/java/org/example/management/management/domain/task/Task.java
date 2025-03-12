package org.example.management.management.domain.task;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import org.example.management.management.application.converter.StringListConverter;

import java.time.Instant;
import java.util.List;

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

    @NotNull
    private Instant createdOn;

    private Instant modifiedOn;

    private Instant finishedOn;

    @Convert(converter = StringListConverter.class)
    private List<String> files;

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
