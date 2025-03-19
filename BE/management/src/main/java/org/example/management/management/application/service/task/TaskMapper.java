package org.example.management.management.application.service.task;

import org.example.management.management.application.model.task.TaskResponse;
import org.example.management.management.domain.task.Task;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class TaskMapper {

    public abstract TaskResponse toResponse(Task task);
}
