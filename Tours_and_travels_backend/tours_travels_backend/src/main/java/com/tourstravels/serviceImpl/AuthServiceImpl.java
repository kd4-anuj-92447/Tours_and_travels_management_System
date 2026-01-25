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
        Role role = roleRepository.findByRoleName("CUSTOMER")
                .orElseThrow(() -> new RuntimeException("Role CUSTOMER not found"));

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(role);

        return userRepository.save(user);
    }

    // AGENT creation (ADMIN only)
    @Override
    public User registerAgent(User user) {
        Role role = roleRepository.findByRoleName("AGENT")
                .orElseThrow(() -> new RuntimeException("Role AGENT not found"));

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(role);

        return userRepository.save(user);
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
}
