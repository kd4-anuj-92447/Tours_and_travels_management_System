package com.tourstravels.service;

import java.util.List;
import com.tourstravels.entity.TravelPackage;

public interface PackageService {

    // CUSTOMER
    List<TravelPackage> getApprovedPackages();

    // AGENT
    TravelPackage createPackage(TravelPackage travelPackage, String agentEmail);
    List<TravelPackage> getPackagesByAgent(String agentEmail);

    // ADMIN
    List<TravelPackage> getPendingPackages();
    TravelPackage adminDecision(Long packageId, String decision);
}

