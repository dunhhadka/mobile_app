package org.example.management.management.application.model.leaves;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.management.management.domain.leaves.Leave;
import org.example.management.management.domain.profile.User;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeaveResponse {
    private int id;

    private String category;

    private BigDecimal totalLeave;

    private LocalDate startLeave;

    private LocalDate endLeave;

    private Integer currentTaskId;


    private String contactPhone;

    private String description;

    private Instant createdOn;

    private Instant modifiedOn;

    private Integer createdBy;

    private Integer decidedBy;

    private Leave.Status status;
    //TODO: Làm tiếp
    public static class UserCreatedLeave {
        private Integer id;
        private String username;
        private User.Position position;
    }

}

