package org.example.management.management.domain.task;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "project_task_managements")
public class ProjectTasKManagement {

    @JsonIgnore
    @ManyToOne
    @Setter
    @JoinColumn(name = "projectId", referencedColumnName = "projectId")
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    private ProjectManagement aggRoot;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Positive
    private int taskId;

    public ProjectTasKManagement(int taskId) {
        this.taskId = taskId;
    }
}
