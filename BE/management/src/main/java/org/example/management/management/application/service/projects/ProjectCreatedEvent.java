package org.example.management.management.application.service.projects;

import org.example.management.management.domain.project.Project;

public record ProjectCreatedEvent(
        int projectId,
        UserInProjectInfo userInProjectInfo,
        Project project
) {
}
