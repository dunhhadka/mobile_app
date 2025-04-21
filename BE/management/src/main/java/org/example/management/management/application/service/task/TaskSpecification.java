package org.example.management.management.application.service.task;

import jakarta.persistence.criteria.Root;
import org.example.management.management.domain.project.Project;
import org.example.management.management.domain.task.Task;
import org.example.management.management.domain.task.Task_;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class TaskSpecification {

    public static Specification<Task> hasIdIn(List<Integer> ids) {
        return (root, query, builder) -> root.get(Task_.id).in(ids);
    }

    public static Specification<Task> likeTitle(String title) {
        return ((root, query, builder) -> builder.like(builder.lower(root.get(Task_.title)), "%" + title.toLowerCase() + "%"));
    }

    public static Specification<Task> equalStatus(Task.Status status) {
        return ((root, query, builder) -> builder.equal(root.get(Task_.status), status));
    }

    public static Specification<Task> equalAssignId(int assignId) {
        return ((root, query, builder) -> builder.equal(root.get(Task_.assignId), assignId));
    }

    public static Specification<Task> equalProcessId(int processId) {
        return ((root, query, builder) -> builder.equal(root.get(Task_.processId), processId));
    }

    public static Specification<Task> equalByProjectId(int projectId) {
        return ((root, query, builder) -> builder.equal(root.get(Task_.projectId), projectId));
    }
}
