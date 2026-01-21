package com.tourstravels.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "packages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TravelPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long packageId;

    private String title;
    private String destination;

    @Column(name = "duration")
    private String duration;   // VARCHAR

    private Double price;

    @Column(length = 1000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "agent_id")
    private User agent;
}
