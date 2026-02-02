// Package declaration: defines the folder structure of this controller
package com.tourstravels.controller.admin;

// Importing the User entity class
import com.tourstravels.entity.User;

// Importing the UserRepository to interact with the database
import com.tourstravels.repository.UserRepository;

// Spring Security annotation to restrict access based on roles
import org.springframework.security.access.prepost.PreAuthorize;

// Spring MVC annotations
import org.springframework.web.bind.annotation.*;

// SLF4J logging classes
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// Java utility for handling lists
import java.util.List;

// Marks this class as a REST controller (returns JSON responses)
@RestController

// Base URL for all APIs inside this controller
@RequestMapping("/api/admin/users")

// Allows requests from frontend running on this URL (CORS configuration)
@CrossOrigin(origins = "http://localhost:5173")
public class AdminUserController {

    // Logger instance for logging messages (info, error, etc.)
    private static final Logger logger =
            LoggerFactory.getLogger(AdminUserController.class);

    // Repository reference to perform database operations on User entity
    private final UserRepository userRepository;

    // Constructor-based dependency injection of UserRepository
    public AdminUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Handles HTTP GET requests to /api/admin/users
    @GetMapping

    // Only users with ADMIN role can access this method
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {

        // Log when API is called
        logger.info("👥 GET /api/admin/users - getAllUsers() called");

        // Fetch all users from the database
        List<User> users = userRepository.findAll();

        // Log how many users were retrieved
        logger.info("✅ Retrieved {} users", users.size());

        // Return the list of users as JSON response
        return users;
    }
}
