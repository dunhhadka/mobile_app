package org.example.management.management.application.model.project;

import lombok.Getter;
import lombok.Setter;
import org.example.management.management.application.model.task.TaskResponse;
import org.example.management.management.application.model.user.response.UserResponse;
import org.example.management.management.domain.project.Project;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class ProjectResponse {
    private int id;

    private Integer companyId;

    private String title;
    private String description;

    private Instant createdOn;
    private Instant startedOn;
    private Instant modifiedOn;

    private Project.Status status;

    private List<UserResponse> users;

    private List<TaskResponse> tasks;
}
