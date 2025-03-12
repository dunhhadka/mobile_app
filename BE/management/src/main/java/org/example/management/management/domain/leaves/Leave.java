package org.example.management.management.domain.leaves;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Entity
@Table(name = "leaves")
public class Leave {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotNull
    @Enumerated(value = EnumType.STRING)
    private Category category;

    @NotNull
    private BigDecimal totalLeave;

    @NotNull
    private Instant startLeave;

    @NotNull
    private Instant endLeave;

    private Integer currentTaskId;

    private String taskName;

    private String contactPhone;

    private String description;

    private Instant createdOn;

    private Instant modifiedOn;

    private Integer approvedAt;

    private Instant rejectedAt;

    private Integer approveId;

    private Instant rejectId;

    @NotNull
    @Enumerated(value = EnumType.STRING)
    private Status status;

    public enum Status {
        review,
        approved,
        rejected
    }

    public enum Category {
        sick,
        personal //TODO: Thêm
    }
}
