package org.example.management.management.application.model.attendance;

import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AggregateLogRequest {
    private LocalDate date;

    @PositiveOrZero
    private int userId;

    private String note;
}
