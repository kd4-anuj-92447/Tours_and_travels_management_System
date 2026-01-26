package com.tourstravels.controller.agent;

import com.tourstravels.entity.TravelPackage;
import com.tourstravels.entity.User;
import com.tourstravels.enums.PackageStatus;
import com.tourstravels.repository.PackageRepository;
import com.tourstravels.repository.UserRepository;
import com.tourstravels.service.ImageUploadService;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/agent/packages")
public class AgentPackageController {

    private final PackageRepository packageRepository;
    private final UserRepository userRepository;
    private final ImageUploadService imageUploadService;

    public AgentPackageController(
            PackageRepository packageRepository,
            UserRepository userRepository,
            ImageUploadService imageUploadService
    ) {
        this.packageRepository = packageRepository;
        this.userRepository = userRepository;
        this.imageUploadService = imageUploadService;
    }

    /* CREATE PACKAGE */
    @PostMapping
    public TravelPackage createPackage(
            @RequestBody TravelPackage tourPackage,
            @AuthenticationPrincipal String email
    ) {
        User agent = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        tourPackage.setAgent(agent);
        tourPackage.setStatus(PackageStatus.PENDING);

        return packageRepository.save(tourPackage);
    }

    /* EDIT PACKAGE */
    @PutMapping("/{id}")
    public TravelPackage updatePackage(
            @PathVariable Long id,
            @RequestBody TravelPackage updated
    ) {
        TravelPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        pkg.setTitle(updated.getTitle());
        pkg.setDescription(updated.getDescription());
        pkg.setPrice(updated.getPrice());
        pkg.setStatus(PackageStatus.PENDING); // re-approval required

        return packageRepository.save(pkg);
    }

    /* DELETE REQUEST */
    @PutMapping("/delete/{id}")
    public String requestDelete(@PathVariable Long id) {
        TravelPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        pkg.setStatus(PackageStatus.PENDING);
        packageRepository.save(pkg);

        return "Delete request sent for approval";
    }

    /* VIEW OWN PACKAGES */
    @GetMapping
    public List<TravelPackage> getMyPackages(
            @AuthenticationPrincipal String email
    ) {
        User agent = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        return packageRepository.findByAgent(agent);
    }
    
    @PostMapping("/upload-images")
    public List<String> uploadPackageImages(
            @RequestParam("images") MultipartFile[] images
    ) {
        if (images.length > 5) {
            throw new RuntimeException("Maximum 5 images allowed");
        }

        return imageUploadService.uploadImages(images); // ✅ NOW THIS WORKS!
    }
}
