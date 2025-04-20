package org.example.management.management.jobs;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.example.management.management.application.model.user.response.UserResponse;
import org.example.management.management.application.service.NotificationService;
import org.example.management.management.application.service.event.EventModel;
import org.example.management.management.application.service.projects.ProjectUpdated;
import org.example.management.management.application.service.user.UserService;
import org.example.management.management.application.utils.JsonUtils;
import org.example.management.management.application.utils.NumberUtils;
import org.example.management.management.domain.event.Event;
import org.example.management.management.domain.event.Notification;
import org.example.management.management.domain.project.Project;
import org.example.management.management.domain.project.ProjectCreatedEvent;
import org.example.management.management.domain.task.Task;
import org.example.management.management.infastructure.exception.ConstrainViolationException;
import org.example.management.management.infastructure.persistance.EventRepository;
import org.example.management.management.infastructure.persistance.NotificationRepository;
import org.example.management.management.infastructure.persistance.ProjectManagementRepository;
import org.example.management.management.infastructure.persistance.ProjectRepository;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProjectHandleEventService {

    private final NotificationService notificationService;

    private final UserService userService;
    private final ProjectRepository projectRepository;

    private final EventRepository eventRepository;
    private final NotificationRepository notificationRepository;

    private final ProjectManagementRepository projectManagementRepository;

    @Async
    @EventListener(EventModel.class)
    public void handleProjectCreated(EventModel event) throws JsonProcessingException {
        var object = event.object();

        // chuyển string => object
        var project = JsonUtils.unmarshal(object, Project.class);

        var createdEvent = project.getEvents().stream()
                .filter(ProjectCreatedEvent.class::isInstance)
                .map(ProjectCreatedEvent.class::cast)
                .findFirst()
                .orElse(null);

        if (createdEvent == null) return;

        var userIds = Stream
                .concat(
                        Optional.of(createdEvent.getCreatedBy()).stream(),
                        createdEvent.getMemberIds().stream()
                )
                .filter(NumberUtils::isPositive)
                .toList();

        var users = this.getUser(userIds);

        var createdUser = users.get(createdEvent.getCreatedBy());

        var createdProject = this.projectRepository.findById(createdEvent.getProjectId())
                .orElseThrow(() ->
                        new ConstrainViolationException(
                                "project",
                                "Không tim thấy dự án"
                        ));

        String messageBuilder = createdUser.getUserName() +
                " vừa tạo Dự án - " +
                createdProject.getTitle();

        var newEvent = Event.builder()
                .message(messageBuilder)
                .createdBy(createdEvent.getCreatedBy())
                .build();
        var savedEvent = this.eventRepository.save(newEvent);

        var projectJson = JsonUtils.marshal(new Data(project.getId()));

        // thông báo của người tạo project sé khác với thông báo của người được thêm vào project
        var createdNotification = createNotificationForCreateUser(users.get(createdEvent.getCreatedBy()), createdEvent, project, projectJson);

        List<Notification> notifications = new ArrayList<>();
        if (CollectionUtils.isNotEmpty(createdEvent.getMemberIds())) {
            notifications = createNewNotification(savedEvent, createdEvent.getMemberIds(), users, project, projectJson);
        }

        var allNotifications = Stream.concat(
                Stream.of(createdNotification),
                notifications.stream()
        ).toList();

        this.notificationRepository.saveAll(allNotifications);

        this.notificationService.sendNotifications(allNotifications);
    }

    public record Data(int projectId) {

    }

    private Notification createNotificationForCreateUser(UserResponse userResponse, ProjectCreatedEvent createdEvent, Project project, String projectJson) {
        return Notification.builder()
                .receiveMessage("Bạn vừa tạo tạo dự án " + project.getTitle())
                .receiveId(userResponse.getId())
                .isRead(false)
                .type(Notification.Type.user)
                .createdAt(Instant.now())
                .data(projectJson)
                .build();
    }

    private List<Notification> createNewNotification(Event savedEvent, List<Integer> memberIds, Map<Integer, UserResponse> users, Project project, String projectJson) {
        log.info("Create notification for ListUser");

        return memberIds.stream()
                .map(memberId -> buildNotification(savedEvent, memberId, users, project, projectJson))
                .toList();
    }

    private Notification buildNotification(Event savedEvent, Integer memberId, Map<Integer, UserResponse> userResponse, Project project, String projectJson) {
        var createdUser = userResponse.get(savedEvent.getCreatedBy());

        var message = "Bạn vừa được " + createdUser.getUserName() + " thêm vào dự án " + project.getTitle();

        return Notification.builder()
                .receiveMessage(message)
                .eventId(savedEvent.getId())
                .receiveId(memberId)
                .isRead(false)
                .type(Notification.Type.user)
                .createdAt(Instant.now())
                .data(projectJson)
                .build();
    }

    private Map<Integer, UserResponse> getUser(List<Integer> userIds) {
        return this.userService.getByIds(userIds)
                .stream()
                .collect(Collectors.toMap(
                        UserResponse::getId,
                        Function.identity()
                ));
    }

    @Async
    @EventListener(ProjectUpdated.class)
    public void handleProjectUpdated(ProjectUpdated projectUpdated) {
        var projectId = projectUpdated.projectId();

        var project = this.projectRepository.findById(projectId)
                .orElseThrow();

        var projectManagements = this.projectManagementRepository.findByProjectId(projectId);

        var tasks = projectManagements.stream()
                .filter(p -> CollectionUtils.isNotEmpty(p.getManagements()))
                .flatMap(p -> p.getManagements().stream())
                .toList();

        if (CollectionUtils.isEmpty(tasks)) return;

        var updateModal = getUpdateProjectModal(tasks);

        project.update(updateModal);

        this.projectRepository.save(project);
    }

    private static UpdateProjectModal getUpdateProjectModal(List<Task> tasks) {
        var updateModal = new UpdateProjectModal();
        for (var task : tasks) {
            if (task.getStatus() == null || task.getStatus() == Task.Status.to_do) updateModal.increaseToDo();
            else if (task.getStatus() == Task.Status.in_process) updateModal.increaseInProgress();
            else if (task.getStatus() == Task.Status.finish) updateModal.increaseFinish();

            updateModal.increaseTask();

            updateModal.increaseProgress(task.getProcessValue() == null ? BigDecimal.ZERO : task.getProcessValue());
        }
        return updateModal;
    }

    @Getter
    @Setter
    public static class UpdateProjectModal {
        private int totalToDo;
        private int totalInProgress;
        private int totalFinish;
        private int totalTask;

        private BigDecimal progress;

        public void increaseToDo() {
            this.totalToDo++;
        }

        public void increaseInProgress() {
            this.totalInProgress++;
        }

        public void increaseFinish() {
            this.totalFinish++;
        }

        public void increaseTask() {
            this.totalTask++;
        }

        public void increaseProgress(BigDecimal progress) {
            if (this.progress == null) this.progress = BigDecimal.ZERO;
            this.progress = this.progress.add(progress);
        }

        public BigDecimal calculateProgress() {
            if (this.totalTask == 0) return BigDecimal.ZERO;
            return this.progress.divide(BigDecimal.valueOf(totalTask), RoundingMode.FLOOR);
        }
    }
}
