package com.tourstravels.controller.customer;

import com.tourstravels.entity.Booking;
import com.tourstravels.entity.User;
import com.tourstravels.repository.UserRepository;
import com.tourstravels.service.BookingService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@PreAuthorize("hasRole('CUSTOMER')")
public class CustomerBookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    public CustomerBookingController(
            BookingService bookingService,
            UserRepository userRepository
    ) {
        this.bookingService = bookingService;
        this.userRepository = userRepository;
    }

    /* ================= CREATE BOOKING ================= */

    @PostMapping("/bookings")
    public Booking createBooking(
            @RequestBody Booking booking,
            Authentication auth) {

        User customer = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        booking.setUser(customer);
        return bookingService.createBooking(booking);
    }

    /* ================= VIEW MY BOOKINGS ================= */

    @GetMapping("/bookings")
    public List<Booking> getMyBookings(Authentication auth) {

        User customer = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        return bookingService.getBookingsByUser(customer.getUserId());
    }

    /* ================= CANCEL BOOKING ================= */

    @PutMapping("/bookings/{id}/cancel")
    public Booking cancelBooking(
            @PathVariable Long id,
            Authentication auth) {

        User customer = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        return bookingService.cancelByCustomer(id, customer.getUserId());
    }
}
