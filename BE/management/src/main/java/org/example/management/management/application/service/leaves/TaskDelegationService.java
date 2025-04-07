package org.example.management.management.application.service.leaves;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.management.management.application.model.leaves.UserAttendResponse;
import org.example.management.management.domain.profile.User;
import org.example.management.management.domain.profile.UserRepository;
import org.example.management.management.domain.task.ProjectManagement;
import org.example.management.management.domain.task.Task;
import org.example.management.management.infastructure.exception.ConstrainViolationException;
import org.example.management.management.infastructure.persistance.ProjectManagementRepository;
import org.example.management.management.infastructure.persistance.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskDelegationService {
    private final TaskRepository taskRepository;
    private final ProjectManagementRepository projectManagementRepository;
    private final UserRepository userRepository;

    public List<UserAttendResponse> getTaskDelegationCandidates(int taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ConstrainViolationException(String.valueOf(taskId), "Task not found"));
        // Lấy danh sách user_id từ project_management dựa trên project_id
        List<ProjectManagement> projectMembers = projectManagementRepository.findByProjectId(task.getProjectId());
        // Lấy thông tin user tham gia task
        List<Integer> userIds = projectMembers.stream()
                .map(ProjectManagement::getUserId)
                .toList();
        List<User> users = userRepository.findAllByIds(userIds);
        return users.stream().map(user -> new UserAttendResponse(
                user.getId(),
                user.getUserName(),
                user.getPosition().toString()
        )).toList();
    }
}
