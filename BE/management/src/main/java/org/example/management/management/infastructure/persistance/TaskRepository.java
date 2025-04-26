package org.example.management.management.infastructure.persistance;

import org.example.management.management.domain.task.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Integer>, JpaSpecificationExecutor<Task> {
    List<Task> findByIdIn(List<Integer> taskIds);
    List<Task> findByProcessIdIn(List<Integer> userIds);

    @Query("SELECT t FROM Task t WHERE t.timeInfo.dueDate = :date")
    List<Task> findByDate(@Param("date") LocalDate date);
}
