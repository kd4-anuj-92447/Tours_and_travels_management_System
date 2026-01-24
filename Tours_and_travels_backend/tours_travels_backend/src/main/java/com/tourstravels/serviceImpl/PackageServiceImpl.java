package com.tourstravels.serviceImpl;

import com.tourstravels.entity.TravelPackage;
import com.tourstravels.entity.User;
import com.tourstravels.repository.PackageRepository;
import com.tourstravels.repository.UserRepository;
import com.tourstravels.service.PackageService;
import com.tourstravels.enums.PackageStatus;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class PackageServiceImpl implements PackageService {

    @Autowired
    private PackageRepository packageRepository;

    @Autowired
    private UserRepository userRepository;

    /* ================= AGENT ================= */

    @Override
    public TravelPackage createPackage(TravelPackage travelPackage, String agentEmail) {

        User agent = userRepository.findByEmail(agentEmail)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        travelPackage.setAgent(agent);
        travelPackage.setStatus(PackageStatus.PENDING);


        return packageRepository.save(travelPackage);
    }

    @Override
    public List<TravelPackage> getPackagesByAgent(String agentEmail) {

        User agent = userRepository.findByEmail(agentEmail)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        return packageRepository.findByAgent(agent);
    }

    /* ================= CUSTOMER ================= */

    @Override
    public List<TravelPackage> getApprovedPackages() {
        return packageRepository.findByStatus(PackageStatus.APPROVED);
    }

    /* ================= ADMIN ================= */

    @Override
    public List<TravelPackage> getPendingPackages() {
        return packageRepository.findByStatus(PackageStatus.PENDING);
    }

    @Override
    public TravelPackage adminDecision(Long packageId, String decision) {

        TravelPackage pkg = packageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        // Guard: admin acts only on pending packages
        if (pkg.getStatus() != PackageStatus.PENDING) {
            throw new RuntimeException("Package already reviewed");
        }

        if ("APPROVE".equalsIgnoreCase(decision)) {
            pkg.setStatus(PackageStatus.APPROVED);
        } else if ("REJECT".equalsIgnoreCase(decision)) {
            pkg.setStatus(PackageStatus.REJECTED);
        }


        return packageRepository.save(pkg);
    }
}
