package org.example.management.management.application.service.projects;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.apache.commons.collections4.CollectionUtils;
import org.example.management.management.application.model.project.ProjectResponse;
import org.example.management.management.application.model.project.ProjectSearchRequest;
import org.example.management.management.application.service.projectmanagement.ProjectManagementService;
import org.example.management.management.application.service.task.TaskService;
import org.example.management.management.application.service.user.UserService;
import org.example.management.management.domain.project.Project;
import org.example.management.management.domain.task.ProjectManagement;
import org.example.management.management.infastructure.persistance.ProjectManagementRepository;
import org.example.management.management.infastructure.persistance.ProjectRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectFilterService {

    private final EntityManager entityManager;

    private final ProjectRepository projectRepository;

    private final ProjectMapper projectMapper;

    private final ProjectManagementService projectManagementService;

    //TODO: Phân trang
    public List<ProjectResponse> filter(ProjectSearchRequest request) {

        var specification = buildSpecification(request);

        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "id"));

        var page = this.projectRepository.findAll(specification, pageable);

        return toResponse(page.getContent());
    }

    private List<ProjectResponse> toResponse(List<Project> projects) {
        var projectIds = projects.stream()
                .map(Project::getId)
                .toList();

        var managementTaskInfo = this.projectManagementService.getTaskInfo(projectIds);
        if (CollectionUtils.isEmpty(managementTaskInfo)) {
            return projects.stream()
                    .map(this.projectMapper::toResponse)
                    .toList();
        }

        var projectMap = projects.stream()
                .collect(Collectors.toMap(Project::getId,
                        Function.identity()));

        return managementTaskInfo.stream()
                .map(info -> this.projectMapper.toResponse(projectMap.get(info.projectId()), info.users(), info.tasks()))
                .toList();
    }

    private Specification<Project> buildSpecification(ProjectSearchRequest request) {
        Specification<Project> specification = Specification.where(null);

        if (request.getCompanyId() != null) {
            specification = specification.and(ProjectSpecification.hasCompanyId(request.getCompanyId()));
        }

        if (request.getIds() != null) {
            specification = specification.and(ProjectSpecification.hasIdIn(request.getIds()));
        }

        if (request.getTitle() != null) {
            specification = specification.and(ProjectSpecification.likeTitle(request.getTitle()));
        }

        if (request.getDescription() != null) {
            specification = specification.and(ProjectSpecification.likeDescription(request.getDescription()));
        }

        if (request.getCreatedOnMin() != null) {
            specification = specification.and(ProjectSpecification.hasCreatedOnGreaterThanOrEqualTo(request.getCreatedOnMin()));
        }

        if (request.getCreatedOnMax() != null) {
            specification = specification.and(ProjectSpecification.hasCreatedOnLessThanOrEqualTo(request.getCreatedOnMax()));
        }

        if (request.getStaredOnMin() != null) {
            specification = specification.and(ProjectSpecification.hasStartedOnGreaterThanOrEqualTo(request.getStaredOnMin()));
        }

        if (request.getStartedOnMax() != null) {
            specification = specification.and(ProjectSpecification.hasStartedOnLessThanOrEqualTo(request.getStartedOnMax()));
        }

        if (request.getModifiedOnMin() != null) {
            specification = specification.and(ProjectSpecification.hasModifiedOnGreaterThanOrEqualTo(request.getModifiedOnMin()));
        }

        if (request.getModifiedOnMax() != null) {
            specification = specification.and(ProjectSpecification.hasModifiedOnLessThanOrEqualTo(request.getModifiedOnMax()));
        }

        return specification;
    }
}
