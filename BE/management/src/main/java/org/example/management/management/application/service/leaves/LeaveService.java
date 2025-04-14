package org.example.management.management.application.service.leaves;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.management.management.application.model.leaves.LeaveRequest;
import org.example.management.management.application.model.leaves.LeaveResponse;
import org.example.management.management.application.model.leaves.UpdateStatusLeaveRequest;
import org.example.management.management.application.model.leaves.UserAttendResponse;
import org.example.management.management.domain.leaves.Leave;
import org.example.management.management.domain.leaves.LeaveRepository;
import org.example.management.management.domain.task.Task;
import org.example.management.management.infastructure.exception.ConstrainViolationException;
import org.example.management.management.infastructure.persistance.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeaveService {
    private final LeaveRepository leaveRepository;
    private final LeaveMapper leaveMapper;
    private final TaskDelegationService taskDelegationService;
    private final TaskRepository taskRepository;
    @Transactional
    public int createLeave(LeaveRequest request, Integer taskId, Integer userId) {
        //TODO: Kiem tra delegateId co o trong project co delegateId khong

        Integer userPrincipal = userId; // Sau khi cấu hình security sẽ có
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ConstrainViolationException(taskId.toString(), "task id not found"));
        List<UserAttendResponse> userAttends = taskDelegationService.getTaskDelegationCandidates(taskId);
        Optional<UserAttendResponse> optUser = userAttends.stream()
                .filter(u -> !u.getId().equals(userPrincipal))
                .filter(u -> u.getId().equals(request.getDelegateId()))
                .findFirst();
        if(optUser.isEmpty()) {
            throw new ConstrainViolationException(request.getDelegateId().toString(), "Delegate id not found in project manager");
        }
        var leave = new Leave(
                request.getCategory(),
                request.getStartLeave(),
                request.getEndLeave(),
                request.getDelegateId(),
                request.getContactPhone(),
                request.getDescription(),
                request.getCurrentTaskId()
        );
        if (request.getEndLeave().isBefore(request.getStartLeave())) {
            throw new ConstrainViolationException("startLeave" + request.getStartLeave() + ",endLeave" + request.getEndLeave(), "endLeave must be after startLeave");
        }
        long days = ChronoUnit.DAYS.between(request.getStartLeave().atZone(ZoneId.systemDefault()).toLocalDate(),
                request.getEndLeave().atZone(ZoneId.systemDefault()).toLocalDate()
        ) + 1;
        leave.setTaskWithCurrentTaskId(task);
        leave.setTotalLeave(BigDecimal.valueOf(days));
        leave.setStatus(Leave.Status.review);
        this.leaveRepository.save(leave);
        //TODO: Gửi thông báo đến người leader dự án
        return leave.getId();
    }

    @Transactional
    public void updateLeave(int leaveId, LeaveRequest request) {


        var leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ConstrainViolationException("" + leaveId, "leaveId not found"));
        leave.update(
                request.getCategory(),
                request.getStartLeave(),
                request.getEndLeave(),
                request.getDelegateId(),
                request.getContactPhone(),
                request.getDescription()
        );
        leaveRepository.save(leave);
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

    public LeaveResponse updateLeaveStatus(int leaveId, UpdateStatusLeaveRequest request) {
        // truyền người dùng chấp thuận hoặc reject bằng context lấy từ securityContextHolder
        var leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ConstrainViolationException("" + leaveId, "leaveId not found"));
        // Ví dụ user nhận được form leaves
        int userId = 1;
        if (request.getStatus() == Leave.Status.approved) {
            leave.approve(userId, Instant.now());
        } else if (request.getStatus() == Leave.Status.rejected) {
            leave.reject(userId, Instant.now());
        }
        leaveRepository.save(leave);
        return leaveMapper.toLeaveResponse(leave);
    }
}
