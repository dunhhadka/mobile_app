package org.example.management.management.application.model.leaves;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.management.management.domain.leaves.Leave;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeaveResponse {
    private int id;

    private Leave.Category category;

    private BigDecimal totalLeave;

    private Instant startLeave;

    private Instant endLeave;

    private Integer currentTaskId;

    private String taskName;

    private String contactPhone;

    private String description;

    private Instant createdOn;

    private Instant modifiedOn;

    private Instant approvedAt;

    private Instant rejectedAt;

    private Integer approveId;

    private Integer rejectId;

    private Integer delegateId; //NOTE: người được giao lại task

}
