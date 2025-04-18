package org.example.management.management.domain.leaves;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.example.management.management.domain.task.Task;
import org.example.management.management.infastructure.exception.ConstrainViolationException;

import java.math.BigDecimal;
import java.time.Instant;
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

    @OneToOne
    @MapsId
    @JoinColumn(name = "currentTaskId")
    private Task task;


    @NotNull
    @Enumerated(value = EnumType.STRING)
    private Status status;

    protected Leave() {
    }


    public void setTaskWithCurrentTaskId(Task task) {
        Objects.requireNonNull(task);
        this.task = task;
    }

    public Leave(Category category,
                 Instant startLeave,
                 Instant endLeave,
                 Integer delegateId,
                 String contactPhone,
                 String description,
                 Integer currentTaskId
    ) {
        this.category = category;
        this.startLeave = startLeave;
        this.endLeave = endLeave;
        this.delegateId = delegateId;
        this.contactPhone = contactPhone;
        this.description = description;
        this.status = Status.review;
        this.createdOn = Instant.now();
    }

    public void approve(Integer approveId, Instant approvedAt) {
        if (this.status != Status.review) {
            throw new ConstrainViolationException(this.status.toString(),
                    "Cannot approve a leave that is not in review status");
        }
        this.status = Status.approved;
        this.approveId = approveId;
        this.approvedAt = approvedAt;
        this.modifiedOn = Instant.now();
        // TODO: Bổ sung event để gửi thông báo
    }

    public void reject(Integer rejectId, Instant rejectedAt) {
        if (this.status != Status.review) {
            throw new ConstrainViolationException(this.status.toString(),
                    "Cannot reject a leave that is not in review status");
        }
        this.status = Status.rejected;
        this.rejectId = rejectId;
        this.rejectedAt = rejectedAt;
        this.modifiedOn = Instant.now();
        // TODO: Bổ sung event để gửi thông báo
    }

    //NOTE: Cập nhật thông tin nghỉ phép
    public void update(Category category,
                       Instant startLeave,
                       Instant endLeave,
                       Integer delegateId,
                       String contactPhone,
                       String description
    ) {
        if (this.status != Status.review) {
            throw new ConstrainViolationException(this.status.toString(),
                    "Cannot update field leave that is not in review status");
        }
        this.internalSetCategory(category);
        this.internalSetDates(startLeave, endLeave);
        this.internalSetContactPhone(contactPhone);
        this.description = description;
        this.internalSetDelegateId(delegateId);
        this.modifiedOn = Instant.now();
    }

    public void updateTask(Integer currentTaskId,
                           String taskName,
                           Integer delegateId
    ) {
        //
        if (!Objects.equals(this.taskName, taskName)) {
            this.internalSetTaskName(taskName);
        }
        if (!Objects.equals(this.delegateId, delegateId)) {
            this.internalSetDelegateId(delegateId);
        }
        this.modifiedOn = Instant.now();

    }

    private void internalSetCategory(Category category) {
        if (Objects.equals(this.category, category)) {
            return;
        }
        this.category = category;
    }

    private void internalSetDelegateId(Integer delegateId) {
        this.delegateId = delegateId;
        //TODO: Gửi thông báo đến người được giao lại task
    }

    private void internalSetDates(Instant startLeave, Instant endLeave) {
        if (!Objects.equals(this.startLeave, startLeave) || !Objects.equals(this.endLeave, endLeave)) {
            this.startLeave = startLeave;
            this.endLeave = endLeave;
            this.calculateTotalLeave();
        }
    }

    private void calculateTotalLeave() {
        if (startLeave == null || endLeave == null) {
            throw new ConstrainViolationException(null, "startLeave and endLeave must not be null");
        }
        if (endLeave.isBefore(startLeave)) {
            throw new ConstrainViolationException("startLeave" + startLeave + ",endLeave" + endLeave, "endLeave must be after startLeave");
        }
        long days = ChronoUnit.DAYS.between(startLeave.atZone(ZoneId.systemDefault()).toLocalDate(),
                endLeave.atZone(ZoneId.systemDefault()).toLocalDate()
        ) + 1;
        this.totalLeave = new BigDecimal(days);
    }

    private void updateDates(Instant startLeave, Instant endLeave) {
        if (!Objects.equals(this.startLeave, startLeave) || !Objects.equals(this.endLeave, endLeave)) {
            if (endLeave.isBefore(startLeave)) {
                throw new ConstrainViolationException("dates", "endLeave must be after startLeave");
            }
            this.startLeave = startLeave;
            this.endLeave = endLeave;
            calculateTotalLeave();
        }
    }

    private void internalSetContactPhone(String contactPhone) {
        if (Objects.equals(this.contactPhone, contactPhone)) {
            return;
        }
        this.contactPhone = contactPhone;
    }


    private void internalSetTaskName(String taskName) {
        this.taskName = taskName;

    }

    public enum Status {
        review,
        approved,
        rejected
    }

    public enum Category {
        sick,
        personal, //TODO: Thêm
        vacation,
        bereavement,
    }
}
