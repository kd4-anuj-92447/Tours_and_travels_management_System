package com.tourstravels.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.tourstravels.entity.TravelPackage;
import com.tourstravels.service.PackageService;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin("*")
public class CustomerController {

    private final PackageService service;

    public CustomerController(PackageService service) {
        this.service = service;
    }

    @GetMapping("/packages")
    public List<TravelPackage> viewPackages() {
        return service.getAllPackages();
    }
}
