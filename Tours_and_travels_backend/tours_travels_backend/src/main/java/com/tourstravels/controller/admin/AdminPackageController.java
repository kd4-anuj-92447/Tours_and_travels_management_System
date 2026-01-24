package com.tourstravels.controller.admin;

import com.tourstravels.entity.TravelPackage;
import com.tourstravels.service.PackageService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/packages")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPackageController {

    private final PackageService packageService;

    public AdminPackageController(PackageService packageService) {
        this.packageService = packageService;
    }

    /* ================= PENDING PACKAGES ================= */

    @GetMapping("/pending")
    public List<TravelPackage> getPendingPackages() {
        return packageService.getPendingPackages();
    }

    /* ================= ADMIN DECISION ================= */

    @PutMapping("/{id}/decision")
    public TravelPackage adminDecision(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        return packageService.adminDecision(id, body.get("decision"));
    }
}
