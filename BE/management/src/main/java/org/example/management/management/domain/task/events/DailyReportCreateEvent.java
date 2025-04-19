package org.example.management.management.domain.task.events;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.management.ddd.DomainEvent;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DailyReportCreateEvent implements DomainEvent {

    private int creatorId;
    private int reporterId;
    private BigDecimal process;
    private LocalDate date;

    @Override
    public Instant happenedAt() {
        return null;
    }

    @Override
    public String type() {
        return null;
    }
}
