package org.example.management.management.application.model.project;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.example.management.management.domain.project.Project;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class ProjectRequest {

    private Integer id;

    private Integer companyId;

    @Size(max = 255)
    private String title;

    @Size(max = 500)
    private String description;

    private Project.Status status;

    private List<Integer> userIds;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDate startedOn;

    private int createdId;
}
