package org.example.management.management.application.service.projects;

import org.apache.commons.collections4.CollectionUtils;
import org.example.management.management.application.model.project.ProjectResponse;
import org.example.management.management.application.model.task.TaskResponse;
import org.example.management.management.application.model.user.response.UserResponse;
import org.example.management.management.domain.project.Project;
import org.example.management.management.infastructure.data.dto.ProjectDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public abstract class ProjectMapper {

    public ProjectResponse toResponse(Project project, List<UserResponse> users, List<TaskResponse> tasks) {
        var projectResponse = this.toResponse(project);

        if (CollectionUtils.isNotEmpty(users)) {
            projectResponse.setUsers(users);
        }

        if (CollectionUtils.isNotEmpty(tasks)) {
            projectResponse.setTasks(tasks);
        }

        return projectResponse;
    }

    @Mapping(target = "users", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    public abstract ProjectResponse toResponse(Project project);
}
