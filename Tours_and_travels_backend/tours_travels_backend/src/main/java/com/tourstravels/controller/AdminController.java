package com.tourstravels.controller;

import com.tourstravels.entity.User;
import com.tourstravels.service.AuthService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AuthService authService;

    public AdminController(AuthService authService) {
        this.authService = authService;
    }

    /* ================= AGENT MANAGEMENT ================= */

    @PostMapping("/agents")
    public User createAgent(@RequestBody User user) {
        return authService.registerAgent(user);
    }

    /* ================= USER MANAGEMENT ================= */

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return authService.getAllUsers();
    }
}
