package com.taskmanager.team_task_manager.controller;

import com.taskmanager.team_task_manager.dto.task.AssignTaskRequest;
import com.taskmanager.team_task_manager.dto.task.CreateTaskRequest;
import com.taskmanager.team_task_manager.dto.task.TaskResponse;
import com.taskmanager.team_task_manager.dto.task.UpdateTaskStatusRequest;
import com.taskmanager.team_task_manager.service.TaskManagementService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskManagementController {

    private final TaskManagementService taskManagementService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody CreateTaskRequest request) {
        TaskResponse response = taskManagementService.createTask(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<TaskResponse> getTasks(Principal principal) {
        return taskManagementService.getTasks(principal.getName());
    }

    @PatchMapping("/{taskId}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public TaskResponse assignTask(
            @PathVariable Long taskId,
            @Valid @RequestBody AssignTaskRequest request) {
        return taskManagementService.assignTask(taskId, request);
    }

    @PatchMapping("/{taskId}/status")
    public TaskResponse updateStatus(
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskStatusRequest request,
            Principal principal) {
        return taskManagementService.updateStatus(taskId, request, principal.getName());
    }
}
