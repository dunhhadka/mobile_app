package org.example.management.management.application.model.leaves;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import org.example.management.management.domain.leaves.Leave;

import java.time.Instant;

@Getter
@Setter
public class LeaveRequest {
    @NotNull
    private Leave.Category category;
    private Instant startLeave;
    private Instant endLeave;
    @Positive
    private Integer delegateId;

    @NotNull
    private String contactPhone;

    private String description;

    private Integer currentTaskId;
}
