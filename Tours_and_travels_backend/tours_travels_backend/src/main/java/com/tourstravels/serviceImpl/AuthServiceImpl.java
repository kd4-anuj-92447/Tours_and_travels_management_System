package com.tourstravels.serviceImpl;

import com.tourstravels.entity.Role;
import com.tourstravels.entity.User;
import com.tourstravels.repository.RoleRepository;
import com.tourstravels.repository.UserRepository;
import com.tourstravels.service.AuthService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    // CUSTOMER self-registration
    @Override
    public User registerCustomer(User user) {
        logger.info("👤 Registering customer: {}", user.getEmail());

        // Validate required fields
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            logger.warn("⚠️ Registration validation failed: Name is required");
            throw new RuntimeException("Name is required");
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            logger.warn("⚠️ Registration validation failed: Email is required");
            throw new RuntimeException("Email is required");
        }
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            logger.warn("⚠️ Registration validation failed: Password is required");
            throw new RuntimeException("Password is required");
        }
        if (user.getPhone() == null || user.getPhone().trim().isEmpty()) {
            logger.warn("⚠️ Registration validation failed: Phone is required");
            throw new RuntimeException("Phone is required");
        }

        Role role = roleRepository.findByRoleName("CUSTOMER")
                .orElseThrow(() -> new RuntimeException("Role CUSTOMER not found"));

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(role);

        User savedUser = userRepository.save(user);
        logger.info("✅ Customer registered successfully: {}", user.getEmail());
        return savedUser;
    }

    // AGENT creation (ADMIN only) - Already approved
    @Override
    public User registerAgent(User user) {
        Role role = roleRepository.findByRoleName("AGENT")
                .orElseThrow(() -> new RuntimeException("Role AGENT not found"));

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(role);
        user.setIsApproved(true);
        user.setApprovalDate(LocalDateTime.now());

        return userRepository.save(user);
    }

    // AGENT self-registration (PENDING APPROVAL)
    @Override
    public User registerAgentPending(User user) {
        logger.info("📋 Registering agent (PENDING): {}", user.getEmail());

        if (emailExists(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Role role = roleRepository.findByRoleName("AGENT")
                .orElseThrow(() -> new RuntimeException("Role AGENT not found"));

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(role);
        user.setIsApproved(false); // PENDING APPROVAL
        user.setApprovalDate(null);
        user.setApprovedBy(null);

        User savedAgent = userRepository.save(user);
        logger.info("✅ Agent registered (PENDING): {}", savedAgent.getEmail());
        return savedAgent;
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found with email: " + email)
                );
    }

    @Override
    public List<User> getAllUsers() {
        logger.info("🔍 getAllUsers() called in AuthServiceImpl");
        List<User> users = userRepository.findAll();
        logger.info("✅ userRepository.findAll() returned {} users", users.size());
        users.forEach(user -> {
            logger.debug("User: ID={}, Name={}, Email={}, Role={}", 
                user.getUserId(), user.getName(), user.getEmail(), 
                user.getRole() != null ? user.getRole().getRoleName() : "NO_ROLE");
        });
        return users;
    }

    @Override
    public List<User> getPendingAgents() {
        logger.info("🔍 Fetching pending agents");
        Role agentRole = roleRepository.findByRoleName("AGENT")
                .orElseThrow(() -> new RuntimeException("Role AGENT not found"));

        List<User> pendingAgents = userRepository.findByRoleAndIsApprovedFalse(agentRole);
        logger.info("✅ Found {} pending agents", pendingAgents.size());
        return pendingAgents;
    }

    @Override
    public List<User> getApprovedAgents() {
        logger.info("🔍 Fetching approved agents");
        Role agentRole = roleRepository.findByRoleName("AGENT")
                .orElseThrow(() -> new RuntimeException("Role AGENT not found"));

        List<User> approvedAgents = userRepository.findByRoleAndIsApprovedTrue(agentRole);
        logger.info("✅ Found {} approved agents", approvedAgents.size());
        return approvedAgents;
    }

    @Override
    public User approveAgent(Long agentId, String adminName) {
        logger.info("✅ Approving agent (ID: {})", agentId);

        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        if (!agent.getRole().getRoleName().equals("AGENT")) {
            throw new RuntimeException("User is not an agent");
        }

        agent.setIsApproved(true);
        agent.setApprovalDate(LocalDateTime.now());
        agent.setApprovedBy(adminName);

        User approvedAgent = userRepository.save(agent);
        logger.info("✅ Agent approved: {} (by {})", agent.getEmail(), adminName);
        return approvedAgent;
    }

    @Override
    public void rejectAgent(Long agentId) {
        logger.info("❌ Rejecting agent (ID: {})", agentId);

        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        if (!agent.getRole().getRoleName().equals("AGENT")) {
            throw new RuntimeException("User is not an agent");
        }

        userRepository.deleteById(agentId);
        logger.info("✅ Agent registration rejected and deleted: {}", agent.getEmail());
    }

    @Override
    public boolean emailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }
}

