package org.example.management.management.application.service.task;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.example.management.management.application.model.task.TaskCreateRequest;
import org.example.management.management.application.model.task.TaskResponse;
import org.example.management.management.application.model.task.TaskUpdateRequest;
import org.example.management.management.application.service.projectmanagement.ProjectManagementService;
import org.example.management.management.application.utils.NumberUtils;
import org.example.management.management.domain.profile.User;
import org.example.management.management.domain.task.ProjectManagement;
import org.example.management.management.domain.task.Task;
import org.example.management.management.infastructure.exception.ConstrainViolationException;
import org.example.management.management.infastructure.persistance.JpaUserRepositoryInterface;
import org.example.management.management.infastructure.persistance.ProjectRepository;
import org.example.management.management.infastructure.persistance.TaskRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final JpaUserRepositoryInterface userRepository;

    private final ApplicationEventPublisher eventPublisher;

    private final TaskMapper taskMapper;

    @Transactional
    public int createTask(TaskCreateRequest request) {
        var project = this.projectRepository.findById(request.getProjectId())
                .orElseThrow(() ->
                        new ConstrainViolationException("project", "project not found with id = " + request.getProjectId()));

        var userInfo = this.getUserInfo(request);
        var assignedUser = userInfo.getKey();
        var processedUser = userInfo.getValue();

        var task = new Task(
                request.getTitle(),
                request.getDescription(),
                project.getId(),
                Optional.ofNullable(assignedUser).map(User::getId).orElse(null),
                Optional.ofNullable(processedUser).map(User::getId).orElse(null),
                request.getPriority(),
                request.getDifficulty(),
                request.getStatus()
        );

        this.taskRepository.save(task);

        eventPublisher.publishEvent(new CreateTaskManagement(project.getId(), task.getProcessId(), task));

        return task.getId();
    }

    public record CreateTaskManagement(
            int projectId,
            Integer userId,
            Task task
    ) {
    }

    /**
     * @return pair <br/>
     * - left: assigned user
     * - right: processed user
     */
    private Pair<User, User> getUserInfo(TaskCreateRequest request) {
        if (!NumberUtils.isPositive(request.getAssignId())
                && !NumberUtils.isPositive(request.getAssignId())) {
            return Pair.of(null, null);
        }

        Integer assignedId = request.getAssignId();
        Integer processedId = request.getProcessId();

        User assignedUser = null;
        User processedUser = null;

        if (NumberUtils.isPositive(assignedId)) {
            assignedUser = this.userRepository.findById(assignedId)
                    .orElseThrow(() ->
                            new ConstrainViolationException("user", "user not found with id = " + assignedId));
        }
        if (NumberUtils.isPositive(processedId)) {
            processedUser = this.userRepository.findById(processedId)
                    .orElseThrow(() ->
                            new ConstrainViolationException("user", "user not found with id = " + processedId));
        }

        return Pair.of(assignedUser, processedUser);
    }

    @Transactional
    public void updateTask(int taskId, TaskUpdateRequest request) {
        var task = this.taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new ConstrainViolationException("task", "task not found by id = " + taskId));

        this.validate(task, request);

        int oldProcessId = task.getProcessId();

        this.updateTaskUser(request, task);

        task.update(request.getPriority(), request.getDifficulty(), request.getStatus());

        if (request.getFinishedOn() != null) {
            task.markupFinished(request.getFinishedOn());
        }

        this.eventPublisher.publishEvent(new UpdateTasKManagement(task.getProjectId(), oldProcessId, task.getProcessId(), task));

        this.taskRepository.save(task);
    }

    public record UpdateTasKManagement(
            int projectId,
            Integer oldUserId,
            Integer newUserId,
            Task task
    ) {
    }

    private void updateTaskUser(TaskUpdateRequest request, Task task) {
        if (Objects.equals(request.getAssignId(), task.getAssignId())
                && Objects.equals(request.getProcessId(), task.getProcessId())) {
            log.info("No update for user of task");
            return;
        }

        var userInfo = this.getUserInfo(request);
        var assignedUser = userInfo.getKey();
        var processedUser = userInfo.getValue();

        task.updateUser(
                Optional.ofNullable(assignedUser).map(User::getId).orElse(null),
                Optional.ofNullable(processedUser).map(User::getId).orElse(null)
        );
    }

    /**
     * Không thể update projectId của task
     */
    private void validate(Task task, TaskUpdateRequest request) {
        if (!Objects.equals(task.getProjectId(), request.getProjectId())) {
            throw new ConstrainViolationException(
                    "project_id",
                    "cannot update project of task"
            );
        }
    }

    public List<TaskResponse> getByIds(List<Integer> taskIds) {
        if (CollectionUtils.isEmpty(taskIds)) {
            return Collections.emptyList();
        }

        return this.taskRepository.findByIdIn(taskIds)
                .stream()
                .map(this.taskMapper::toResponse)
                .toList();

    }
}
