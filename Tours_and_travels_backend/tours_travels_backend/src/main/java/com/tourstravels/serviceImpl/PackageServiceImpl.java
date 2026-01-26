package com.tourstravels.serviceImpl;

import com.tourstravels.entity.TravelPackage;
import com.tourstravels.entity.User;
import com.tourstravels.repository.PackageRepository;
import com.tourstravels.repository.UserRepository;
import com.tourstravels.service.PackageService;
import com.tourstravels.enums.PackageStatus;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
public class PackageServiceImpl implements PackageService {

    private static final Logger logger = LoggerFactory.getLogger(PackageServiceImpl.class);

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
        logger.info("🔍 getApprovedPackages() - Fetching approved packages");
        try {
            List<TravelPackage> packages = packageRepository.findByStatus(PackageStatus.APPROVED);
            logger.info("✅ Retrieved {} approved packages", packages.size());
            return packages;
        } catch (Exception e) {
            logger.error("❌ Error retrieving approved packages: {}", e.getMessage());
            throw e;
        }
    }

    /* ================= ADMIN ================= */

    @Override
    public List<TravelPackage> getAllPackages() {
        logger.info("📦 getAllPackages() - Fetching all packages with eager loading");
        List<TravelPackage> packages = packageRepository.findAllWithDetails();
        logger.info("✅ Retrieved {} packages", packages.size());
        return packages;
    }

    @Override
    public List<TravelPackage> getPendingPackages() {
        logger.info("⏳ getPendingPackages() - Fetching pending packages");
        List<TravelPackage> packages = packageRepository.findByStatus(PackageStatus.PENDING);
        logger.info("✅ Retrieved {} pending packages", packages.size());
        return packages;
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
            logger.info("✅ Approving package ID: {}", packageId);
            pkg.setStatus(PackageStatus.APPROVED);
        } else if ("REJECT".equalsIgnoreCase(decision)) {
            logger.info("❌ Rejecting package ID: {}", packageId);
            pkg.setStatus(PackageStatus.REJECTED);
        }

        return packageRepository.save(pkg);
    }

    @Override
    public void deletePackage(Long packageId) {
        logger.info("🗑️  Deleting package ID: {}", packageId);
        TravelPackage pkg = packageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found"));
        packageRepository.delete(pkg);
        logger.info("✅ Package deleted successfully");
    }
}
