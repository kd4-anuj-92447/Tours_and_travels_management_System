package com.tourstravels.controller.admin;

import com.tourstravels.entity.Booking;
import com.tourstravels.enums.BookingStatus;
import com.tourstravels.enums.PaymentStatus;
import com.tourstravels.repository.BookingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bookings")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminBookingController {

    private static final Logger logger = LoggerFactory.getLogger(AdminBookingController.class);
    private final BookingRepository bookingRepository;

    public AdminBookingController(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        logger.info("📅 GET /api/admin/bookings - getAllBookings() called");
        List<Booking> bookings = bookingRepository.findAll();
        logger.info("✅ Retrieved {} bookings", bookings.size());
        return bookings;
    }

    @PutMapping("/confirm/{id}")
    public ResponseEntity<?> confirmBooking(@PathVariable Long id) {

        logger.info("✅ PUT /api/admin/bookings/confirm/{} - confirmBooking() called", id);

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // ✅ Payment must be successful
        if (booking.getPaymentStatus() != PaymentStatus.SUCCESS) {
            logger.warn("❌ Booking ID {} cannot be confirmed. Payment status: {}", id, booking.getPaymentStatus());
            return ResponseEntity.badRequest()
                    .body("Payment must be completed before confirming booking");
        }

        // ✅ THIS IS THE CORRECT FIELD
        booking.setStatus(BookingStatus.CONFIRMED);

        bookingRepository.save(booking);

        logger.info("✅ Booking ID {} confirmed successfully", id);
        return ResponseEntity.ok("Booking confirmed");
    }


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


