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
import org.hibernate.annotations.CreationTimestamp;

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

    public void addEvents(int createdId, List<Integer> memberIds) {
        var projectCreatedEvent = new ProjectCreatedEvent(Instant.now(), this.id, createdId, memberIds);
        this.addDomainEvent(projectCreatedEvent);
    }

    public enum Status {
        in_process,
        done,
        reject,
        none
    }
}
