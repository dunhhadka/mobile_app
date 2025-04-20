package org.example.management.management.domain.leaves;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.example.management.management.domain.task.Task;
import org.example.management.management.infastructure.exception.ConstrainViolationException;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Objects;

@Getter
@Entity
@Table(name = "leaves")
@Setter
public class Leave {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String category;

    @NotNull
    private BigDecimal totalLeave;

    @NotNull
    private LocalDate startLeave;

    @NotNull
    private LocalDate endLeave;


    private String contactPhone;

    private String description;

    private Instant createdOn;

    private Instant modifiedOn;

    private Instant decidedAt;

    private Integer createdBy;

    private Integer decidedBy;


    private Integer currentTaskId;

    @NotNull
    @Enumerated(value = EnumType.STRING)
    private Status status;

    protected Leave() {
    }

    public Leave(String category,
                 LocalDate startLeave,
                 LocalDate endLeave,
                 String contactPhone,
                 String description,
                 Integer createdBy,
                 Integer currentTaskId
    ) {
        this.category = category;
        this.startLeave = startLeave;
        this.endLeave = endLeave;
        this.contactPhone = contactPhone;
        this.description = description;
        this.status = Status.review;
        this.createdBy = createdBy;
        this.createdOn = Instant.now();
        this.calculateTotalLeave();
        this.currentTaskId = currentTaskId;
    }

    public void updateLeaveStatus(Integer userId, Status status) {
        if(this.status != Status.review) {
            return;
        }
        this.status = status;
        this.decidedAt = Instant.now();
        this.decidedBy = userId;
        this.modifiedOn = Instant.now();
        // Gửi thông báo
    }

    public void approve(Integer userId, Instant now) {
        this.status = Status.approved;
        this.decidedBy = userId;
        this.decidedAt = Instant.now();
        this.modifiedOn = Instant.now();
        // TODO: Gửi thông báo phê duyệt và người được giao lại task
    }

    public void reject(Integer userId, Instant now) {
        this.status = Status.rejected;
        this.decidedBy = userId;
        this.decidedAt = now;
        this.modifiedOn = Instant.now();
        // TODO: Gửi thông báo bị từ chối
    }


    private void internalSetDates(LocalDate startLeave, LocalDate endLeave) {
        if (!Objects.equals(this.startLeave, startLeave) || !Objects.equals(this.endLeave, endLeave)) {
            this.startLeave = startLeave;
            this.endLeave = endLeave;
            this.calculateTotalLeave();
        }
    }

    private void calculateTotalLeave() {
        if (this.startLeave == null || this.endLeave == null) {
            throw new ConstrainViolationException(null, "startLeave and endLeave must not be null");
        }
        if (this.endLeave.isBefore(this.startLeave)) {
            throw new ConstrainViolationException("startLeave=" + startLeave + ", endLeave=" + endLeave,
                    "endLeave must be after startLeave");
        }
        long days = ChronoUnit.DAYS.between(startLeave, endLeave) + 1;
        this.totalLeave = BigDecimal.valueOf(days);
    }

    private void internalSetContactPhone(String contactPhone) {
        if (!Objects.equals(this.contactPhone, contactPhone)) {
            this.contactPhone = contactPhone;
        }
    }

    public enum Status {
        review,
        approved,
        rejected
    }
}
