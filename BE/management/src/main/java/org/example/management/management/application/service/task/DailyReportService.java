package org.example.management.management.application.service.task;

import lombok.RequiredArgsConstructor;
import org.apache.commons.collections4.CollectionUtils;
import org.example.management.management.application.model.dailyreport.DailyReportRequest;
import org.example.management.management.application.model.dailyreport.DailyReportResponse;
import org.example.management.management.application.model.user.response.UserResponse;
import org.example.management.management.application.service.user.UserService;
import org.example.management.management.domain.task.DailyReport;
import org.example.management.management.infastructure.exception.ConstrainViolationException;
import org.example.management.management.infastructure.persistance.DailyReportRepository;
import org.example.management.management.infastructure.persistance.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DailyReportService {

    private final TaskRepository taskRepository;
    private final UserService userService;
    private final DailyReportRepository dailyReportRepository;

    public DailyReportResponse getById(int id) {
        var dailyReport = this.dailyReportRepository.findById(id)
                .orElseThrow(() ->
                        new ConstrainViolationException(
                                "Daily Report",
                                "Daily Report not found"
                        ));
        var user = this.userService.findById(dailyReport.getReporterId());
        return this.toResponse(dailyReport, user);
    }

    public void test() {
        var task = taskRepository.findById(1)
                .orElseThrow(() ->
                        new ConstrainViolationException(
                                "Task",
                                "Task not found"
                        ));
        var reporter = userService.findById(1);
    }

    @Transactional
    public int create(DailyReportRequest request) {
        var task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() ->
                        new ConstrainViolationException(
                                "Task",
                                "Task not found"
                        ));
        var reporter = userService.findById(request.getReporterId());

        if (request.getProgress().compareTo(BigDecimal.ZERO) < 0
                || request.getProgress().compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new ConstrainViolationException(
                    "report",
                    "Tiến độ công việc phải trong khoảng 0-100"
            );
        }

        /// /

        var dailyReport = DailyReport.builder()
                .note(request.getNote())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .progress(request.getProgress())
                .reporterId(reporter.getId())
                .date(LocalDate.now())
                .build();

        task.addDailyReport(dailyReport);

        dailyReportRepository.save(dailyReport);
        taskRepository.save(task);

        return dailyReport.getId();
    }


    public List<DailyReportResponse> getByIds(List<Integer> dailyReportIds) {
        var dailyReports = this.dailyReportRepository.findByIdIn(dailyReportIds)
                .stream()
                .sorted(Comparator.comparingInt(DailyReport::getId).reversed())
                .toList();

        if (CollectionUtils.isEmpty(dailyReports)) return List.of();

        var userIds = dailyReports.stream()
                .map(DailyReport::getReporterId)
                .distinct()
                .toList();
        var userMap = this.userService.getByIds(userIds)
                .stream().collect(Collectors.toMap(UserResponse::getId, Function.identity()));

        return dailyReports.stream()
                .map(daily -> toResponse(daily, userMap.get(daily.getReporterId())))
                .toList();
    }

    private DailyReportResponse toResponse(DailyReport daily, UserResponse userResponse) {
        return DailyReportResponse.builder()
                .id(daily.getId())
                .note(daily.getNote())
                .progress(daily.getProgress())
                .createdAt(daily.getCreatedAt())
                .updatedAt(daily.getUpdatedAt())
                .reporter(userResponse)
                .date(daily.getDate())
                .build();
    }

    public List<DailyReportResponse> getByTaskId(int taskId) {
        var dailyReports = this.dailyReportRepository.findByTaskId(taskId);
        var dailyReportsIds = dailyReports.stream()
                .map(DailyReport::getId)
                .distinct()
                .toList();
        return this.getByIds(dailyReportsIds);
    }
}
