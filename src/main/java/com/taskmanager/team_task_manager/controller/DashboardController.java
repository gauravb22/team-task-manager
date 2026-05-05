package com.taskmanager.team_task_manager.controller;

import com.taskmanager.team_task_manager.dto.dashboard.DashboardResponse;
import com.taskmanager.team_task_manager.service.DashboardService;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardResponse getDashboard(Principal principal) {
        return dashboardService.getDashboard(principal.getName());
    }
}
