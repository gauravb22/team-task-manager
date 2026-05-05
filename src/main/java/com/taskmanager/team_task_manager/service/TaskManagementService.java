package com.taskmanager.team_task_manager.service;

import com.taskmanager.team_task_manager.dto.task.AssignTaskRequest;
import com.taskmanager.team_task_manager.dto.task.CreateTaskRequest;
import com.taskmanager.team_task_manager.dto.task.TaskResponse;
import com.taskmanager.team_task_manager.dto.task.UpdateTaskStatusRequest;
import com.taskmanager.team_task_manager.model.ProjectWorkspace;
import com.taskmanager.team_task_manager.model.Role;
import com.taskmanager.team_task_manager.model.TaskItem;
import com.taskmanager.team_task_manager.model.TaskPriority;
import com.taskmanager.team_task_manager.model.TaskStatus;
import com.taskmanager.team_task_manager.model.UserAccount;
import com.taskmanager.team_task_manager.repository.ProjectWorkspaceRepository;
import com.taskmanager.team_task_manager.repository.TaskItemRepository;
import com.taskmanager.team_task_manager.repository.UserAccountRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskManagementService {

    private final TaskItemRepository taskItemRepository;
    private final ProjectWorkspaceRepository projectWorkspaceRepository;
    private final UserAccountRepository userAccountRepository;

    @Transactional
    public TaskResponse createTask(CreateTaskRequest request) {
        ProjectWorkspace project = projectWorkspaceRepository.findById(request.projectId())
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        TaskItem task = new TaskItem();
        task.setProject(project);
        task.setTitle(request.title().trim());
        task.setDescription(cleanText(request.description()));
        task.setPriority(request.priority() == null ? TaskPriority.MEDIUM : request.priority());
        task.setDueDate(request.dueDate());
        task.setStatus(TaskStatus.TODO);
        task.setAssignedTo(findMember(request.assignedToId(), request.assignedToEmail(), false));

        return toResponse(taskItemRepository.save(task));
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasks(String email) {
        UserAccount user = findUserByEmail(email);
        List<TaskItem> tasks = user.getRole() == Role.ADMIN
                ? taskItemRepository.findAllByOrderByDueDateAscCreatedAtDesc()
                : taskItemRepository.findByAssignedToOrderByDueDateAsc(user);

        return tasks.stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public TaskResponse assignTask(Long taskId, AssignTaskRequest request) {
        TaskItem task = findTask(taskId);
        task.setAssignedTo(findMember(request.assignedToId(), request.assignedToEmail(), true));
        return toResponse(taskItemRepository.save(task));
    }

    @Transactional
    public TaskResponse updateStatus(Long taskId, UpdateTaskStatusRequest request, String email) {
        UserAccount user = findUserByEmail(email);
        TaskItem task = findTask(taskId);

        boolean assignedMember = task.getAssignedTo() != null
                && task.getAssignedTo().getId().equals(user.getId());
        if (user.getRole() != Role.ADMIN && !assignedMember) {
            throw new AccessDeniedException("Only assigned member can update this task");
        }

        task.setStatus(request.status());
        return toResponse(taskItemRepository.save(task));
    }

    private UserAccount findMember(Long userId, String email, boolean required) {
        if (userId == null && (email == null || email.isBlank())) {
            if (required) {
                throw new IllegalArgumentException("Select a member to assign the task");
            }
            return null;
        }

        UserAccount user = userId != null
                ? userAccountRepository.findById(userId)
                        .orElseThrow(() -> new EntityNotFoundException("User not found"))
                : findUserByEmail(email.trim().toLowerCase());

        if (user.getRole() != Role.MEMBER) {
            throw new IllegalArgumentException("Task can be assigned only to a member");
        }
        return user;
    }

    private TaskItem findTask(Long taskId) {
        return taskItemRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));
    }

    private UserAccount findUserByEmail(String email) {
        return userAccountRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private TaskResponse toResponse(TaskItem task) {
        UserAccount assignedTo = task.getAssignedTo();
        ProjectWorkspace project = task.getProject();
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getDueDate(),
                isOverdue(task),
                project.getId(),
                project.getName(),
                assignedTo == null ? null : assignedTo.getId(),
                assignedTo == null ? "Unassigned" : assignedTo.getName(),
                task.getCreatedAt());
    }

    private boolean isOverdue(TaskItem task) {
        return task.getDueDate() != null
                && task.getDueDate().isBefore(LocalDate.now())
                && task.getStatus() != TaskStatus.COMPLETED;
    }

    private String cleanText(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
