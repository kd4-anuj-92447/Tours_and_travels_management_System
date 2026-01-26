package com.tourstravels.controller.customer;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

import com.tourstravels.entity.TravelPackage;
import com.tourstravels.service.PackageService;

@RestController
@RequestMapping("/api/customer/packages")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerPackageController {

    private static final Logger logger = LoggerFactory.getLogger(CustomerPackageController.class);

    @Autowired
    private PackageService packageService;

    // VIEW ONLY APPROVED PACKAGES
    @GetMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getApprovedPackages() {
        try {
            logger.info("📦 [GET] /api/customer/packages - Fetching approved packages");
            List<TravelPackage> packages = packageService.getApprovedPackages();
            logger.info("✅ Successfully returned {} approved packages", packages.size());
            return ResponseEntity.ok(packages);
        } catch (Exception e) {
            logger.error("❌ Error fetching approved packages: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error fetching packages: " + e.getMessage());
        }
    }
}
