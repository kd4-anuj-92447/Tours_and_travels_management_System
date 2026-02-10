package com.tourstravels.controller.agent;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

import com.tourstravels.entity.Booking;
import com.tourstravels.entity.User;
import com.tourstravels.enums.BookingStatus;
import com.tourstravels.repository.BookingRepository;
import com.tourstravels.repository.UserRepository;

@RestController
@RequestMapping("/api/agent/bookings")
@PreAuthorize("hasRole('AGENT')")
@CrossOrigin(origins = "http://localhost:5173")
public class AgentBookingController {

    private static final Logger logger = LoggerFactory.getLogger(AgentBookingController.class);
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public AgentBookingController(
            BookingRepository bookingRepository,
            UserRepository userRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }
//get all bookings
    @GetMapping
    public List<Booking> getMyBookings(Authentication auth) {

        logger.info("📋 GET /api/agent/bookings - getMyBookings() called");

        User agent = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        List<Booking> bookings =
                bookingRepository.findByTourPackageAgentUserId(agent.getUserId());

        logger.info("✅ Retrieved {} bookings for agent {}", 
                bookings.size(), agent.getEmail());

        return bookings;
    }

    @PutMapping("/{bookingId}/approve")
    public ResponseEntity<?> approveBooking(
            @PathVariable Long bookingId,
            Authentication auth) {
        
        logger.info("✅ PUT /api/agent/bookings/{}/approve - approveBooking() called", bookingId);
        User agent = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Verify booking belongs to agent's package
        if (!booking.getTourPackage().getAgent().getUserId().equals(agent.getUserId())) {
            logger.error("❌ Agent {} trying to approve booking not owned by them", agent.getEmail());
            return ResponseEntity.status(403).body("Unauthorized");
        }

        booking.setStatus(BookingStatus.AGENT_APPROVED);
        bookingRepository.save(booking);
        logger.info("✅ Booking ID {} approved by agent", bookingId);
        return ResponseEntity.ok(booking);
    }

    @PutMapping("/{bookingId}/reject")
    public ResponseEntity<?> rejectBooking(
            @PathVariable Long bookingId,
            Authentication auth) {
        
        logger.info("❌ PUT /api/agent/bookings/{}/reject - rejectBooking() called", bookingId);
        User agent = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Verify booking belongs to agent's package
        if (!booking.getTourPackage().getAgent().getUserId().equals(agent.getUserId())) {
            logger.error("❌ Agent {} trying to reject booking not owned by them", agent.getEmail());
            return ResponseEntity.status(403).body("Unauthorized");
        }

        booking.setStatus(BookingStatus.AGENT_REJECTED);
        bookingRepository.save(booking);
        logger.info("✅ Booking ID {} rejected by agent", bookingId);
        return ResponseEntity.ok(booking);
    }
}
