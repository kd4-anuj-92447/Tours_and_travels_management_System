package com.tourstravels.controller.agent;

import com.tourstravels.entity.TravelPackage;
import com.tourstravels.entity.User;
import com.tourstravels.enums.PackageStatus;
import com.tourstravels.repository.BookingRepository;
import com.tourstravels.repository.PackageRepository;
import com.tourstravels.repository.UserRepository;
import com.tourstravels.service.ImageUploadService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/agent/packages")
public class AgentPackageController {

    private final PackageRepository packageRepository;
    private final UserRepository userRepository;
    private final ImageUploadService imageUploadService;
    private static final Logger logger =
            Logger.getLogger(AgentPackageController.class.getName());

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
            Authentication authentication
    ) {
        logger.info("AUTH NAME = " + authentication.getName());

        String email = authentication.getName();

        User agent = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Agent not found: " + email));

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
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePackage(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        User agent = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        TravelPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        // Ownership check
        if (!pkg.getAgent().getUserId().equals(agent.getUserId())) {
            return ResponseEntity.status(403)
                    .body("You are not allowed to delete this package");
        }

        // ✅ SAFE booking check
        if (BookingRepository.existsByTourPackageId(id)) {
            return ResponseEntity.badRequest()
                    .body("Cannot delete package with existing bookings");
        }

        packageRepository.delete(pkg);
        return ResponseEntity.ok("Package deleted successfully");
    }



    /* VIEW OWN PACKAGES */
    @GetMapping
    public List<TravelPackage> getMyPackages(Authentication authentication) {

        String email = authentication.getName();

        User agent = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        return packageRepository.findByAgent(agent);
    }

    
    @PostMapping("/{id}/upload-images")
    public TravelPackage uploadPackageImages(
            @PathVariable Long id,
            @RequestParam("images") MultipartFile[] images
    ) {
        TravelPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        if (images.length > 5) {
            throw new RuntimeException("Maximum 5 images allowed");
        }

        // Upload images and get URLs
        List<String> uploadedUrls = imageUploadService.uploadImages(images);

        // Initialize imageUrls if null
        if (pkg.getImageUrls() == null) {
            pkg.setImageUrls(new java.util.ArrayList<>());
        }

        // Add uploaded URLs to package
        pkg.getImageUrls().addAll(uploadedUrls);

        return packageRepository.save(pkg);
    }

    /* ADD PACKAGE IMAGES VIA URLS */
    @PostMapping("/{id}/image-urls")
    public TravelPackage addPackageImageUrls(
            @PathVariable Long id,
            @RequestBody ImageUrlRequest request
    ) {
        TravelPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        if (request.getImageUrls() == null || request.getImageUrls().isEmpty()) {
            throw new RuntimeException("At least one image URL is required");
        }

        if (request.getImageUrls().size() > 5) {
            throw new RuntimeException("Maximum 5 images allowed");
        }

        // Initialize imageUrls if null
        if (pkg.getImageUrls() == null) {
            pkg.setImageUrls(new java.util.ArrayList<>());
        }

        // Add URLs to package
        pkg.getImageUrls().addAll(request.getImageUrls());

        return packageRepository.save(pkg);
    }
}

// DTO for image URL request
class ImageUrlRequest {
    private List<String> imageUrls;

    public ImageUrlRequest() {}

    public ImageUrlRequest(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
}
