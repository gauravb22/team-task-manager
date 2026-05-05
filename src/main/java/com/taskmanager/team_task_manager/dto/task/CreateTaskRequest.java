package com.taskmanager.team_task_manager.dto.task;

import com.taskmanager.team_task_manager.model.TaskPriority;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record CreateTaskRequest(
        @NotNull(message = "Project id is required")
        Long projectId,

        @NotBlank(message = "Task title is required")
        @Size(max = 150, message = "Task title should be under 150 characters")
        String title,

        @Size(max = 700, message = "Description should be under 700 characters")
        String description,

        Long assignedToId,

        @Email(message = "Enter a valid member email")
        String assignedToEmail,

        LocalDate dueDate,

        TaskPriority priority
) {
}
