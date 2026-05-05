package com.taskmanager.team_task_manager.dto.task;

import jakarta.validation.constraints.Email;

public record AssignTaskRequest(
        Long assignedToId,

        @Email(message = "Enter a valid member email")
        String assignedToEmail
) {
}
