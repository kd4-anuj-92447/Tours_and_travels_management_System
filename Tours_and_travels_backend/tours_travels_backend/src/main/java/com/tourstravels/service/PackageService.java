package com.tourstravels.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.tourstravels.entity.TravelPackage;
import com.tourstravels.repository.PackageRepository;

@Service
public class PackageService {

    private final PackageRepository repo;

    public PackageService(PackageRepository repo) {
        this.repo = repo;
    }

    public List<TravelPackage> getAllPackages() {
        return repo.findAll();
    }
}
