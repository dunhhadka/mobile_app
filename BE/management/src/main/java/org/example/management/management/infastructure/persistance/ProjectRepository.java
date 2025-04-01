package org.example.management.management.infastructure.persistance;

import org.example.management.management.domain.project.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Integer> {
}
