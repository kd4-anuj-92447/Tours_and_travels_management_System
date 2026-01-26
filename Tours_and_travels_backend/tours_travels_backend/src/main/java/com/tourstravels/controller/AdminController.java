package com.tourstravels.controller;

import com.tourstravels.entity.User;
import com.tourstravels.service.AuthService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    private final AuthService authService;

    public AdminController(AuthService authService) {
        this.authService = authService;
    }

    /* ================= AGENT MANAGEMENT ================= */

    @PostMapping("/agents")
    @PreAuthorize("hasRole('ADMIN')")
    public User createAgent(@RequestBody User user) {
        logger.info("✅ Creating new agent: {}", user.getEmail());
        return authService.registerAgent(user);
    }

    /* ================= USER MANAGEMENT ================= */
    /* NOTE: User management endpoints are delegated to AdminUserController (/api/admin/users) */

    /* ================= PACKAGE MANAGEMENT ================= */
    /* NOTE: Package management endpoints are delegated to AdminPackageController (/api/admin/packages) */

    /* ================= BOOKING MANAGEMENT ================= */
    /* NOTE: Booking management endpoints are delegated to AdminBookingController (/api/admin/bookings) */

    /* ================= PAYMENT MANAGEMENT ================= */
    /* NOTE: Payment management endpoints are delegated to AdminPaymentController (/api/admin/payments) */
    
    /* ================= TEST ENDPOINT ================= */
    
    @GetMapping("/users/test")
    public List<User> getAllUsersTest() {
        logger.info("🔍 TEST ENDPOINT - getAllUsersTest() called (NO AUTH REQUIRED)");
        List<User> users = authService.getAllUsers();
        logger.info("✅ TEST - Retrieved {} users from database", users.size());
        users.forEach(user -> logger.debug("TEST - User: ID={}, Name={}, Email={}, Role={}", 
            user.getUserId(), user.getName(), user.getEmail(), 
            user.getRole() != null ? user.getRole().getRoleName() : "NO_ROLE"));
        return users;
    }
}
