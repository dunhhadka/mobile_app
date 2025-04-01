package org.example.management.management.infastructure.persistance;

import org.example.management.management.domain.task.ProjectManagement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface ProjectManagementRepository extends JpaRepository<ProjectManagement, Integer> {

    List<ProjectManagement> findByProjectIdAndUserIdIn(int projectId, Set<Integer> userIds);

    List<ProjectManagement> findByProjectId(int projectId);

    List<ProjectManagement> findByProjectIdIn(List<Integer> projectIds);
}
