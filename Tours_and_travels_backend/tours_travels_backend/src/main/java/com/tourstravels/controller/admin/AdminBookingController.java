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

/**
 * AdminBookingController
 * ----------------------
 * Handles all ADMIN operations related to bookings:
 * - View all bookings
 * - Confirm a booking
 * - Cancel a booking
 */
@RestController // Marks this class as a REST API controller
@RequestMapping("/api/admin/bookings") // Base URL for all admin booking APIs
@PreAuthorize("hasRole('ADMIN')") // Only users with ADMIN role can access these APIs
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend (Vite/React) access
public class AdminBookingController {

    // Logger for tracking API activity
    private static final Logger logger =
            LoggerFactory.getLogger(AdminBookingController.class);

    // BookingRepository for DB operations
    private final BookingRepository bookingRepository;

    // Constructor-based dependency injection
    public AdminBookingController(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    /**
     * GET all bookings
     * URL: /api/admin/bookings
     */
    @GetMapping
    public List<Booking> getAllBookings() {

        // Log API request
        logger.info("📅 GET /api/admin/bookings - getAllBookings() called");

        // Fetch all bookings from database
        List<Booking> bookings = bookingRepository.findAll();

        // Log number of records fetched
        logger.info("✅ Retrieved {} bookings", bookings.size());

        // Return booking list as JSON
        return bookings;
    }

    /**
     * Confirm a booking
     * URL: /api/admin/bookings/confirm/{id}
     */
    @PutMapping("/confirm/{id}")
    public ResponseEntity<?> confirmBooking(@PathVariable Long id) {

        // Log confirmation request
        logger.info("✅ PUT /api/admin/bookings/confirm/{} - confirmBooking() called", id);

        // Fetch booking by ID (throws exception if not found)
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Validate payment status before confirmation
        if (booking.getPaymentStatus() != PaymentStatus.SUCCESS) {

            // Log payment failure
            logger.warn(
                    "❌ Booking ID {} cannot be confirmed. Payment status: {}",
                    id,
                    booking.getPaymentStatus()
            );

            // Return 400 Bad Request
            return ResponseEntity.badRequest()
                    .body("Payment must be completed before confirming booking");
        }

        // Update booking status to CONFIRMED
        booking.setStatus(BookingStatus.CONFIRMED);

        // Save updated booking
        bookingRepository.save(booking);

        // Log success
        logger.info("✅ Booking ID {} confirmed successfully", id);

        // Return success response
        return ResponseEntity.ok("Booking confirmed");
    }

    /**
     * Cancel a booking
     * URL: /api/admin/bookings/cancel/{id}
     */
    @PutMapping("/cancel/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {

        // Log cancellation request
        logger.info("❌ PUT /api/admin/bookings/cancel/{} - cancelBooking() called", id);

        // Fetch booking by ID
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Update booking status to CANCELLED
        booking.setStatus(BookingStatus.CANCELLED);

        // Save updated booking
        bookingRepository.save(booking);

        // Log success
        logger.info("✅ Booking ID {} cancelled successfully", id);

        // Return success response
        return ResponseEntity.ok("Booking cancelled");
    }
}
