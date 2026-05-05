package com.taskmanager.team_task_manager.repository;

import com.taskmanager.team_task_manager.model.Role;
import com.taskmanager.team_task_manager.model.UserAccount;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {

    Optional<UserAccount> findByEmail(String email);

    boolean existsByEmail(String email);

    List<UserAccount> findByRole(Role role);
}
