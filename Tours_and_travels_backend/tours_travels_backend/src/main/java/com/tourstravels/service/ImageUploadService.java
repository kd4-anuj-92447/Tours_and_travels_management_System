package com.tourstravels.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ImageUploadService {

    // Directory where package images will be stored
    // This path is relative to the project root
    private static final String UPLOAD_DIR = "uploads/packages/";

    /**
     * Upload multiple images and return their accessible URLs
     *
     * @param files array of MultipartFile received from frontend
     * @return list of image URLs stored on server
     */
    public List<String> uploadImages(MultipartFile[] files) {

        try {
            // Create directory if it does not exist
            Files.createDirectories(Paths.get(UPLOAD_DIR));

            // List to store image URLs
            List<String> imageUrls = new ArrayList<>();

            // Loop through each uploaded file
            for (MultipartFile file : files) {

                // Generate unique filename to avoid name conflicts
                String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();

                // Create full file path where image will be saved
                Path path = Paths.get(UPLOAD_DIR + filename);

                // Write file bytes to the given path
                Files.write(path, file.getBytes());

                // Store relative URL to be saved in DB or returned to frontend
                imageUrls.add("/uploads/packages/" + filename);
            }

            // Return list of uploaded image URLs
            return imageUrls;

        } catch (Exception e) {
            // If anything fails, throw runtime exception
            throw new RuntimeException("Image upload failed", e);
        }
    }
}
