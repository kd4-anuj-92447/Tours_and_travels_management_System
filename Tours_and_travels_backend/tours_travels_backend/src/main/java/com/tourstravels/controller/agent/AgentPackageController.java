package com.tourstravels.controller.agent;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import com.tourstravels.entity.TravelPackage;
import com.tourstravels.service.PackageService;

@RestController
@RequestMapping("/api/agent/packages")
@PreAuthorize("hasRole('AGENT')")
public class AgentPackageController {

    @Autowired
    private PackageService packageService;

    // CREATE package → status = PENDING
    @PostMapping
    public TravelPackage createPackage(
            @RequestBody TravelPackage pkg,
            Authentication auth) {

        return packageService.createPackage(pkg, auth.getName());
    }

    // VIEW own packages (any status)
    @GetMapping
    public List<TravelPackage> getAgentPackages(Authentication auth) {
        return packageService.getPackagesByAgent(auth.getName());
    }
}
