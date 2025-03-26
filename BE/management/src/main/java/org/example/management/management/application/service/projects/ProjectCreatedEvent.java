package org.example.management.management.application.service.projects;

public record ProjectCreatedEvent(int projectId, UserInProjectInfo userInProjectInfo) {
}
