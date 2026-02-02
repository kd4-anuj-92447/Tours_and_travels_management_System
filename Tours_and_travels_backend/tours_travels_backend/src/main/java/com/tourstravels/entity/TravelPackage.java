package com.tourstravels.entity;

import com.tourstravels.enums.PackageStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

@Entity
@Table(name = "travel_packages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
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
    
    /* ================= TIME & DATES =========== */
    
    @Column(name = "tour_start_time")
    private LocalDateTime tourStartTime;

    @Column(name = "tour_end_time")
    private LocalDateTime tourEndTime;

    @Column(name = "transport_mode")
    private String transportMode;

    @Column(name = "transport_details", length = 500)
    private String transportDetails;


    /* ================= STATUS ================= */

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PackageStatus status;

    /* ================= AGENT ================= */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    @JsonBackReference
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
