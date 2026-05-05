package com.taskmanager.team_task_manager.dto.auth;

import com.taskmanager.team_task_manager.model.Role;

public record AuthResponse(
        Long id,
        String name,
        String email,
        Role role,
        String message
) {
}
