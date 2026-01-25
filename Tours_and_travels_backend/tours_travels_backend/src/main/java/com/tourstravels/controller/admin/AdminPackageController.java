package com.tourstravels.controller.admin;

import com.tourstravels.entity.TravelPackage;
import com.tourstravels.enums.PackageStatus;
import com.tourstravels.repository.PackageRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/packages")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPackageController {

    private final PackageRepository packageRepository;

    public AdminPackageController(PackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    @GetMapping
    public List<TravelPackage> getAllPackages() {
        return packageRepository.findAll();
    }
    
    @GetMapping("/pending")
    public List<TravelPackage> getPendingPackages() {
        return packageRepository.findByStatus(PackageStatus.PENDING);
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approvePackage(@PathVariable Long id) {
        TravelPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));
        pkg.setStatus(PackageStatus.APPROVED);
        packageRepository.save(pkg);
        return ResponseEntity.ok("Package approved");
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<?> rejectPackage(@PathVariable Long id) {
        TravelPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));
        pkg.setStatus(PackageStatus.REJECTED);
        packageRepository.save(pkg);
        return ResponseEntity.ok("Package rejected");
    }
}
