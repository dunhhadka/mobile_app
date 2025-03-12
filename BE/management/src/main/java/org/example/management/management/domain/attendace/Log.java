package org.example.management.management.domain.attendace;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.Instant;

@Getter
@Entity
@Table(name = "logs")
public class Log {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private Instant checkIn;

    @NotNull
    @Enumerated(value = EnumType.STRING)
    private Type type;

    private Integer attendanceId;

    private String logImage;

    public enum Type {
        in, out, break_work, back_work
    }
}
