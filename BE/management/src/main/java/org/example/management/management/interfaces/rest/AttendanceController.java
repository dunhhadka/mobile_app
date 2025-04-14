package org.example.management.management.interfaces.rest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.management.management.application.model.attendance.AggregateLogRequest;
import org.example.management.management.application.model.attendance.AttendanceResponse;
import org.example.management.management.application.model.attendance.LogRequest;
import org.example.management.management.application.model.attendance.LogResponse;
import org.example.management.management.application.service.attendance.AttendanceService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/attendances")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/logs")
    public LogResponse createLog(@RequestBody @Valid LogRequest request) throws IOException {
        var logId = this.attendanceService.createLog(request);
        return this.attendanceService.getLogById(logId);
    }

    @PostMapping("/aggregate")
    public AttendanceResponse aggregateLogs(@RequestBody @Valid AggregateLogRequest request) {
        var attendanceId = this.attendanceService.aggregateFromLogs(request);
        return attendanceService.getAttendanceById(attendanceId);
    }
}