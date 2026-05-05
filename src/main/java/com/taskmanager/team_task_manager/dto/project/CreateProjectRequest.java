package com.taskmanager.team_task_manager.dto.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateProjectRequest(
        @NotBlank(message = "Project name is required")
        @Size(max = 120, message = "Project name should be under 120 characters")
        String name,

        @Size(max = 500, message = "Description should be under 500 characters")
        String description
) {
}
