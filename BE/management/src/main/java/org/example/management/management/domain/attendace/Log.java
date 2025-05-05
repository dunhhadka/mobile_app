package org.example.management.management.domain.attendace;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "logs")
@NoArgsConstructor
public class Log {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private Instant checkIn;

    @NotNull
    @Enumerated(value = EnumType.STRING)
    private Type type;

    private Integer logImageId;

    private String note;

    private String latitude;
    private String longitude;

    private int userId;

    @ManyToOne
    @JoinColumn(name = "attendance_id")
    private Attendance attendance;

    public Log(
            Instant checkIn,
            Type type,
            Integer logImageId,
            String note,
            String latitude,
            String longitude,
            int userId
    ) {
        this.checkIn = checkIn;
        this.type = type;
        this.logImageId = logImageId;
        this.note = note;
        this.latitude = latitude;
        this.longitude = longitude;
        this.userId = userId;
    }

    public enum Type {
        in, out, break_work, back_work
    }
}
