package org.example.management.management.domain.attendace;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Entity
@NoArgsConstructor
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

    @OneToMany(mappedBy = "attendance", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    List<Log> logs;
    private int userId;
    public Attendance(
            LocalDate date,
            LocalTime clockIn,
            LocalTime clockOut,
            LocalTime actualClockIn,
            LocalTime actualClockOut,
            LocalTime totalHours,
            String note,
            List<Log> logs,
            int userId
    ) {
        this.date = date;
        this.clockIn = clockIn;
        this.clockOut = clockOut;
        this.actualClockIn = actualClockIn;
        this.actualClockOut = actualClockOut;
        this.totalHours = totalHours;
        this.note = note;
        this.userId = userId;
        this.logs = logs;
    }
}
