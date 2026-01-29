package com.tourstravels.controller.admin;

import com.tourstravels.entity.TravelPackage;
import com.tourstravels.enums.PackageStatus;
import com.tourstravels.repository.PackageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * AdminPackageController
 * ----------------------
 * Handles all ADMIN operations related to Travel Packages:
 * - View all packages
 * - View pending packages
 * - Approve a package
 * - Reject a package
 * - Delete a package
 */
@RestController // Marks this class as a REST controller
@RequestMapping("/api/admin/packages") // Base URL for admin package APIs
@PreAuthorize("hasRole('ADMIN')") // Restrict access to ADMIN role only
@CrossOrigin(origins = "http://localhost:5173") // Allow React/Vite frontend access
public class AdminPackageController {

    // Logger for debugging and API tracking
    private static final Logger logger =
            LoggerFactory.getLogger(AdminPackageController.class);

    // Repository for package database operations
    private final PackageRepository packageRepository;

    // Constructor-based dependency injection
    public AdminPackageController(PackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    /**
     * Get all travel packages (approved, pending, rejected)
     * URL: GET /api/admin/packages
     */
    @GetMapping
    public List<TravelPackage> getAllPackages() {

        // Log API call
        logger.info("📦 GET /api/admin/packages - getAllPackages() called");

        // Fetch all packages from database
        List<TravelPackage> packages = packageRepository.findAll();

        // Log number of records fetched
        logger.info("✅ Retrieved {} packages", packages.size());

        // Return package list as JSON
        return packages;
    }

    /**
     * Get only PENDING travel packages
     * URL: GET /api/admin/packages/pending
     */
    @GetMapping("/pending")
    public List<TravelPackage> getPendingPackages() {

        // Log API call
        logger.info("⏳ GET /api/admin/packages/pending - getPendingPackages() called");

        // Fetch packages with PENDING status
        List<TravelPackage> packages =
                packageRepository.findByStatus(PackageStatus.PENDING);

        // Log number of pending packages
        logger.info("✅ Retrieved {} pending packages", packages.size());

        // Return pending package list
        return packages;
    }

    /**
     * Approve a travel package
     * URL: PUT /api/admin/packages/approve/{id}
     */
    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approvePackage(@PathVariable Long id) {

        // Log approve request
        logger.info("✅ PUT /api/admin/packages/approve/{} - approvePackage() called", id);

        // Fetch package by ID
        TravelPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        // Update package status to APPROVED
        pkg.setStatus(PackageStatus.APPROVED);

        // Save updated package
        packageRepository.save(pkg);

        // Log success
        logger.info("✅ Package ID {} approved successfully", id);

        // Return success response
        return ResponseEntity.ok("Package approved");
    }

    /**
     * Reject a travel package
     * URL: PUT /api/admin/packages/reject/{id}
     */
    @PutMapping("/reject/{id}")
    public ResponseEntity<?> rejectPackage(@PathVariable Long id) {

        // Log reject request
        logger.info("❌ PUT /api/admin/packages/reject/{} - rejectPackage() called", id);

        // Fetch package by ID
        TravelPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        // Update package status to REJECTED
        pkg.setStatus(PackageStatus.REJECTED);

        // Save updated package
        packageRepository.save(pkg);

        // Log success
        logger.info("✅ Package ID {} rejected successfully", id);

        // Return success response
        return ResponseEntity.ok("Package rejected");
    }

    /**
     * Delete a travel package by ID
     * URL: DELETE /api/admin/packages/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePackage(@PathVariable Long id) {

        // Log delete request
        logger.info("🗑️ DELETE /api/admin/packages/{} - deletePackage() called", id);

        // Check if package exists before deleting
        if (!packageRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // Delete package
        packageRepository.deleteById(id);

        // Log success
        logger.info("✅ Package ID {} deleted successfully", id);

        // Return success response
        return ResponseEntity.ok("Package deleted");
    }
}
