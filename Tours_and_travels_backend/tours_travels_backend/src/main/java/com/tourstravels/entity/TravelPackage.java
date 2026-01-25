package com.tourstravels.entity;

import com.tourstravels.enums.PackageStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "travel_packages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private Double price;

    /* ================= STATUS ================= */

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PackageStatus status;

    /* ================= AGENT ================= */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    private User agent;

    /* ================= IMAGES ================= */

    @ElementCollection
    @CollectionTable(
        name = "package_images",
        joinColumns = @JoinColumn(name = "package_id")
    )
    @Column(name = "image_url")
    private List<String> imageUrls;
}
