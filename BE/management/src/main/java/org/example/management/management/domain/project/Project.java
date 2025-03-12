package org.example.management.management.domain.project;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private Integer companyId;

    @Size(max = 255)
    private String title;

    @Size(max = 500)
    private String description;

    @NotNull
    @CreationTimestamp
    private Instant createdOn;

    @NotNull
    private Instant startedOn;

    private Instant modifiedOn;

    @NotNull
    @Enumerated(value = EnumType.STRING)
    private Status status;

    public enum Status {
        in_process,
        done,
        reject,
        none
    }
}
