package com.tourstravels.controller.customer;

import com.tourstravels.entity.Payment;
import com.tourstravels.entity.Booking;
import com.tourstravels.entity.User;
import com.tourstravels.repository.PaymentRepository;
import com.tourstravels.repository.UserRepository;
import com.tourstravels.repository.BookingRepository;
import com.tourstravels.enums.BookingStatus;
import com.tourstravels.enums.PaymentStatus;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/customer/payments")
@PreAuthorize("hasRole('CUSTOMER')")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerPaymentController {

    private static final Logger logger = LoggerFactory.getLogger(CustomerPaymentController.class);
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public CustomerPaymentController(
            PaymentRepository paymentRepository,
            UserRepository userRepository,
            BookingRepository bookingRepository
    ) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    @GetMapping
    public List<Payment> getMyPayments(Authentication auth) {
        logger.info("📊 GET /api/customer/payments - getMyPayments() called");
        User customer = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Payment> payments = paymentRepository.findByBookingUser(customer);
        logger.info("✅ Retrieved {} payments for customer {}", payments.size(), customer.getEmail());
        return payments;
    }

    @PostMapping
    public ResponseEntity<?> createPayment(
            @RequestBody Map<String, Object> paymentRequest,
            Authentication auth) {
        
        logger.info("💳 POST /api/customer/payments - createPayment() called");
        
        User customer = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Extract bookingId from request
        Long bookingId = null;
        if (paymentRequest.get("bookingId") instanceof Number) {
            bookingId = ((Number) paymentRequest.get("bookingId")).longValue();
        }
        
        if (bookingId == null) {
            logger.error("❌ Missing bookingId in payment request");
            return ResponseEntity.badRequest().body("Booking ID is required");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Verify booking belongs to customer
        if (!booking.getUser().getUserId().equals(customer.getUserId())) {
            logger.error("❌ Customer {} trying to pay for booking not owned by them", customer.getEmail());
            return ResponseEntity.status(403).body("Unauthorized access to booking");
        }

        // Check if payment already exists for this booking to avoid duplicate entry
        Optional<Payment> existingPaymentOpt = paymentRepository.findByBooking(booking);
        if (existingPaymentOpt.isPresent()) {
            Payment existing = existingPaymentOpt.get();
            logger.info("⏭️ Payment already exists for Booking ID: {}. Returning existing payment.", bookingId);
            return ResponseEntity.ok(Map.of(
                    "paymentId", existing.getId(),
                    "status", existing.getStatus().name(),
                    "bookingId", bookingId
            ));
        }

        // Create payment - ALWAYS SUCCESSFUL FOR NOW
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setStatus(PaymentStatus.SUCCESS);  // Always mark as SUCCESS
        
        Payment savedPayment = paymentRepository.save(payment);
        
        // Update booking payment status to SUCCESS (Booking status stays PENDING for admin approval)
        booking.setPaymentStatus(PaymentStatus.SUCCESS);
        // Auto-confirm booking after successful payment
        if (booking.getStatus() == BookingStatus.PENDING
                || booking.getStatus() == BookingStatus.AGENT_APPROVED) {
            booking.setStatus(BookingStatus.CONFIRMED);
        }
        bookingRepository.save(booking);
        
        logger.info("✅ Payment created successfully. Booking ID: {} - Payment: SUCCESS, Booking Status: {} (awaiting admin confirmation)", 
                    bookingId, booking.getStatus());
        return ResponseEntity.ok(Map.of(
                "paymentId", savedPayment.getId(),
                "status", savedPayment.getStatus().name(),
                "bookingId", bookingId
        ));
    }
}
