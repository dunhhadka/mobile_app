package org.example.management.management.domain.attendace;

import jakarta.persistence.*;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Entity
@Table(name = "attendances")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private LocalDate date;

    private LocalTime clockIn;

    private LocalTime clockOut;

    private LocalTime actualClockIn;

    private LocalTime actualClockOut;

    private LocalTime totalHours;

    private String note;

    public Attendance(
            LocalDate date,
            LocalTime clockIn,
            LocalTime clockOut,
            LocalTime actualClockIn,
            LocalTime actualClockOut,
            LocalTime totalHours,
            String note
    ) {
        this.date = date;
        this.clockIn = clockIn;
        this.clockOut = clockOut;
        this.actualClockIn = actualClockIn;
        this.actualClockOut = actualClockOut;
        this.totalHours = totalHours;
        this.note = note;
    }
}
