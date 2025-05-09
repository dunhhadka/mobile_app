package org.example.management.management.application.service.task;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.example.management.management.application.model.images.ImageRequest;
import org.example.management.management.application.model.images.StoredImageResult;
import org.example.management.management.application.model.task.*;
import org.example.management.management.application.model.user.response.UserResponse;
import org.example.management.management.application.service.images.ImageProcessService;
import org.example.management.management.application.service.projects.ProjectUpdated;
import org.example.management.management.application.service.user.UserMapper;
import org.example.management.management.application.service.user.UserService;
import org.example.management.management.application.utils.NumberUtils;
import org.example.management.management.domain.profile.User;
import org.example.management.management.domain.task.Image;
import org.example.management.management.domain.task.Task;
import org.example.management.management.domain.task.TaskTimeInfo;
import org.example.management.management.infastructure.exception.ConstrainViolationException;
import org.example.management.management.infastructure.persistance.ImageRepository;
import org.example.management.management.infastructure.persistance.JpaUserRepositoryInterface;
import org.example.management.management.infastructure.persistance.ProjectRepository;
import org.example.management.management.infastructure.persistance.TaskRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final JpaUserRepositoryInterface userRepository;

    private final ApplicationEventPublisher eventPublisher;

    private final TaskMapper taskMapper;
    private final UserMapper userMapper;

    private final ImageProcessService imageProcessService;
    private final ImageRepository imageRepository;

    private final UserService userService;

    @Transactional
    public int createTask(TaskCreateRequest request) throws IOException {
        var project = this.projectRepository.findById(request.getProjectId())
                .orElseThrow(() ->
                        new ConstrainViolationException("project", "project not found with id = " + request.getProjectId()));

        this.validate(request);

        var userInfo = this.getUserInfo(request);
        var assignedUser = userInfo.getKey();
        var processedUser = userInfo.getValue();

        var storeImages = storeImages(request.getImages());
        List<Image> images = buildImages(storeImages);

        var task = new Task(
                request.getTitle(),
                request.getDescription(),
                project.getId(),
                Optional.ofNullable(assignedUser).map(User::getId).orElse(null),
                Optional.ofNullable(processedUser).map(User::getId).orElse(null),
                request.getPriority(),
                request.getDifficulty(),
                request.getStatus() == null ? Task.Status.to_do : request.getStatus(),
                request.getProcessValue(),
                buildTimeInfo(new TaskTimeInfo(), request),
                request.getTags(),
                request.getAttachments()
        );

        task.setImages(images);

        this.taskRepository.save(task);

        eventPublisher.publishEvent(new CreateTaskManagement(project.getId(), task.getProcessId(), task));

        eventPublisher.publishEvent(new ProjectUpdated(project.getId()));

        eventPublisher.publishEvent(new TaskCreatedEvent(project.getId(), task.getProcessId(), task.getId()));

        return task.getId();
    }

    private TaskTimeInfo buildTimeInfo(TaskTimeInfo taskTimeInfo, TaskCreateRequest request) {
        if (taskTimeInfo == null) taskTimeInfo = new TaskTimeInfo();

        return taskTimeInfo.toBuilder()
                .startDate(request.getStartDate())
                .dueDate(request.getDueDate())
                .completedAt(request.getCompletedAt())
                .estimatedTime(request.getEstimatedTime())
                .actualTime(request.getActualTime())
                .actualStartDate(request.getActualStartDate())
                .build();
    }

    private List<Image> buildImages(List<StoredImageResult> storeImages) {
        if (CollectionUtils.isEmpty(storeImages)) return List.of();

        var images = storeImages.stream()
                .filter(Objects::nonNull)
                .map(Image::new)
                .toList();
        if (CollectionUtils.isNotEmpty(images)) {
            return this.imageRepository.saveAll(images);
        }
        return List.of();
    }

    private void validate(TaskCreateRequest request) {
        if (request.getProcessValue() != null &&
                (request.getProcessValue().signum() < 0
                        || request.getProcessValue().compareTo(BigDecimal.valueOf(100)) > 0)) {
            throw new ConstrainViolationException(
                    "process_value",
                    "Tiến độ công việc không hợp lệ"
            );
        }
    }

    private List<StoredImageResult> storeImages(List<TaskImageRequest> images) throws IOException {
        if (CollectionUtils.isEmpty(images)) {
            return List.of();
        }

        return this.imageProcessService.process(images);
    }

    @Transactional
    public void delete(int taskId) {
        var task = this.taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new ConstrainViolationException(
                                "task",
                                "task not found with id " + taskId
                        ));

        eventPublisher.publishEvent(
                new TaskDeletedEvent(
                        task.getId(),
                        task.getAggRoot().getProjectId(),
                        task.getAggRoot().getUserId())
        );

        if (CollectionUtils.isNotEmpty(task.getImageIds())) {
            this.eventPublisher.publishEvent(new ImageDeletedEvent(task.getImageIds()));
        }

        eventPublisher.publishEvent(new ProjectUpdated(task.getProjectId()));

        this.taskRepository.delete(task);
    }

    @Transactional
    public void uploadImage(int taskId, MultipartFile file) throws IOException {
        var task = this.taskRepository.findById(taskId)
                .orElseThrow(() -> new ConstrainViolationException("task", "task not found by id = " + taskId));

        var imageRequest = ImageRequest.builder()
                .file(file)
                .build();
        var imagesStored = this.imageProcessService.process(List.of(imageRequest));

        List<Image> images = imagesStored.stream()
                .filter(Objects::nonNull)
                .map(Image::new)
                .toList();
        var imagesSaved = imageRepository.saveAll(images).get(0);

        task.addImage(imagesSaved.getId());

        this.taskRepository.save(task);
    }

    public List<TaskResponse> getByUserId(int userId) {
        var tasks = this.taskRepository.findByProcessIdIn(List.of(userId));

        if (CollectionUtils.isEmpty(tasks)) {
            return Collections.emptyList();
        }

        var taskIds = tasks.stream()
                .map(Task::getId)
                .distinct()
                .toList();

        return this.getByIds(taskIds);
    }

    public void changeStatus(int taskId, Task.Status status) {
        if (status == null) {
            throw new ConstrainViolationException(
                    "status",
                    "Trạng thái không được để trống"
            );
        }

        var task = this.taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new ConstrainViolationException(
                                "task",
                                "task not found with id " + taskId
                        ));

        task.updateStatus(status);
    }

    public void start(int taskId, int userId) {
        var taskInfo = this.validate(taskId, userId);

        var task = taskInfo.task;

        if (task.getTimeInfo().getActualStartDate() != null) {
            throw new ConstrainViolationException(
                    "task",
                    "Công việc đã bắt đầu"
            );
        }

        task.start();

        taskRepository.save(task);

        eventPublisher.publishEvent(new ProjectUpdated(task.getProjectId()));

        eventPublisher.publishEvent(new HandleTaskEvent(task));
    }

    public record HandleTaskEvent(
            Task task
    ) {
    }

    public void finish(int taskId, int userId) {
        var taskInfo = this.validate(taskId, userId);
        var task = taskInfo.task;
        if (task.getTimeInfo().getCompletedAt() != null) {
            throw new ConstrainViolationException(
                    "task",
                    "Công việc đã được hoàn thành"
            );
        }

        task.finish();

        taskRepository.save(task);

        eventPublisher.publishEvent(new ProjectUpdated(task.getProjectId()));

        eventPublisher.publishEvent(new HandleTaskEvent(task));
    }

    private TaskInfo validate(int taskId, int userId) {
        var task = this.taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new ConstrainViolationException(
                                "task",
                                "Task not found"
                        ));
        var user = this.userRepository.findById(userId)
                .orElseThrow(() ->
                        new ConstrainViolationException(
                                "user",
                                "User not found"
                        ));
        if (user.getId() != task.getProcessId()) {
            throw new ConstrainViolationException(
                    "task",
                    "Công việc không được thực hiện bởi " + user.getUserName() + " nên không thể bắt đầu"
            );
        }

        return new TaskInfo(task, user);
    }

    public void reopen(int taskId, int userId) {
        var task = this.taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new ConstrainViolationException(
                                "task",
                                "Task not found"
                        ));
        if (userId != task.getAssignId()) {
            throw new ConstrainViolationException(
                    "Task",
                    "Công việc không thể mở lại bởi người dùng. Chỉ có người tạo ra task này."
            );
        }

        task.reOpen();

        this.taskRepository.save(task);

        eventPublisher.publishEvent(new ProjectUpdated(task.getProjectId()));

        eventPublisher.publishEvent(new HandleTaskEvent(task));
    }

    public List<TaskResponse> filter(TaskFilterRequest request) {
        Specification<Task> specification = buildSpecification(request);

        var taskIds = this.taskRepository.findAll(specification).stream()
                .map(Task::getId)
                .distinct()
                .toList();

        return this.getByIds(taskIds);
    }

    private Specification<Task> buildSpecification(TaskFilterRequest request) {
        Specification<Task> specification = Specification.where(null);

        if (CollectionUtils.isNotEmpty(request.getIds())) {
            specification = specification.and(TaskSpecification.hasIdIn(request.getIds()));
        }

        if (StringUtils.isNotBlank(request.getTitle())) {
            specification = specification.and(TaskSpecification.likeTitle(request.getTitle()));
        }

        if (request.getStatus() != null) {
            specification = specification.and(TaskSpecification.equalStatus(request.getStatus()));
        }

        if (request.getProcessId() > 0) {
            specification = specification.and(TaskSpecification.equalProcessId(request.getProcessId()));
        }

        if (request.getAssignId() > 0) {
            specification = specification.and(TaskSpecification.equalAssignId(request.getAssignId()));
        }

        if (request.getProjectId() > 0) {
            specification = specification.and(TaskSpecification.equalByProjectId(request.getProjectId()));
        }

        return specification;
    }

    record TaskInfo(Task task, User user) {
    }

    public record TaskDeletedEvent(int taskId, int projectId, int userId) {
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
    public void updateTask(int taskId, TaskUpdateRequest request) throws IOException {
        var task = this.taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new ConstrainViolationException("task", "task not found by id = " + taskId));

        this.validate(task, request);

        this.validate(request);

        Integer oldProcessId = task.getProcessId();

        this.updateTaskUser(request, task);

        task.update(request.getPriority(), request.getDifficulty(), request.getStatus());

        task.updateTimeInfo(buildTimeInfo(task.getTimeInfo(), request));

        task.updateTags(request.getTags());

        task.upAttachments(request.getAttachments());

        task.updateProcessValue(request.getProcessValue());

        if (request.getFinishedOn() != null) {
            task.markupFinished(request.getFinishedOn());
        }

        this.updateImages(task, request.getImages());

        this.eventPublisher.publishEvent(new UpdateTasKManagement(task.getProjectId(), oldProcessId, task.getProcessId(), task));

        this.eventPublisher.publishEvent(new ProjectUpdated(task.getProjectId()));

        this.taskRepository.save(task);
    }

    private void updateImages(Task task, List<TaskImageRequest> images) throws IOException {
        var currentImageIds = task.getImageIds();

        var imagesRequestInfo = getImageInfos(images);

        var storedNewImages = this.imageProcessService.process(imagesRequestInfo.imagesInsert);
        var newImages = buildImages(storedNewImages);

        var updateImages = buildUpdateImages(currentImageIds, imagesRequestInfo.imagesUpdate);

        var imagesDeleted = task.updateImagesAndGetImageDeleted(updateImages, newImages);

        if (imagesDeleted != null) {
            this.eventPublisher.publishEvent(new ImageDeletedEvent(imagesDeleted));
        }

        this.updateImages(updateImages);
    }

    public record ImageDeletedEvent(List<Integer> imageIds) {

    }

    private void updateImages(Map<Integer, TaskImageRequest> updateImages) {
        if (updateImages == null || updateImages.isEmpty()) return;

        var images = this.imageRepository.findByIdIn(updateImages.keySet().stream().toList())
                .stream().collect(Collectors.toMap(Image::getId, Function.identity()));

        var imageUpdated = new ArrayList<Image>();
        updateImages.forEach((imageId, request) -> {
            var image = images.get(imageId);
            if (image == null) {
                throw new ConstrainViolationException(
                        "image",
                        "image not found with id " + imageId
                );
            }
            image.setAlt(request.getAlt());
            imageUpdated.add(image);
        });
        if (CollectionUtils.isNotEmpty(imageUpdated)) {
            this.imageRepository.saveAll(imageUpdated);
        }
    }

    private Map<Integer, TaskImageRequest> buildUpdateImages(List<Integer> currentImageIds, List<TaskImageRequest> imagesUpdate) {
        if (CollectionUtils.isEmpty(currentImageIds)) {
            return Map.of();
        }

        Map<Integer, TaskImageRequest> updateImages = new LinkedHashMap<>();
        for (var image : imagesUpdate) {
            var imageId = image.getId();
            if (currentImageIds.stream().allMatch(id -> id != imageId)) {
                throw new ConstrainViolationException(
                        "image",
                        "image not found with id = " + imageId
                );
            }
            updateImages.put(imageId, image);
        }
        return updateImages;
    }

    private ImageRequestInfo getImageInfos(List<TaskImageRequest> images) {
        if (CollectionUtils.isEmpty(images)) {
            return new ImageRequestInfo(List.of(), List.of());
        }

        List<TaskImageRequest> imagesUpdate = new ArrayList<>();
        List<TaskImageRequest> imagesInsert = new ArrayList<>();
        for (var image : images) {
            if (image.getId() != null) {
                imagesUpdate.add(image);
            } else {
                imagesInsert.add(image);
            }
        }

        return new ImageRequestInfo(imagesUpdate, imagesInsert);
    }

    record ImageRequestInfo(List<TaskImageRequest> imagesUpdate, List<TaskImageRequest> imagesInsert) {
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

        var tasks = this.taskRepository.findByIdIn(taskIds);

        var imageIds = tasks.stream()
                .filter(task -> CollectionUtils.isNotEmpty(task.getImageIds()))
                .flatMap(task -> task.getImageIds().stream())
                .toList();
        var images = this.imageRepository.findByIdIn(imageIds);

        var taskWithImages = tasks.stream()
                .map(task -> {
                    var imageIdsInTask = CollectionUtils.isEmpty(task.getImageIds()) ? List.of() : task.getImageIds();
                    var imagesInTask = images.stream()
                            .filter(image -> imageIdsInTask.contains(image.getId()))
                            .toList();
                    return new TaskWithImage(task, imagesInTask);
                })
                .toList();

        List<Integer> userIds = tasks.stream()
                .flatMap(task -> {
                    List<Integer> userTaskIds = new ArrayList<>();
                    if (task.getAssignId() != null) userTaskIds.add(task.getAssignId());
                    if (task.getProcessId() != null) userTaskIds.add(task.getProcessId());
                    return userTaskIds.stream();
                })
                .distinct()
                .toList();

        var userMap = this.userService.getByIds(userIds)
                .stream()
                .collect(Collectors.toMap(UserResponse::getId, Function.identity()));

        return taskWithImages.stream()
                .map(taskWithImage ->
                        this.taskMapper.toResponse(
                                taskWithImage.task,
                                taskWithImage.images,
                                userMap.get(taskWithImage.task.getAssignId()),
                                userMap.get(taskWithImage.task.getProcessId()))
                )
                .sorted(Comparator.comparingInt(TaskResponse::getId).reversed())
                .toList();

    }

    public record TaskWithImage(Task task, List<Image> images) {
    }
}
