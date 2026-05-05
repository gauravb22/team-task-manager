package com.taskmanager.team_task_manager.service;

import com.taskmanager.team_task_manager.dto.project.CreateProjectRequest;
import com.taskmanager.team_task_manager.dto.project.ProjectResponse;
import com.taskmanager.team_task_manager.model.ProjectWorkspace;
import com.taskmanager.team_task_manager.model.UserAccount;
import com.taskmanager.team_task_manager.repository.ProjectWorkspaceRepository;
import com.taskmanager.team_task_manager.repository.UserAccountRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProjectWorkspaceService {

    private final ProjectWorkspaceRepository projectWorkspaceRepository;
    private final UserAccountRepository userAccountRepository;

    @Transactional
    public ProjectResponse createProject(CreateProjectRequest request, String adminEmail) {
        UserAccount admin = userAccountRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new EntityNotFoundException("Admin user not found"));

        ProjectWorkspace project = new ProjectWorkspace();
        project.setName(request.name().trim());
        project.setDescription(cleanDescription(request.description()));
        project.setCreatedBy(admin);

        return toResponse(projectWorkspaceRepository.save(project));
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjects() {
        return projectWorkspaceRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private ProjectResponse toResponse(ProjectWorkspace project) {
        String createdByName = project.getCreatedBy() == null ? "Not assigned" : project.getCreatedBy().getName();
        int taskCount = project.getTasks() == null ? 0 : project.getTasks().size();
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                createdByName,
                taskCount,
                project.getCreatedAt());
    }

    private String cleanDescription(String description) {
        if (description == null || description.isBlank()) {
            return null;
        }
        return description.trim();
    }
}
