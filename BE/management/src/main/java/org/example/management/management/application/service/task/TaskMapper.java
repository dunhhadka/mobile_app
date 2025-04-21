package org.example.management.management.application.service.task;

import org.apache.commons.collections4.CollectionUtils;
import org.example.management.management.application.model.images.ImageResponse;
import org.example.management.management.application.model.task.TaskResponse;
import org.example.management.management.application.model.user.response.UserResponse;
import org.example.management.management.domain.task.Image;
import org.example.management.management.domain.task.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public abstract class TaskMapper {

    @Mapping(target = "startDate", source = "timeInfo.startDate")
    @Mapping(target = "actualStartDate", source = "timeInfo.actualStartDate")
    @Mapping(target = "dueDate", source = "timeInfo.dueDate")
    @Mapping(target = "completedAt", source = "timeInfo.completedAt")
    @Mapping(target = "estimatedTime", source = "timeInfo.estimatedTime")
    @Mapping(target = "actualTime", source = "timeInfo.actualTime")
    public abstract TaskResponse toResponse(Task task);

    public abstract ImageResponse toResponse(Image image);

    public TaskResponse toResponse(Task task, List<Image> images) {
        var taskResponse = this.toResponse(task);
        if (CollectionUtils.isNotEmpty(images)) {
            List<ImageResponse> imageResponses = images.stream()
                    .map(this::toResponse)
                    .toList();
            taskResponse.setImages(imageResponses);
        }
        return taskResponse;
    }

    public TaskResponse toResponse(Task task, List<Image> images, UserResponse assign, UserResponse process) {
        var taskResponse = this.toResponse(task, images);
        taskResponse.setAssign(assign);
        taskResponse.setProcess(process);
        return taskResponse;
    }
}
