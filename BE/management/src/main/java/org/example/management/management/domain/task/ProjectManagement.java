package org.example.management.management.domain.task;

import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.commons.collections4.CollectionUtils;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.math.BigDecimal;
import java.math.RoundingMode;
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

    private int totalToDo;
    private int totalInProgress;
    private int totalFinish;

    private BigDecimal progress;

    public void reCalculateProgress() {
        if (CollectionUtils.isEmpty(this.managements)) {
            this.setDefault();
        }

        int totalToDo = 0;
        int totalInProgress = 0;
        int totalFinish = 0;

        BigDecimal totalProgress = BigDecimal.ZERO;

        for (var task : this.managements) {
            if (task.getStatus() == null || task.getStatus() == Task.Status.to_do) totalToDo++;
            else if (task.getStatus() == Task.Status.in_process) totalInProgress++;
            else totalFinish++;

            totalProgress = totalProgress.add(task.getProcessValue() == null ? BigDecimal.ZERO : task.getProcessValue());
        }

        this.totalToDo = totalToDo;
        this.totalInProgress = totalInProgress;
        this.totalFinish = totalFinish;

        this.progress = totalProgress.divide(BigDecimal.valueOf(this.managements.size()), RoundingMode.FLOOR);
    }

    private void setDefault() {
        this.totalToDo = 0;
        this.totalInProgress = 0;
        this.totalFinish = 0;

        this.progress = BigDecimal.ZERO;
    }

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
                .orElse(null);
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
