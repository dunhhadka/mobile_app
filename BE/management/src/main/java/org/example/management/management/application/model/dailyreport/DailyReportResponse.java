package org.example.management.management.application.model.dailyreport;

import lombok.Getter;
import lombok.Setter;
import org.example.management.management.application.model.user.response.UserResponse;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
public class DailyReportResponse {
    private int id;
    private String content;
    private BigDecimal progress;

    private Instant createdAt;

    private Instant updatedAt;

    private UserResponse reporter;
}
