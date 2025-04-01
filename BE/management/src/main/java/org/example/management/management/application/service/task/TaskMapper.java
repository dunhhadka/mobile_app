package org.example.management.management.application.service.task;

import org.apache.commons.collections4.CollectionUtils;
import org.example.management.management.application.model.images.ImageResponse;
import org.example.management.management.application.model.task.TaskResponse;
import org.example.management.management.domain.task.Image;
import org.example.management.management.domain.task.Task;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public abstract class TaskMapper {

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
}
