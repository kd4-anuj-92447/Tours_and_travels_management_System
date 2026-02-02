package com.tourstravels.entity;

import com.tourstravels.enums.BookingStatus;
import com.tourstravels.enums.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
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
    
    @Column(name = "tourists_count", nullable = false)
    private Integer touristsCount;

    /* STATUS — MUST BE STRING */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private BookingStatus status;

    /* PAYMENT STATUS */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private PaymentStatus paymentStatus;

    /* MONEY — MUST BE DECIMAL */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    @Column(name = "tour_start_date" , nullable = false)
    private LocalDate tourStartDate;


    /* ================= TRANSIENT PROPERTIES FOR API ================= */

    @Transient
    @JsonProperty("customerName")
    public String getCustomerName() {
        return user != null ? user.getName() : "N/A";
    }

    @Transient
    @JsonProperty("packageName")
    public String getPackageName() {
        return tourPackage != null ? tourPackage.getTitle() : "N/A";
    }

    /* DERIVED PROPERTY — DO NOT REMOVE */
    @Transient
    public Long getAgentId() {
        return tourPackage != null && tourPackage.getAgent() != null
                ? tourPackage.getAgent().getUserId()
                : null;
    }

	

}
