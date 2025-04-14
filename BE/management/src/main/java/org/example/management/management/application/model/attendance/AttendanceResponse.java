package org.example.management.management.application.model.attendance;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class AttendanceResponse {
    private int id;

    private LocalDate date;

    private LocalTime clockIn;

    private LocalTime clockOut;

    private LocalTime actualClockIn;

    private LocalTime actualClockOut;

    private LocalTime totalHours;

    private String note;
}
