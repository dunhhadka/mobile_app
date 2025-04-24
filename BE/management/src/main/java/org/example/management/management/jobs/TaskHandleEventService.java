package org.example.management.management.jobs;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.example.management.ddd.DomainEvent;
import org.example.management.management.application.model.user.response.UserResponse;
import org.example.management.management.application.service.NotificationService;
import org.example.management.management.application.service.comment.CommentService;
import org.example.management.management.application.service.task.DailyReportService;
import org.example.management.management.application.service.task.TaskCreatedEvent;
import org.example.management.management.application.service.task.TaskService;
import org.example.management.management.application.service.user.UserService;
import org.example.management.management.application.utils.JsonUtils;
import org.example.management.management.domain.event.Event;
import org.example.management.management.domain.event.Notification;
import org.example.management.management.domain.project.Project;
import org.example.management.management.domain.task.Task;
import org.example.management.management.domain.task.events.TaskEvent;
import org.example.management.management.domain.task.events.TaskFinishEvent;
import org.example.management.management.domain.task.events.TaskReOpenEvent;
import org.example.management.management.domain.task.events.TaskStartEvent;
import org.example.management.management.infastructure.persistance.EventRepository;
import org.example.management.management.infastructure.persistance.NotificationRepository;
import org.example.management.management.infastructure.persistance.ProjectRepository;
import org.example.management.management.infastructure.persistance.TaskRepository;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskHandleEventService {

    private final ProjectRepository projectRepository;
    private final UserService userService;
    private final TaskRepository taskRepository;

    private final EventRepository eventRepository;
    private final NotificationRepository notificationRepository;

    private final NotificationService notificationService;

    @EventListener(TaskCreatedEvent.class)
    public void handleTaskCreated(TaskCreatedEvent event) throws JsonProcessingException {
        var projectId = event.projectId();
        var userId = event.userId();
        var taskId = event.taskId();

        var project = this.projectRepository.findById(projectId)
                .orElseThrow();
        var task = this.taskRepository.findById(taskId)
                .orElseThrow();
        var creatorId = project.getCreatedId();

        var users = userService.getByIds(List.of(userId, creatorId))
                .stream().collect(Collectors.toMap(UserResponse::getId, Function.identity()));

        var creator = users.get(creatorId);
        var user = users.get(userId);
        if (creator == null || user == null) {
            return;
        }

        var eventCreate = Event.builder()
                .message(creator.getUserName() + " vừa mới tạo Task " + task.getTitle() + " cho thành viên " + user.getUserName())
                .createdBy(creatorId)
                .build();
        var savedEvent = this.eventRepository.save(eventCreate);

        var notification = buildNotification(user, creator, task, project, savedEvent);
        notificationRepository.save(notification);

        this.notificationService.sendNotifications(List.of(notification));
    }

    private Notification buildNotification(UserResponse user, UserResponse creator, Task task, Project project, Event event) throws JsonProcessingException {
        var taskData = JsonUtils.marshal(new TaskData(task.getId(), project.getId()));

        var message = "Bạn vừa được " + creator.getUserName() + " giao task " + task.getTitle() + " tại dự án " + project.getTitle();

        return Notification.builder()
                .eventId(event.getId())
                .receiveId(user.getId())
                .isRead(false)
                .receiveMessage(message)
                .type(Notification.Type.task)
                .createdAt(Instant.now())
                .data(taskData)
                .build();
    }

    public record TaskData(int taskId, int projectId) {
    }

    @Async
    @EventListener(TaskService.HandleTaskEvent.class)
    public void handleTaskEvent(TaskService.HandleTaskEvent event) throws JsonProcessingException {
        var task = event.task();
        var events = task.getEvents();
        if (CollectionUtils.isEmpty(events)) {
            return;
        }

        this.handleStartEvent(events);
        this.handleFinishTask(events);
        this.handleReOpeeTask(events);
    }

    private void handleReOpeeTask(List<DomainEvent> events) throws JsonProcessingException {
        var possiblyReOpenTask = this.findEvent(events, TaskReOpenEvent.class);
        if (possiblyReOpenTask.isEmpty()) {
            return;
        }

        var reOpenBuilder = new ReOpenEventBuilder(possiblyReOpenTask.get());

        var notification = reOpenBuilder.buildNotification();

        this.notificationService.sendNotifications(List.of(notification));
    }

    private void handleFinishTask(List<DomainEvent> events) throws JsonProcessingException {
        var possiblyFinishTask = this.findEvent(events, TaskFinishEvent.class);
        if (possiblyFinishTask.isEmpty()) {
            return;
        }

        var finishEventBuilder = new FinishEventBuilder(possiblyFinishTask.get());

        var notification = finishEventBuilder.buildNotification();

        this.notificationService.sendNotifications(List.of(notification));
    }

    public <T> Optional<T> findEvent(List<DomainEvent> events, Class<T> clazz) {
        if (CollectionUtils.isEmpty(events)) {
            return Optional.empty();
        }

        return events.stream()
                .filter(clazz::isInstance)
                .map(clazz::cast)
                .findFirst();
    }

    private void handleStartEvent(List<DomainEvent> events) throws JsonProcessingException {
        var possiblyStartEvent = this.findEvent(events, TaskStartEvent.class);
        if (possiblyStartEvent.isEmpty()) {
            return;
        }

        var startEvent = possiblyStartEvent.get();

        var startEventBuilder = new StartEventBuilder(startEvent);
        var notification = startEventBuilder.buildNotification();

        this.notificationService.sendNotifications(List.of(notification));
    }

    public abstract class AbstractEventBuilder<T extends TaskEvent> {

        protected final UserResponse creator;
        protected final UserResponse processor;
        protected final Task task;

        protected AbstractEventBuilder(T event) {
            int creatorId = event.creatorId();
            int processorId = event.processorId();
            int taskId = event.taskId();

            var users = this.getUsers(creatorId, processorId);
            this.creator = users.get(creatorId);
            this.processor = users.get(processorId);

            this.task = taskRepository.findById(taskId)
                    .orElseThrow();
        }

        private Map<Integer, UserResponse> getUsers(int creatorId, int processorId) {
            return userService.getByIds(List.of(creatorId, processorId))
                    .stream().collect(Collectors.toMap(UserResponse::getId, Function.identity()));
        }

        protected Notification buildNotification() throws JsonProcessingException {
            var event = Event.builder()
                    .message(buildMessage())
                    .createdBy(this.processor.getId())
                    .build();
            eventRepository.save(event);

            var notification = Notification.builder()
                    .receiveMessage(event.getMessage())
                    .eventId(event.getId())
                    .receiveId(toUser())
                    .isRead(false)
                    .type(Notification.Type.task)
                    .createdAt(Instant.now())
                    .data(JsonUtils.marshal(new TaskData(task.getId(), task.getProjectId())))
                    .build();
            notificationRepository.save(notification);

            return notification;
        }

        protected abstract int toUser();

        protected abstract String buildMessage();
    }

    public final class StartEventBuilder extends AbstractEventBuilder<TaskStartEvent> {

        private StartEventBuilder(TaskStartEvent event) {
            super(event);
        }

        @Override
        protected int toUser() {
            return creator.getId();
        }

        @Override
        protected String buildMessage() {
            return processor.getUserName() + " đã bắt đầu làm task " + task.getTitle();
        }
    }

    public final class FinishEventBuilder extends AbstractEventBuilder<TaskFinishEvent> {

        private FinishEventBuilder(TaskFinishEvent event) {
            super(event);
        }

        @Override
        protected int toUser() {
            return this.creator.getId();
        }

        @Override
        protected String buildMessage() {
            return this.processor.getUserName() + " vừa mới hoàn thành task " + task.getTitle();
        }
    }

    public final class ReOpenEventBuilder extends AbstractEventBuilder<TaskReOpenEvent> {

        private ReOpenEventBuilder(TaskReOpenEvent event) {
            super(event);
        }

        @Override
        protected int toUser() {
            return this.processor.getId();
        }

        @Override
        protected String buildMessage() {
            return creator.getUserName() + " vừa mở lại task " + task.getTitle();
        }
    }

    @Async
    @EventListener(DailyReportService.DailyReportEvent.class)
    public void handleDailyReportEvent(DailyReportService.DailyReportEvent event) throws JsonProcessingException {
        var taskId = event.taskId();
        var creatorId = event.creatorId();

        var dailyEvent = getEvent(taskId, creatorId);

        var builder = new DailyReportCreateEventBuilder(dailyEvent);
        var notification = builder.buildNotification();

        this.notificationService.sendNotifications(List.of(notification));
    }

    private DailyReportCreateEvent getEvent(int taskId, int processorId) {
        var task = this.taskRepository.findById(taskId)
                .orElseThrow();

        var project = this.projectRepository.findById(task.getProjectId())
                .orElseThrow();

        var createProjectId = project.getCreatedId();

        return new DailyReportCreateEvent(taskId, processorId, createProjectId);
    }

    public final class DailyReportCreateEventBuilder extends AbstractEventBuilder<TaskEvent> {

        private DailyReportCreateEventBuilder(TaskEvent event) {
            super(event);
        }

        @Override
        protected int toUser() {
            return creator.getId();
        }

        @Override
        protected String buildMessage() {
            return processor.getUserName() + " vùa mới báo cáo task " + task.getTitle();
        }
    }

    public static class DailyReportCreateEvent implements TaskEvent {

        private final int taskId;
        private final int creatorId;
        private final int createProjectId;

        public DailyReportCreateEvent(int taskId, int creatorId, int createProjectId) {
            this.taskId = taskId;
            this.creatorId = creatorId;
            this.createProjectId = createProjectId;
        }

        @Override
        public int creatorId() {
            return this.createProjectId;
        }

        @Override
        public int taskId() {
            return this.taskId;
        }

        @Override
        public int processorId() {
            return this.creatorId;
        }
    }

    @Async
    @EventListener(CommentService.CommentCreatedEvent.class)
    public void handleCommentCreated(CommentService.CommentCreatedEvent event) throws JsonProcessingException {

        var senderId = event.getSenderId();
        var taskId = event.getTaskId();

        var task = this.taskRepository.findById(taskId)
                .orElseThrow();

        DailyReportCreateEvent commentEvent;
        if (task.getProcessId() == senderId) {
            var project = this.projectRepository.findById(task.getProjectId())
                    .orElseThrow();
            commentEvent = new DailyReportCreateEvent(taskId, senderId, project.getCreatedId());
        } else {
            commentEvent = new DailyReportCreateEvent(taskId, task.getProcessId(), senderId);
        }

        var commentBuilder = new CommentEventBuilder(senderId, commentEvent);

        var notification = commentBuilder.buildNotification();

        this.notificationService.sendNotifications(List.of(notification));
    }

    public final class CommentEventBuilder extends AbstractEventBuilder<DailyReportCreateEvent> {

        private final int createCommentId;

        public CommentEventBuilder(int processorId, DailyReportCreateEvent event) {
            super(event);

            this.createCommentId = processorId;
        }

        @Override
        protected int toUser() {
            return isProcessorSendComment() ? creator.getId() : processor.getId();
        }

        @Override
        protected String buildMessage() {
            UserResponse user = isProcessorSendComment() ? processor : creator;
            return user.getUserName() + " mới bình luận vào task " + task.getTitle();
        }

        public boolean isProcessorSendComment() {
            return this.createCommentId == processor.getId();
        }
    }
}
