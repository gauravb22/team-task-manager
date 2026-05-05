package com.taskmanager.team_task_manager.dto.task;

import com.taskmanager.team_task_manager.model.TaskStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateTaskStatusRequest(
        @NotNull(message = "Task status is required")
        TaskStatus status
) {
}
