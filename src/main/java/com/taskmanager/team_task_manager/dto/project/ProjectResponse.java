package com.taskmanager.team_task_manager.dto.project;

import java.time.LocalDateTime;

public record ProjectResponse(
        Long id,
        String name,
        String description,
        String createdBy,
        int taskCount,
        LocalDateTime createdAt
) {
}
