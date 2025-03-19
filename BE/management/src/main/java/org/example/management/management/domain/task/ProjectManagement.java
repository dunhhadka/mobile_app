package org.example.management.management.domain.task;

import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
public class ProjectManagement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Positive
    private int projectId;

    @Positive
    private int userId;

    @Fetch(FetchMode.SUBSELECT)
    @OneToMany(mappedBy = "aggRoot", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectTasKManagement> managements;

    public ProjectManagement(int projectId, Integer userId) {
        this.projectId = projectId;
        this.userId = userId;
    }

    public void addManagements(List<ProjectTasKManagement> managements) {
        if (this.managements == null) this.managements = new ArrayList<>();

        managements.forEach(m -> m.setAggRoot(this));

        this.managements.addAll(managements);
    }
}
