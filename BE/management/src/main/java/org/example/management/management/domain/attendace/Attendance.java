package org.example.management.management.domain.attendace;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "attendances")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private Instant clockIn;

    private Instant clockOut;

    private Instant actualClockIn;

    private Instant actualClockOut;

    private BigDecimal totalHours;

    private String note;
}
