package org.example.management.management.application.model.task;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.example.management.management.application.model.project.ProjectResponse;
import org.example.management.management.application.model.user.response.UserResponse;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class ProjectManagementResponse {
    private int id;

    private ProjectResponse project;

    private UserResponse user;

    private int totalToDo;
    private int totalInProgress;
    private int totalFinish;

    private int totalTask;

    private BigDecimal progress;
}
