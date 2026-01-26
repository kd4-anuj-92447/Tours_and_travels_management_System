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

@RestController
@RequestMapping("/api/admin/packages")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminPackageController {

    private static final Logger logger = LoggerFactory.getLogger(AdminPackageController.class);
    private final PackageRepository packageRepository;

    public AdminPackageController(PackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    @GetMapping
    public List<TravelPackage> getAllPackages() {
        logger.info("📦 GET /api/admin/packages - getAllPackages() called");
        List<TravelPackage> packages = packageRepository.findAll();
        logger.info("✅ Retrieved {} packages", packages.size());
        return packages;
    }
    
    @GetMapping("/pending")
    public List<TravelPackage> getPendingPackages() {
        logger.info("⏳ GET /api/admin/packages/pending - getPendingPackages() called");
        List<TravelPackage> packages = packageRepository.findByStatus(PackageStatus.PENDING);
        logger.info("✅ Retrieved {} pending packages", packages.size());
        return packages;
    }

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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePackage(@PathVariable Long id) {
        logger.info("🗑️  DELETE /api/admin/packages/{} - deletePackage() called", id);
        if (!packageRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        packageRepository.deleteById(id);
        logger.info("✅ Package ID {} deleted successfully", id);
        return ResponseEntity.ok("Package deleted");
    }
}

