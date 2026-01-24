package com.tourstravels.controller.customer;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

import com.tourstravels.entity.TravelPackage;
import com.tourstravels.service.PackageService;

@RestController
@RequestMapping("/api/customer/packages")
public class CustomerPackageController {

    @Autowired
    private PackageService packageService;

    // VIEW ONLY APPROVED PACKAGES
    @GetMapping
    public List<TravelPackage> getApprovedPackages() {
        return packageService.getApprovedPackages();
    }
}
