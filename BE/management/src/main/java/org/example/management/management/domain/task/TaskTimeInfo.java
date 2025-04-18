package org.example.management.management.domain.task;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalTime;

@Getter
@Builder(toBuilder = true)
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class TaskTimeInfo {
    @NotNull
    private LocalTime startDate;

    @NotNull
    private LocalTime dueDate;

    private LocalTime completedAt;

    private BigDecimal estimatedTime;

    private BigDecimal actualTime;
}
