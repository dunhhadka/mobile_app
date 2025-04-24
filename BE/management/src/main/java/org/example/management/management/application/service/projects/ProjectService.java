package org.example.management.management.application.service.projects;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.example.management.management.application.model.project.ProjectRequest;
import org.example.management.management.application.model.project.ProjectResponse;
import org.example.management.management.application.service.event.EventModel;
import org.example.management.management.application.service.projectmanagement.ProjectManagementService;
import org.example.management.management.application.utils.JsonUtils;
import org.example.management.management.domain.profile.User;
import org.example.management.management.domain.project.Project;
import org.example.management.management.domain.task.ProjectManagement;
import org.example.management.management.infastructure.exception.ConstrainViolationException;
import org.example.management.management.infastructure.persistance.JpaUserRepositoryInterface;
import org.example.management.management.infastructure.persistance.ProjectManagementRepository;
import org.example.management.management.infastructure.persistance.ProjectRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final JpaUserRepositoryInterface jpaUserRepositoryInterface;
    private final ProjectRepository projectRepository;
    private final ProjectManagementRepository projectManagementRepository;

    private final ProjectManagementService projectManagementService;

    private final ProjectMapper projectMapper;

    private final ApplicationEventPublisher applicationEventPublisher;

    // region write
    @Transactional
    public int create(ProjectRequest request) {
        var project = buildGeneralInfo(null, request);

        List<Integer> userIds = new ArrayList<>();
        this.setUserIds(request.getUserIds(), request, userIds);

        project = project.toBuilder()
                .createdOn(Instant.now())
                .modifiedOn(Instant.now())
                .build();

        projectRepository.save(project);

        var event = new ProjectCreatedEvent(project.getId(), new UserInProjectInfo(List.of(), userIds), project);
        this.projectManagementService.handleProjectCreated(event);

        this.applicationEventPublisher.publishEvent(event);

        project.addEvents(
                project.getCreatedId(),
                userIds.stream()
                        .filter(id -> id != request.getCreatedId())
                        .toList()
        );

        try {
            var modelEvent = new EventModel(JsonUtils.marshal(project));
            this.applicationEventPublisher.publishEvent(modelEvent);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        return project.getId();
    }

    public void setUserIds(List<Integer> userIds, ProjectRequest request, List<Integer> ids) {
        if (CollectionUtils.isEmpty(request.getUserIds())) {
            return;
        }

        var allUserIds = Stream.concat(
                userIds.stream(),
                Optional.of(request.getCreatedId()).stream()
        ).toList();

        var userMap = jpaUserRepositoryInterface.findByIdIn(allUserIds).stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        String userNotFound = allUserIds.stream()
                .filter(id -> !userMap.containsKey(id))
                .map(String::valueOf)
                .collect(Collectors.joining(", "));
        if (StringUtils.isNotEmpty(userNotFound)) {
            throw new ConstrainViolationException("users", "users not found with id = " + userNotFound);
        }

        ids.addAll(userMap.values().stream().map(User::getId).toList());
    }


    private Project buildGeneralInfo(Project project, ProjectRequest request) {
        Project.ProjectBuilder projectBuilder;
        if (project == null) projectBuilder = Project.builder();
        else projectBuilder = project.toBuilder();

        projectBuilder
                .title(request.getTitle())
                .description(request.getDescription())
                .companyId(request.getCompanyId())
                .status(Optional.ofNullable(request.getStatus()).orElse(Project.Status.to_do))
                .createdId(request.getCreatedId())
                .startedOn(request.getStartedOn());

        return projectBuilder.build();
    }

    @Transactional
    public int update(int projectId, ProjectRequest request) {
        var projectOptional = this.projectRepository.findById(projectId);
        if (projectOptional.isEmpty()) {
            throw new ConstrainViolationException("project", "project not found with id = " + projectId);
        }

        var project = this.buildGeneralInfo(projectOptional.get(), request);

        project = project.toBuilder()
                .modifiedOn(Instant.now())
                .build();

        this.projectRepository.save(project);

        List<Integer> userIds = new ArrayList<>();
        this.setUserIds(request.getUserIds(), request, userIds);

        var userIdsValid = this.splitOldAndNewUserId(project, userIds);

        var event = new ProjectCreatedEvent(projectId, new UserInProjectInfo(userIdsValid.getKey(), userIdsValid.getValue()), project);
        this.projectManagementService.handleProjectCreated(event);

        this.applicationEventPublisher.publishEvent(new UpdateProjectEvent(projectId, userIdsValid.getRight()));

        return projectId;
    }

    public record UpdateProjectEvent(
            int projectId,
            List<Integer> addedUserIds
    ) {

    }

    private Pair<List<Integer>, List<Integer>> splitOldAndNewUserId(Project project, List<Integer> userIdsRequest) {
        var projectManagements = projectManagementRepository.findByProjectId(project.getId());
        if (CollectionUtils.isEmpty(projectManagements)) {
            return Pair.of(List.of(), userIdsRequest);
        }

        var oldUserIds = projectManagements.stream()
                .map(ProjectManagement::getUserId)
                .toList();

        List<Integer> deleted = oldUserIds.stream()
                .filter(id -> !userIdsRequest.contains(id))
                .toList();
        List<Integer> added = userIdsRequest.stream()
                .filter(id -> !oldUserIds.contains(id))
                .toList();

        return Pair.of(deleted, added);
    }

    // endregion write

    // region read
    public ProjectResponse getById(int projectId) {
        var project = this.projectRepository.findById(projectId)
                .orElseThrow(() -> new ConstrainViolationException("project", "project not found with id = " + projectId));

        var taskManagementInfos = this.projectManagementService.getTaskInfo(List.of(projectId));
        if (taskManagementInfos.isEmpty()) {
            return this.projectMapper.toResponse(project);
        }

        var taskManagementInfo = taskManagementInfos.get(0);
        return this.projectMapper.toResponse(project, taskManagementInfo.users(), taskManagementInfo.tasks());
    }

    @Transactional
    public void deleteProject(int projectId) {
        var project = this.projectRepository.findById(projectId)
                .orElseThrow(() -> new ConstrainViolationException("project", "project not found with id = " + projectId));

        this.projectManagementService.deleteProject(project.getId());

        this.projectRepository.delete(project);
    }

    @Transactional
    public void changeStatus(ProjectRequest.ChangeStatusRequest request) {
        var project = this.projectRepository.findById(request.getProjectId())
                .orElseThrow(() ->
                        new ConstrainViolationException(
                                "Project",
                                "Không tìm thấy dự án"
                        ));

        project.updateStatus(request.getStatus());
    }

    // region read
}
