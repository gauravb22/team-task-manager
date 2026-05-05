package com.taskmanager.team_task_manager.repository;

import com.taskmanager.team_task_manager.model.TaskItem;
import com.taskmanager.team_task_manager.model.TaskStatus;
import com.taskmanager.team_task_manager.model.UserAccount;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskItemRepository extends JpaRepository<TaskItem, Long> {

    List<TaskItem> findAllByOrderByDueDateAscCreatedAtDesc();

    List<TaskItem> findByAssignedToOrderByDueDateAsc(UserAccount assignedTo);

    long countByStatus(TaskStatus status);

    long countByDueDateBeforeAndStatusNot(LocalDate date, TaskStatus status);
}
