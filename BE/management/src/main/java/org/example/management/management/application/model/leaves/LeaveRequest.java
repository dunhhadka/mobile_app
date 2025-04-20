package org.example.management.management.application.model.leaves;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import org.example.management.management.domain.leaves.Leave;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
public class LeaveRequest {
    @NotBlank
    private String category;
    private LocalDate startLeave;
    private LocalDate endLeave;

    @NotNull
    private String contactPhone;

    private String description;
}
