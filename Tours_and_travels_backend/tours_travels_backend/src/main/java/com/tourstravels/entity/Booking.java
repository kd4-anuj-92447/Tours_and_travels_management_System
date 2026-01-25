package com.tourstravels.entity;

import com.tourstravels.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* CUSTOMER */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /* PACKAGE */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id", nullable = false)
    private TravelPackage tourPackage;

    /* STATUS — MUST BE STRING */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private BookingStatus status;

    /* MONEY — MUST BE DECIMAL */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    /* DERIVED PROPERTY — DO NOT REMOVE */
    @Transient
    public Long getAgentId() {
        return tourPackage != null && tourPackage.getAgent() != null
                ? tourPackage.getAgent().getUserId()
                : null;
    }
}
