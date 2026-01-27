package com.tourstravels.entity;

import com.tourstravels.enums.PackageStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
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

    @Column(length = 100)
    private String duration;

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
    @Column(name = "image_url", nullable = true)
    private List<String> imageUrls;

    /* ================= TRANSIENT PROPERTIES FOR API ================= */

    @Transient
    @JsonProperty("agentName")
    public String getAgentName() {
        return agent != null ? agent.getName() : "N/A";
    }
}
