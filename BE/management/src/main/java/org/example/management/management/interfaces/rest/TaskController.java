package org.example.management.management.interfaces.rest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.management.management.application.model.task.TaskCreateRequest;
import org.example.management.management.application.model.task.TaskResponse;
import org.example.management.management.application.model.task.TaskUpdateRequest;
import org.example.management.management.application.service.task.TaskService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public TaskResponse createTask(@Valid @RequestBody TaskCreateRequest request) {
        int taskId = this.taskService.createTask(request);
        return this.taskService.getByIds(List.of(taskId)).get(0);
    }


    @PutMapping("/{taskId}")
    public TaskResponse updateTask(@Valid @RequestBody TaskUpdateRequest request, @PathVariable int taskId) {
        this.taskService.updateTask(taskId, request);
        return this.taskService.getByIds(List.of(taskId)).get(0);
    }
}
