package com.tourstravels.repository;

import com.tourstravels.entity.Payment;
import com.tourstravels.entity.Booking;
import com.tourstravels.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // One payment per booking
    Optional<Payment> findByBooking(Booking booking);

    // Customer payments (via booking → user)
    List<Payment> findByBookingUser(User user);
}
