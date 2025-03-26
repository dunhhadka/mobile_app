package org.example.management.management.interfaces.rest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.management.management.application.model.project.ProjectRequest;
import org.example.management.management.application.model.project.ProjectResponse;
import org.example.management.management.application.model.project.ProjectSearchRequest;
import org.example.management.management.application.service.projects.ProjectFilterService;
import org.example.management.management.application.service.projects.ProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final ProjectFilterService projectFilterService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse create(@Valid @RequestBody ProjectRequest request) {
        int projectId = this.projectService.create(request);
        return projectService.getById(projectId);
    }

    @PutMapping("/{projectId}")
    public ProjectResponse updateProject(@Valid @RequestBody ProjectRequest request, @PathVariable int projectId) {
        this.projectService.update(projectId, request);
        return projectService.getById(projectId);
    }

    @GetMapping("/{projectId}")
    public ProjectResponse getById(@PathVariable int projectId) {
        return this.projectService.getById(projectId);
    }

    @GetMapping("/search")
    public List<ProjectResponse> search(ProjectSearchRequest request) {
        return this.projectFilterService.filter(request);
    }

    @DeleteMapping("/{projectId}")
    public void deleteProject(@PathVariable int projectId) {
        this.projectService.deleteProject(projectId);
    }
}
