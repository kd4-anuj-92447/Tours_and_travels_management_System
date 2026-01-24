package com.tourstravels.entity;

import com.tourstravels.enums.PackageStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "packages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class TravelPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "package_id")
    private Long packageId;

    private String title;
    private String destination;
    private Double price;
    private String duration;

    @Column(length = 1000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "agent_id")
    private User agent;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PackageStatus status;
}
