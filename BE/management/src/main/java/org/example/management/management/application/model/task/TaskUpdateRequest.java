package org.example.management.management.application.model.task;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class TaskUpdateRequest extends TaskCreateRequest {
    private Integer id;

    private Instant finishedOn;
}
