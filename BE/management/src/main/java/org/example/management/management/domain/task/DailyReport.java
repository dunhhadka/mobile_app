package org.example.management.management.domain.task;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "daily_reports")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyReport {

    @ManyToOne
    @JsonIgnore
    @Setter
    @JoinColumn(name = "taskId", referencedColumnName = "id")
    private Task task;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String note;

    private Instant createdAt;

    private Instant updatedAt;

    @NotNull
    private BigDecimal progress;

    private int reporterId;

    private LocalDate date;
}
