package com.tourstravels.controller;

import com.tourstravels.dto.AgentRegistrationRequest;
import com.tourstravels.entity.User;
import com.tourstravels.security.JwtUtil;
import com.tourstravels.service.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(
            AuthService authService,
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil
    ) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    // CUSTOMER REGISTRATION (PUBLIC)
    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody User user) {
        logger.info("👤 Customer registration attempt received");
        logger.info("  - Name: {}", user.getName());
        logger.info("  - Email: {}", user.getEmail());
        logger.info("  - Password: {}", user.getPassword() != null ? "***PRESENT***" : "NULL");
        logger.info("  - Phone: {}", user.getPhone());
        
        try {
            // Validate email doesn't already exist
            if (authService.emailExists(user.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Email already registered. Please login or use a different email."));
            }

            User registeredUser = authService.registerCustomer(user);
            logger.info("✅ Customer registered successfully: {}", user.getEmail());
            return ResponseEntity.ok(registeredUser);
        } catch (RuntimeException e) {
            logger.error("❌ Customer registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            logger.error("❌ Customer registration failed with exception: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Registration failed: " + e.getMessage()));
        }
    }

    // AGENT REGISTRATION (PUBLIC - PENDING APPROVAL)
    @PostMapping("/register-agent")
    public ResponseEntity<Map<String, String>> registerAgent(@RequestBody AgentRegistrationRequest request) {
        logger.info("📋 Agent registration (PENDING): {}", request.getEmail());

        try {
            // Validate email doesn't exist
            if (authService.emailExists(request.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Email already exists"));
            }

            // Create user from request
            User agent = new User();
            agent.setName(request.getName());
            agent.setEmail(request.getEmail());
            agent.setPassword(request.getPassword());
            agent.setPhone(request.getPhone());
            agent.setAddress(request.getAddress());
            agent.setCompanyName(request.getCompanyName());
            agent.setLicenseNumber(request.getLicenseNumber());

            // Register with PENDING status
            authService.registerAgentPending(agent);

            return ResponseEntity.ok(Map.of(
                    "message", "Agent registration submitted! Awaiting admin approval."
            ));
        } catch (RuntimeException e) {
            logger.error("❌ Agent registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // LOGIN (ADMIN / AGENT / CUSTOMER)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        logger.info("🔐 Login attempt: {}", request.getEmail());

        try {
            // Authenticate
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            User user = authService.getUserByEmail(request.getEmail());

            // CHECK: If agent and not approved, block login
            if (user.getRole().getRoleName().equals("AGENT") && !user.getIsApproved()) {
                logger.warn("⚠️ Agent login blocked (pending approval): {}", request.getEmail());
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Your registration is pending admin approval"));
            }

            String token = jwtUtil.generateToken(
                    user.getEmail(),
                    user.getRole().getRoleName()
            );

            logger.info("✅ Login successful: {} (Role: {})", 
                    request.getEmail(), user.getRole().getRoleName());

            return ResponseEntity.ok(new AuthResponse(
                    token,
                    user.getRole().getRoleName(),
                    user.getUserId()
            ));
        } catch (Exception e) {
            logger.error("❌ Login failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials"));
        }
    }

    // DTOs
    static class LoginRequest {
        private String email;
        private String password;
        public String getEmail() { return email; }
        public String getPassword() { return password; }
        public void setEmail(String email) { this.email = email; }
        public void setPassword(String password) { this.password = password; }
    }

    static class AuthResponse {
        private String token;
        private String role;
        private Long userId;

        public AuthResponse(String token, String role, Long userId) {
            this.token = token;
            this.role = role;
            this.userId = userId;
        }

        public String getToken() { return token; }
        public String getRole() { return role; }
        public Long getUserId() { return userId; }
    }
}
