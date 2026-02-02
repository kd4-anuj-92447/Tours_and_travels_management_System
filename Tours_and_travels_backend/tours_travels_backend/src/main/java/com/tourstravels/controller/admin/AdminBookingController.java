package com.tourstravels.controller.admin;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tourstravels.entity.Booking;
import com.tourstravels.enums.BookingStatus;
import com.tourstravels.enums.PaymentStatus;
import com.tourstravels.repository.BookingRepository;

// REST controller for admin booking operations
@RestController
@RequestMapping("/api/admin/bookings")
@PreAuthorize("hasRole('ADMIN')") // Only ADMIN can access these APIs
@CrossOrigin(origins = "http://localhost:5173")
public class AdminBookingController {

    // Logger for request tracing
    private static final Logger logger = LoggerFactory.getLogger(AdminBookingController.class);

    private final BookingRepository bookingRepository;

    // Constructor injection
    public AdminBookingController(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    // Fetch all bookings
    @GetMapping
    public List<Booking> getAllBookings() {
        logger.info("📅 GET /api/admin/bookings - getAllBookings() called");
        List<Booking> bookings = bookingRepository.findAll();
        logger.info("✅ Retrieved {} bookings", bookings.size());
        return bookings;
    }

    // Confirm booking after successful payment
    @PutMapping("/confirm/{id}")
    public ResponseEntity<?> confirmBooking(@PathVariable Long id) {

        logger.info("✅ PUT /api/admin/bookings/confirm/{} - confirmBooking() called", id);

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Payment must be successful before confirmation
        if (booking.getPaymentStatus() != PaymentStatus.SUCCESS) {
            logger.warn("❌ Booking ID {} cannot be confirmed. Payment status: {}", id, booking.getPaymentStatus());
            return ResponseEntity.badRequest()
                    .body("Payment must be completed before confirming booking");
        }

        // Update booking status
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        logger.info("✅ Booking ID {} confirmed successfully", id);
        return ResponseEntity.ok("Booking confirmed");
    }

    // Cancel a booking
    @PutMapping("/cancel/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        logger.info("❌ PUT /api/admin/bookings/cancel/{} - cancelBooking() called", id);

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        logger.info("✅ Booking ID {} cancelled successfully", id);
        return ResponseEntity.ok("Booking cancelled");
    }
}
