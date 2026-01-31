package com.tourstravels.controller.admin;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tourstravels.entity.TravelPackage;
import com.tourstravels.enums.PackageStatus;
import com.tourstravels.repository.PackageRepository;

// Admin controller for managing travel packages
@RestController
@RequestMapping("/api/admin/packages")
@PreAuthorize("hasRole('ADMIN')") // Restrict access to ADMIN role
@CrossOrigin(origins = "http://localhost:5173")
public class AdminPackageController {

    // Logger for request tracking
    private static final Logger logger = LoggerFactory.getLogger(AdminPackageController.class);

    private final PackageRepository packageRepository;

    // Constructor injection
    public AdminPackageController(PackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    // Get all travel packages
    @GetMapping
    public List<TravelPackage> getAllPackages() {
        logger.info("📦 GET /api/admin/packages - getAllPackages() called");
        List<TravelPackage> packages = packageRepository.findAll();
        logger.info("✅ Retrieved {} packages", packages.size());
        return packages;
    }

    // Get only pending packages
    @GetMapping("/pending")
    public List<TravelPackage> getPendingPackages() {
        logger.info("⏳ GET /api/admin/packages/pending - getPendingPackages() called");
        List<TravelPackage> packages = packageRepository.findByStatus(PackageStatus.PENDING);
        logger.info("✅ Retrieved {} pending packages", packages.size());
        return packages;
    }

    // Approve a package
    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approvePackage(@PathVariable Long id) {
        logger.info("✅ PUT /api/admin/packages/approve/{} - approvePackage() called", id);

        TravelPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        pkg.setStatus(PackageStatus.APPROVED);
        packageRepository.save(pkg);

        logger.info("✅ Package ID {} approved successfully", id);
        return ResponseEntity.ok("Package approved");
    }

    // Reject a package
    @PutMapping("/reject/{id}")
    public ResponseEntity<?> rejectPackage(@PathVariable Long id) {
        logger.info("❌ PUT /api/admin/packages/reject/{} - rejectPackage() called", id);

        TravelPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        pkg.setStatus(PackageStatus.REJECTED);
        packageRepository.save(pkg);

        logger.info("✅ Package ID {} rejected successfully", id);
        return ResponseEntity.ok("Package rejected");
    }

    // Permanently delete a package
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePackage(@PathVariable Long id) {
        logger.info("🗑️ DELETE /api/admin/packages/{} - deletePackage() called", id);

        if (!packageRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        packageRepository.deleteById(id);
        logger.info("✅ Package ID {} deleted successfully", id);
        return ResponseEntity.ok("Package deleted");
    }
}
