package org.example.management.management.infastructure.persistance;

import org.example.management.management.domain.task.DailyReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DailyReportRepository extends JpaRepository<DailyReport, Integer> {

    List<DailyReport> findByIdIn(List<Integer> ids);

    @Query("SELECT d FROM DailyReport d WHERE d.task.id = :taskId ORDER BY d.createdAt DESC")
    List<DailyReport> findByTaskId(int taskId);
}
