package org.example.management.management.domain.task;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Builder(toBuilder = true)
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class  TaskTimeInfo {
    @NotNull
    private LocalDate startDate;

    private LocalDate actualStartDate;

    @NotNull
    private LocalDate dueDate;

    private LocalDate completedAt;

    private BigDecimal estimatedTime;

    private BigDecimal actualTime;
}
