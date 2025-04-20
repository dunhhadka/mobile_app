package org.example.management.management.jobs;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.management.management.application.service.NotificationService;
import org.example.management.management.application.service.user.UserService;
import org.example.management.management.application.utils.JsonUtils;
import org.example.management.management.domain.event.Event;
import org.example.management.management.domain.event.Notification;
import org.example.management.management.domain.leaves.LeaveCreatedEvent;
import org.example.management.management.domain.leaves.LeaveData;
import org.example.management.management.domain.leaves.LeaveRepository;
import org.example.management.management.domain.leaves.LeaveUpdateStatusEvent;
import org.example.management.management.infastructure.exception.ConstrainViolationException;
import org.example.management.management.infastructure.persistance.EventRepository;
import org.example.management.management.infastructure.persistance.NotificationRepository;
import org.example.management.management.infastructure.persistance.ProjectRepository;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

@Slf4j
@Component
@RequiredArgsConstructor
public class LeaveHandleEventService {
    private final NotificationService notificationService;

    private final UserService userService;
    private final ProjectRepository projectRepository;

    private final EventRepository eventRepository;
    private final NotificationRepository notificationRepository;
    private final LeaveRepository leaveRepository;

    @Async
    @EventListener
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleLeaveUpdateStatus(LeaveUpdateStatusEvent event) throws JsonProcessingException{
        Objects.requireNonNull(event);

    }

    @Async
    @EventListener
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleLeaveCreated(LeaveCreatedEvent event) throws JsonProcessingException {
        // Lấy thông tin người tạo đơn nghỉ
        log.info(event.leaveId().toString());
        log.info("Leave handle event service");
        Objects.requireNonNull(event);
        log.info("event" + event.createdBy());
        var createdByUser = userService.getUserById(event.createdBy());


        // Lấy thông tin đơn nghỉ
        var leave = leaveRepository.findById(event.leaveId())
                .orElseThrow(() -> new ConstrainViolationException(
                        "leave",
                        "Không tìm thấy đơn nghỉ với ID: " + event.leaveId()
                ));

        // Tạo thông điệp sự kiện
        String message = createdByUser.getUserName() + " vừa tạo đơn xin nghỉ: " + leave.getCategory();
        var newEvent = Event.builder()
                .message(message)
                .createdBy(event.createdBy())
                .build();
        var savedEvent = eventRepository.save(newEvent);

        // Tạo thông báo cho người quản lý
        var notification = Notification.builder()
                .receiveMessage(createdByUser.getUserName() + " đã gửi đơn xin nghỉ '" + leave.getCategory() +
                        "' từ " + leave.getStartLeave() + " đến " + leave.getEndLeave())
                .receiveId(event.managerId())
                .eventId(savedEvent.getId())
                .isRead(false)
                .type(Notification.Type.leave)
                .createdAt(Instant.now())
                .data(JsonUtils.marshal(new LeaveData(leave.getId())))
                .build();

        // Lưu và gửi thông báo
        notificationRepository.save(notification);
        notificationService.sendNotifications(List.of(notification));
    }
}
