package org.example.management.management.domain.attendace;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Getter
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
    private int attendanceId;

    public Log(
            Instant checkIn,
            Type type,
            Integer logImageId,
            String note,
            String latitude,
            String longitude,
            int userId,
            Integer attendanceId
    ) {
        this.checkIn = checkIn;
        this.type = type;
        this.logImageId = logImageId;
        this.note = note;
        this.latitude = latitude;
        this.longitude = longitude;
        this.userId = userId;
    }


    public void setAttendance(int attendanceId){
        this.attendanceId = attendanceId;
    }

    public enum Type {
        in, out, break_work, back_work
    }
}
