package org.example.management.management.application.model.dailyreport;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class DailyReportRequest {
    @NotBlank
    private String content;

    @NotNull
    private BigDecimal progress;

    private int taskId;

    private int reporterId;
}
