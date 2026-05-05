package com.taskmanager.team_task_manager.service;

import com.taskmanager.team_task_manager.dto.dashboard.DashboardResponse;
import com.taskmanager.team_task_manager.model.Role;
import com.taskmanager.team_task_manager.model.TaskStatus;
import com.taskmanager.team_task_manager.model.UserAccount;
import com.taskmanager.team_task_manager.repository.TaskItemRepository;
import com.taskmanager.team_task_manager.repository.UserAccountRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TaskItemRepository taskItemRepository;
    private final UserAccountRepository userAccountRepository;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(String email) {
        UserAccount user = userAccountRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (user.getRole() == Role.ADMIN) {
            return adminDashboard(user);
        }
        return memberDashboard(user);
    }

    private DashboardResponse adminDashboard(UserAccount user) {
        long total = taskItemRepository.count();
        long completed = taskItemRepository.countByStatus(TaskStatus.COMPLETED);
        long pending = taskItemRepository.countByStatusNot(TaskStatus.COMPLETED);
        long overdue = taskItemRepository.countByDueDateBeforeAndStatusNot(
                LocalDate.now(),
                TaskStatus.COMPLETED);

        return new DashboardResponse(user.getName(), user.getRole(), total, completed, pending, overdue);
    }

    private DashboardResponse memberDashboard(UserAccount user) {
        long total = taskItemRepository.countByAssignedTo(user);
        long completed = taskItemRepository.countByAssignedToAndStatus(user, TaskStatus.COMPLETED);
        long pending = taskItemRepository.countByAssignedToAndStatusNot(user, TaskStatus.COMPLETED);
        long overdue = taskItemRepository.countByAssignedToAndDueDateBeforeAndStatusNot(
                user,
                LocalDate.now(),
                TaskStatus.COMPLETED);

        return new DashboardResponse(user.getName(), user.getRole(), total, completed, pending, overdue);
    }
}
