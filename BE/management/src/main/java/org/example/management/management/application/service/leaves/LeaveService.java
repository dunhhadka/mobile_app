package org.example.management.management.application.service.leaves;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.management.management.application.model.leaves.LeaveRequest;
import org.example.management.management.application.model.leaves.LeaveResponse;
import org.example.management.management.application.model.leaves.UpdateStatusLeaveRequest;
import org.example.management.management.application.model.leaves.UserAttendResponse;
import org.example.management.management.application.model.user.response.UserResponse;
import org.example.management.management.application.service.user.UserMapper;
import org.example.management.management.domain.leaves.Leave;
import org.example.management.management.domain.leaves.LeaveRepository;
import org.example.management.management.domain.profile.User;
import org.example.management.management.domain.profile.UserRepository;
import org.example.management.management.domain.project.Project;
import org.example.management.management.domain.task.ProjectManagement;
import org.example.management.management.domain.task.Task;
import org.example.management.management.infastructure.exception.ConstrainViolationException;
import org.example.management.management.infastructure.persistance.ProjectManagementRepository;
import org.example.management.management.infastructure.persistance.ProjectRepository;
import org.example.management.management.infastructure.persistance.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeaveService {
    private final LeaveRepository leaveRepository;
    private final LeaveMapper leaveMapper;
    private final TaskRepository taskRepository;
    private final ProjectManagementRepository projectManagementRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional
    public int createLeave(LeaveRequest request, Integer userId) {
        //TODO: Kiem tra delegateId co o trong project co delegateId khong

        Integer userPrincipal = userId;
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ConstrainViolationException("userId", "user not found"));
        if(!Objects.isNull(request.getDelegateId())) {
            List<User> potentialDelegate = userRepository.findByPosition(user.getPosition());
            User delegateUser = userRepository.findById(request.getDelegateId())
                    .orElseThrow(() -> new ConstrainViolationException("delegateId", "delegateId not found"));
            if(!potentialDelegate.contains(delegateUser)) {
                throw new ConstrainViolationException("delegateId", "delegateId not found with list potential delegate");
            }
        }
        var leave = new Leave(
                request.getCategory(),
                request.getStartLeave(),
                request.getEndLeave(),
                request.getDelegateId(),
                request.getContactPhone(),
                request.getDescription(),
                request.getCurrentTaskId(),
                userId
        );
        if (request.getEndLeave().isBefore(request.getStartLeave())) {
            throw new ConstrainViolationException("startLeave" + request.getStartLeave() + ",endLeave" + request.getEndLeave(), "endLeave must be after startLeave");
        }
        long days = ChronoUnit.DAYS.between(request.getStartLeave().atZone(ZoneId.systemDefault()).toLocalDate(),
                request.getEndLeave().atZone(ZoneId.systemDefault()).toLocalDate()
        ) + 1;
        leave.setTotalLeave(BigDecimal.valueOf(days));
        this.leaveRepository.save(leave);
        //TODO: Gửi thông báo đến người được gắn task;
        return leave.getId();
    }

    public List<UserResponse> getPotentialDelegates(Integer userId) {
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new ConstrainViolationException("userId", "User not found"));
        List<User> usersSamePosition = userRepository.findByPosition(currentUser.getPosition());
        if(CollectionUtils.isEmpty(usersSamePosition)) {
            usersSamePosition = List.of();
        }
        return usersSamePosition.stream()
                .map(userMapper::toUserResponse).toList();
    }


    //Update task khi chuyển giao thành công: trong trường hợp lead chấp thuận
    public void delegateTasks(Integer userId, Integer delegateId) {
        List<Task> userTasks = getTaskForUser(userId);
        User delegate = userRepository.findById(delegateId)
                .orElseThrow(() -> new IllegalArgumentException("Delegate not found"));

        for (Task task : userTasks) {
            // Chuyển giao assignId và processId
            if (task.getAssignId() != null && task.getAssignId().equals(userId)) {
                task.updateUser(delegate.getId(), task.getProcessId());
            }
            if (task.getProcessId() != null && task.getProcessId().equals(userId)) {
                task.updateUser(task.getAssignId(), delegate.getId());
            }
            taskRepository.save(task);
        }
    }

    public List<Task> getTaskForUser(Integer userId) {
        return taskRepository.findByAssignId(userId);
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
