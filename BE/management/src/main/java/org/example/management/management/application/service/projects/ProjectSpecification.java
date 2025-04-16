package org.example.management.management.application.service.projects;

import org.example.management.management.domain.project.Project;
import org.example.management.management.domain.project.Project_;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.util.List;

public class ProjectSpecification {
    public static Specification<Project> hasCompanyId(Integer companyId) {
        return (root, query, cb) -> cb.equal(root.get(Project_.ID), companyId);
    }

    public static Specification<Project> hasIdIn(List<Integer> ids) {
        return (root, query, cb) -> root.get(Project_.ID).in(ids);
    }

    public static Specification<Project> likeTitle(String title) {
        return (root, query, cb) -> cb.like(root.get(Project_.TITLE), "%" + title + "%");
    }

    public static Specification<Project> likeDescription(String description) {
        return (root, query, cb) -> cb.like(root.get(Project_.DESCRIPTION), "%" + description + "%");
    }

    public static Specification<Project> hasCreatedOnGreaterThanOrEqualTo(Instant createdOnMin) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get(Project_.CREATED_ON), createdOnMin);
    }

    public static Specification<Project> hasCreatedOnLessThanOrEqualTo(Instant createdOnMax) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get(Project_.CREATED_ON), createdOnMax);
    }

    public static Specification<Project> hasStartedOnGreaterThanOrEqualTo(Instant startedOnMin) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get(Project_.STARTED_ON), startedOnMin);
    }

    public static Specification<Project> hasStartedOnLessThanOrEqualTo(Instant startedOnMax) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get(Project_.STARTED_ON), startedOnMax);
    }

    public static Specification<Project> hasModifiedOnGreaterThanOrEqualTo(Instant modifiedOnMin) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get(Project_.MODIFIED_ON), modifiedOnMin);
    }

    public static Specification<Project> hasModifiedOnLessThanOrEqualTo(Instant modifiedOnMax) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get(Project_.MODIFIED_ON), modifiedOnMax);
    }

    public static Specification<Project> hasStatusIn(List<Project.Status> statuses) {
        return (root, query, cb) -> root.get(Project_.STATUS).in(statuses);
    }

}