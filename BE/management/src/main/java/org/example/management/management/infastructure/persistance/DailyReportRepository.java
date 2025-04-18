package org.example.management.management.infastructure.persistance;

import org.example.management.management.domain.task.DailyReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DailyReportRepository extends JpaRepository<DailyReport, Integer> {
}
