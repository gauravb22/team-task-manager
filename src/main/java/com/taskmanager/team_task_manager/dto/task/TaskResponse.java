package com.taskmanager.team_task_manager.dto.task;

import com.taskmanager.team_task_manager.model.TaskPriority;
import com.taskmanager.team_task_manager.model.TaskStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TaskResponse(
        Long id,
        String title,
        String description,
        TaskStatus status,
        TaskPriority priority,
        LocalDate dueDate,
        boolean overdue,
        Long projectId,
        String projectName,
        Long assignedToId,
        String assignedToName,
        LocalDateTime createdAt
) {
}
