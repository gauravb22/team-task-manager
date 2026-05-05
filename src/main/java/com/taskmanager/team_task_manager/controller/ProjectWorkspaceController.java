package com.taskmanager.team_task_manager.controller;

import com.taskmanager.team_task_manager.dto.project.CreateProjectRequest;
import com.taskmanager.team_task_manager.dto.project.ProjectResponse;
import com.taskmanager.team_task_manager.service.ProjectWorkspaceService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectWorkspaceController {

    private final ProjectWorkspaceService projectWorkspaceService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody CreateProjectRequest request,
            Principal principal) {
        ProjectResponse response = projectWorkspaceService.createProject(request, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<ProjectResponse> getProjects() {
        return projectWorkspaceService.getProjects();
    }
}
