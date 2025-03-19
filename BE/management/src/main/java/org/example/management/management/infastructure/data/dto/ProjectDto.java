package org.example.management.management.infastructure.data.dto;

import lombok.Getter;
import lombok.Setter;
import org.example.management.management.domain.project.Project;

import java.time.Instant;

@Getter
@Setter
public class ProjectDto {
    private int id;

    private Integer companyId;

    private String title;
    private String description;

    private Instant createdOn;
    private Instant startedOn;
    private Instant modifiedOn;

    private Project.Status status;
}
