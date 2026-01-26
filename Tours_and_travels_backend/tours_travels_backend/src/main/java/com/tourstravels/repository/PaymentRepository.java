package com.tourstravels.repository;

import com.tourstravels.entity.Payment;
import com.tourstravels.entity.Booking;
import com.tourstravels.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // One payment per booking
    Optional<Payment> findByBooking(Booking booking);

    // Customer payments (via booking → user)
    List<Payment> findByBookingUser(User user);

    // Query to fetch all payments with eager loading of booking and user data
    @Query("SELECT DISTINCT p FROM Payment p LEFT JOIN FETCH p.booking b LEFT JOIN FETCH b.user LEFT JOIN FETCH b.tourPackage")
    List<Payment> findAllWithDetails();
}
