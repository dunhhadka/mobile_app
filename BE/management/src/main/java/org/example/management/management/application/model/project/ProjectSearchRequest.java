package org.example.management.management.application.model.project;

import lombok.Getter;
import lombok.Setter;
import org.example.management.management.domain.project.Project;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class ProjectSearchRequest {
    private List<Integer> ids;

    private Integer companyId;

    private String title;
    private String description;

    private Instant createdOnMin;
    private Instant createdOnMax;

    private Instant staredOnMin;
    private Instant startedOnMax;

    private Instant modifiedOnMin;
    private Instant modifiedOnMax;

    private List<Project.Status> statuses;
}
