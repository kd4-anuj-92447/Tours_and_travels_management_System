package com.tourstravels.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;   // 🔴 REQUIRED for findByUserUserId

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY)
    private String password;

    /* ================= ROLE ================= */

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    /* ================= CUSTOMER PROFILE ================= */

    private String phone;

    private String address;

    private String profilePicUrl;

    /* ================= AGENT PROFILE & APPROVAL ================= */

    @Column(length = 150)
    private String companyName;

    @Column(length = 100)
    private String licenseNumber;

    private Boolean isApproved; // null/false = pending, true = approved

    @Column(name = "approval_date")
    private java.time.LocalDateTime approvalDate;

    @Column(length = 100)
    private String approvedBy; // Admin name who approved
    
    @OneToMany(mappedBy = "agent", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<TravelPackage> packages;
}
