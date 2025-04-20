package org.example.management.management.interfaces.rest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.management.management.application.model.attendance.*;
import org.example.management.management.application.service.attendance.AttendanceService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/attendances")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping("/logs/{userId}")
    public List<LogResponse> getLogs(@PathVariable(name="userId") int userId, @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date){
        return  this.attendanceService.getLogsByDayAndUserId(userId, date);
    }

    @GetMapping("/{userId}")
    public List<AttendanceResponse> getAttendance(@PathVariable int userId){
        return this.attendanceService.getAttendanceByUserId(userId);
    }

    @PostMapping("/logs")
    public LogResponse createLog(@ModelAttribute @Valid LogRequest request) throws IOException {
        var logId = this.attendanceService.createLog(request);
        return this.attendanceService.getLogById(logId);
    }

    @PostMapping("/aggregate")
    public AttendanceResponse aggregateLogs(@RequestBody @Valid AggregateLogRequest request) {
        var attendanceId = this.attendanceService.aggregateFromLogs(request);
        return attendanceService.getAttendanceById(attendanceId);
    }
}