package com.tourstravels.controller;

import com.tourstravels.entity.User;
import com.tourstravels.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    private final AuthService authService;

    public AdminController(AuthService authService) {
        this.authService = authService;
    }

    /* ================= AGENT MANAGEMENT (REGISTRATION & APPROVAL) ================= */

    @GetMapping("/agents/registrations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAgentRegistrations() {
        logger.info("🔍 Fetching all agent registrations (pending + approved)");
        List<User> agents = authService.getAllUsers();
        // Filter only agents
        agents.removeIf(u -> !u.getRole().getRoleName().equals("AGENT"));
        logger.info("✅ Found {} agents (pending + approved)", agents.size());
        return ResponseEntity.ok(agents);
    }

    @GetMapping("/agents/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getPendingAgents() {
        logger.info("🔍 Fetching pending agent registrations");
        List<User> pendingAgents = authService.getPendingAgents();
        logger.info("✅ Found {} pending agents", pendingAgents.size());
        return ResponseEntity.ok(pendingAgents);
    }

    @GetMapping("/agents/approved")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getApprovedAgents() {
        logger.info("🔍 Fetching approved agents");
        List<User> approvedAgents = authService.getApprovedAgents();
        logger.info("✅ Found {} approved agents", approvedAgents.size());
        return ResponseEntity.ok(approvedAgents);
    }

    @PutMapping("/agents/approve/{agentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> approveAgent(
            @PathVariable Long agentId,
            @RequestBody Map<String, String> body
    ) {
        logger.info("✅ Processing approval for agent ID: {}", agentId);
        logger.info("  Request body: {}", body);
        try {
            String adminName = body.getOrDefault("adminName", "Admin User");
            logger.info("  Admin name: {}", adminName);
            
            User approvedAgent = authService.approveAgent(agentId, adminName);
            logger.info("✅ Agent approved: {}", approvedAgent.getEmail());
            return ResponseEntity.ok(Map.of(
                    "message", "Agent approved successfully",
                    "agentEmail", approvedAgent.getEmail()
            ));
        } catch (RuntimeException e) {
            logger.error("❌ Approval failed: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            logger.error("❌ Approval failed with exception: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Failed to approve agent: " + e.getMessage()));
        }
    }

    @PutMapping("/agents/reject/{agentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> rejectAgent(
            @PathVariable Long agentId,
            @RequestBody Map<String, String> body
    ) {
        logger.info("❌ Processing rejection for agent ID: {}", agentId);
        try {
            String reason = body.getOrDefault("reason", "No reason provided");
            User agent = authService.getUserByEmail(
                    authService.getAllUsers().stream()
                            .filter(u -> u.getUserId().equals(agentId))
                            .findFirst()
                            .orElseThrow(() -> new RuntimeException("Agent not found"))
                            .getEmail()
            );
            authService.rejectAgent(agentId);
            logger.info("✅ Agent registration rejected: {}", agent.getEmail());
            return ResponseEntity.ok(Map.of(
                    "message", "Agent registration rejected",
                    "reason", reason
            ));
        } catch (RuntimeException e) {
            logger.error("❌ Rejection failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/agents")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createAgent(@RequestBody User user) {
        logger.info("✅ Admin creating new agent: {}", user.getEmail());
        return ResponseEntity.ok(authService.registerAgent(user));
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
