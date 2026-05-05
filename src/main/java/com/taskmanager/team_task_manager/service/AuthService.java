package com.taskmanager.team_task_manager.service;

import com.taskmanager.team_task_manager.dto.auth.AuthResponse;
import com.taskmanager.team_task_manager.dto.auth.LoginRequest;
import com.taskmanager.team_task_manager.dto.auth.SignupRequest;
import com.taskmanager.team_task_manager.model.Role;
import com.taskmanager.team_task_manager.model.UserAccount;
import com.taskmanager.team_task_manager.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userAccountRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered");
        }

        UserAccount user = new UserAccount();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role() == null ? Role.MEMBER : request.role());

        UserAccount savedUser = userAccountRepository.save(user);
        return toResponse(savedUser, "Signup successful");
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.password()));

        UserAccount user = userAccountRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return toResponse(user, "Login successful");
    }

    public AuthResponse currentUser(String email) {
        UserAccount user = userAccountRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return toResponse(user, "Logged in user");
    }

    private AuthResponse toResponse(UserAccount user, String message) {
        return new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                message);
    }
}
