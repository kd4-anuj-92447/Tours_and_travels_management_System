package com.tourstravels.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;
    private String phone;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;
}
