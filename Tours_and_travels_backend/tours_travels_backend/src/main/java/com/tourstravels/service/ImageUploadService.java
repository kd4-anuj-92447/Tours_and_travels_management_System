package com.tourstravels.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.*;
import java.util.*;

@Service
public class ImageUploadService {

    private static final String UPLOAD_DIR = "uploads/packages/";

    public List<String> uploadImages(MultipartFile[] files) {
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
            List<String> imageUrls = new ArrayList<>();

            for (MultipartFile file : files) {
                String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path path = Paths.get(UPLOAD_DIR + filename);
                Files.write(path, file.getBytes());

                imageUrls.add("/uploads/packages/" + filename);
            }
            return imageUrls;

        } catch (Exception e) {
            throw new RuntimeException("Image upload failed", e);
        }
    }
}
