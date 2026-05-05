package com.taskmanager.team_task_manager.dto.dashboard;

import com.taskmanager.team_task_manager.model.Role;

public record DashboardResponse(
        String userName,
        Role role,
        long totalTasks,
        long completedTasks,
        long pendingTasks,
        long overdueTasks
) {
}
