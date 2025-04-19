package org.example.management.management.application.model.dailyreport;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.example.management.management.application.model.user.response.UserResponse;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Builder
public class DailyReportResponse {
    private int id;
    private String note;
    private BigDecimal progress;

    private Instant createdAt;

    private Instant updatedAt;

    private UserResponse reporter;

    private LocalDate date;
}
