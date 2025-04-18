package org.example.management.management.domain.task;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "daily_reports")
@Getter
public class DailyReport {

    @Id
    private int id;

    private String content;

    private Instant createdAt;

    private Instant updatedAt;

    @NotNull
    private BigDecimal progress;

    private int reportId;
}
