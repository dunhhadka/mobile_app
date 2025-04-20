package org.example.management.management.application.service.leaves;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.management.management.application.model.leaves.LeaveRequest;
import org.example.management.management.application.model.leaves.LeaveResponse;
import org.example.management.management.application.model.leaves.UpdateStatusLeaveRequest;
import org.example.management.management.application.model.leaves.UserAttendResponse;
import org.example.management.management.application.service.NotificationService;
import org.example.management.management.domain.leaves.Leave;
import org.example.management.management.domain.leaves.LeaveCreatedEvent;
import org.example.management.management.domain.leaves.LeaveRepository;
import org.example.management.management.domain.profile.User;
import org.example.management.management.domain.profile.UserRepository;
import org.example.management.management.domain.task.Task;
import org.example.management.management.infastructure.exception.ConstrainViolationException;
import org.example.management.management.infastructure.persistance.TaskRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeaveService {
    private final LeaveRepository leaveRepository;
    private final LeaveMapper leaveMapper;
    private final TaskRepository taskRepository;
    private final ApplicationEventPublisher applicationEventPublisher;
    private final UserRepository userRepository;

    @Transactional
    public int createLeave(LeaveRequest request, Integer userId) {
        //TODO: Kiem tra delegateId co o trong project co delegateId khong

        Integer userPrincipal = userId; // Sau khi cấu hình security sẽ có
        List<Task> tasks = taskRepository.findByProcessIdIn(List.of(userId));
        Integer managerId = null;
        if(!CollectionUtils.isEmpty(tasks)) {
            managerId = tasks.get(0).getAssignId();
        }
        var leave = new Leave(
                request.getCategory(),
                request.getStartLeave(),
                request.getEndLeave(),
                request.getContactPhone(),
                request.getDescription(),
                userId,
                CollectionUtils.isEmpty(tasks) ? null : tasks.get(0).getId()
        );
        if (request.getEndLeave().isBefore(request.getStartLeave())) {
            throw new ConstrainViolationException("startLeave" + request.getStartLeave() + ",endLeave" + request.getEndLeave(), "endLeave must be after startLeave");
        }


        leave.setStatus(Leave.Status.review);
        leave = this.leaveRepository.save(leave);
        log.info(String.valueOf(leave.getId()));
        //TODO: Gửi thông báo đến người leader dự án
        this.applicationEventPublisher.publishEvent(new LeaveCreatedEvent(
                Instant.now(),
                managerId,
                userId,
                leave.getId(),
                leave.getCategory(),
                leave.getStartLeave(),
                leave.getEndLeave()
        ));
        return leave.getId();
    }

    public List<LeaveResponse> getLeavesWithCurrentUser(Integer userId) {
        List<Leave> leaves = leaveRepository.findByCreatedBy(userId);
        if(CollectionUtils.isEmpty(leaves)) {
            return new ArrayList<>();
        }
        return leaves.stream().map(leaveMapper::toLeaveResponse).toList();
    }

    @Transactional
    public LeaveResponse updateLeaveStatus(Integer leaveId, Integer userId, Leave.Status status) {
        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ConstrainViolationException("leaveId", "Không tìm thấy đơn xin nghỉ"));
        leave.updateLeaveStatus(leaveId, status);
        leaveRepository.save(leave);
        this.applicationEventPublisher.publishEvent(new );
        return leaveMapper.toLeaveResponse(leave);
    }

    @Transactional
    public LeaveResponse rejectLeave(Integer leaveId, Integer userId) {
        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ConstrainViolationException("leaveId", "Không tìm thấy đơn xin nghỉ"));
        leave.reject(userId, Instant.now());
        leaveRepository.save(leave);
        return leaveMapper.toLeaveResponse(leave);
    }

    @Transactional
    public LeaveResponse approveLeave(Integer leaveId, Integer userId) {
        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ConstrainViolationException("leaveId", "Không tìm thấy đơn xin nghỉ"));
        User user = userRepository.findById(userId)
                        .orElseThrow(() -> new ConstrainViolationException("userId", "Không tìm thấy người dùng đăng nhập"));

        leave.approve(userId, Instant.now());
        leaveRepository.save(leave);
        return leaveMapper.toLeaveResponse(leave);
    }

    public LeaveResponse getLeaveById(int leaveId) {
        var leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ConstrainViolationException("" + leaveId, "leaveId not found!"));

        return leaveMapper.toLeaveResponse(leave);
    }

    public List<LeaveResponse> getByIds(List<Integer> leaveIds) {
        if (CollectionUtils.isEmpty(leaveIds)) {
            return Collections.emptyList();
        }
        var leaves = leaveRepository.findByIdIn(leaveIds);
        return leaves.stream().map(leaveMapper::toLeaveResponse).toList();
    }


}
