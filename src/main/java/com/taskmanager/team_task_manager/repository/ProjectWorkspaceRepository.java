package com.taskmanager.team_task_manager.repository;

import com.taskmanager.team_task_manager.model.ProjectWorkspace;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectWorkspaceRepository extends JpaRepository<ProjectWorkspace, Long> {

    List<ProjectWorkspace> findAllByOrderByCreatedAtDesc();
}
