package org.example.management.management.domain.task;

import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.commons.collections4.CollectionUtils;
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
    @OneToMany(mappedBy = "aggRoot", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<Task> managements;

    public ProjectManagement(int projectId, Integer userId) {
        this.projectId = projectId;
        this.userId = userId;
    }

    public void addTasks(List<Task> tasks) {
        if (this.managements == null) this.managements = new ArrayList<>();

        tasks.forEach(m -> m.setAggRoot(this));

        this.managements.addAll(tasks);
    }

    public void deleteTask(int taskId) {
        if (CollectionUtils.isEmpty(this.managements)) return;

        var task = this.managements.stream()
                .filter(taskManagement -> taskManagement.getId() == taskId)
                .findFirst()
                .orElseThrow(null);
        if (task == null) {
            return;
        }

        task.setAggRoot(null);
        this.managements.remove(task);
    }

    public List<Integer> deleteAllTask() {
        if (CollectionUtils.isEmpty(this.managements)) {
            return List.of();
        }
        this.managements.forEach(task -> task.setAggRoot(null));
        var taskIds = this.managements.stream()
                .map(Task::getId)
                .toList();
        this.managements.clear();
        return taskIds;
    }
}
