package org.example.management.management.interfaces.rest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.management.management.application.model.dailyreport.DailyReportRequest;
import org.example.management.management.application.model.dailyreport.DailyReportResponse;
import org.example.management.management.application.service.task.DailyReportService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/daily-reports")
public class DailyReportController {

    private final DailyReportService dailyReportService;

    @PostMapping
    public DailyReportResponse createDailyReport(@RequestBody @Valid DailyReportRequest request) {
        var dailyReportId = this.dailyReportService.create(request);
        return dailyReportService.getByIds(List.of(dailyReportId)).get(0);
    }

    @GetMapping("/task/{taskId}")
    public List<DailyReportResponse> getByTaskId(@PathVariable int taskId) {
        return this.dailyReportService.getByTaskId(taskId);
    }
}
