package org.example.management.management.domain.project;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.management.ddd.AggregateRoot;
import org.example.management.management.jobs.ProjectHandleEventService;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Getter
@Builder(toBuilder = true)
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "projects")
public class Project extends AggregateRoot<Project> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private Integer companyId;

    @NotBlank
    @Size(max = 255)
    private String title;

    @Size(max = 500)
    private String description;

    @NotNull
    @CreationTimestamp
    private Instant createdOn;

    @NotNull
    private LocalDate startedOn;

    private Instant modifiedOn;

    @NotNull
    @Enumerated(value = EnumType.STRING)
    private Status status;

    private int createdId;

    private int totalToDo;
    private int totalInProgress;
    private int totalFinish;
    private int totalTask;

    private BigDecimal progress;

    public void addEvents(int createdId, List<Integer> memberIds) {
        var projectCreatedEvent = new ProjectCreatedEvent(Instant.now(), this.id, createdId, memberIds);
        this.addDomainEvent(projectCreatedEvent);
    }

    public void update(ProjectHandleEventService.UpdateProjectModal updateModal) {
        this.totalToDo = updateModal.getTotalToDo();
        this.totalInProgress = updateModal.getTotalInProgress();
        this.totalFinish = updateModal.getTotalFinish();
        this.totalTask = updateModal.getTotalTask();

        this.progress = updateModal.calculateProgress();
    }

    public void updateStatus(Status status) {
        this.status = status;

        this.modifiedOn = Instant.now();
    }

    public enum Status {
        in_process,
        finish,
        to_do,
    }
}
