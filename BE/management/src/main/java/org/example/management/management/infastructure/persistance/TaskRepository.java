package org.example.management.management.infastructure.persistance;

import org.example.management.management.domain.task.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Integer>, JpaSpecificationExecutor<Task> {
    List<Task> findByIdIn(List<Integer> taskIds);

    List<Task> findByProcessIdIn(List<Integer> userIds);
}
