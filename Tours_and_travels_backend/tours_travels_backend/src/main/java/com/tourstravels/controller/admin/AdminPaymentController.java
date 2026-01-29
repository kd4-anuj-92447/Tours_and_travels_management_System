// Package for admin-level controllers
package com.tourstravels.controller.admin;

// Importing Payment entity
import com.tourstravels.entity.Payment;

// Enum that represents different payment states (PENDING, SUCCESS, etc.)
import com.tourstravels.enums.PaymentStatus;

// Repository to perform DB operations on Payment table
import com.tourstravels.repository.PaymentRepository;

// Used to return HTTP responses with status codes
import org.springframework.http.ResponseEntity;

// Spring Security annotation for role-based access
import org.springframework.security.access.prepost.PreAuthorize;

// Spring MVC annotations
import org.springframework.web.bind.annotation.*;

// Logging support
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// Java utility classes
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// Marks this class as a REST controller (returns JSON responses)
@RestController

// Base URL for all payment-related admin APIs
@RequestMapping("/api/admin/payments")

// Restricts ALL APIs in this controller to ADMIN role
@PreAuthorize("hasRole('ADMIN')")

// Allows frontend requests from this origin (CORS)
@CrossOrigin(origins = "http://localhost:5173")
public class AdminPaymentController {

    // Logger instance for logging API activity
    private static final Logger logger =
            LoggerFactory.getLogger(AdminPaymentController.class);

    // Repository reference for database access
    private final PaymentRepository paymentRepository;

    // Constructor-based dependency injection
    public AdminPaymentController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    // Handles GET request to /api/admin/payments
    // Returns list of all payments
    @GetMapping
    public List<Payment> getAllPayments() {

        // Log API call
        logger.info("💳 GET /api/admin/payments - getAllPayments() called");

        // Fetch all payments from database
        List<Payment> payments = paymentRepository.findAll();

        // Log number of payments retrieved
        logger.info("✅ Retrieved {} payments", payments.size());

        // Return payments as JSON
        return payments;
    }

    // Handles PUT request to confirm a payment by ID
    // URL: /api/admin/payments/confirm/{id}
    @PutMapping("/confirm/{id}")
    public ResponseEntity<?> confirmPayment(@PathVariable Long id) {

        // Log confirmation attempt
        logger.info("✅ PUT /api/admin/payments/confirm/{} - confirmPayment() called", id);

        // Fetch payment by ID or throw exception if not found
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // Update payment status to SUCCESS
        payment.setStatus(PaymentStatus.SUCCESS);

        // Save updated payment to database
        paymentRepository.save(payment);

        // Log success
        logger.info("✅ Payment ID {} confirmed successfully", id);

        // Return success response
        return ResponseEntity.ok("Payment confirmed");
    }

    // Handles PUT request to refund a payment by ID
    // URL: /api/admin/payments/refund/{id}
    @PutMapping("/refund/{id}")
    public ResponseEntity<?> refundPayment(@PathVariable Long id) {

        // Log refund attempt
        logger.info("💰 PUT /api/admin/payments/refund/{} - refundPayment() called", id);

        // Fetch payment or throw exception if not found
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // Update payment status to REFUNDED
        payment.setStatus(PaymentStatus.REFUNDED);

        // Save changes to database
        paymentRepository.save(payment);

        // Log success
        logger.info("✅ Payment ID {} refunded successfully", id);

        // Return success response
        return ResponseEntity.ok("Payment refunded");
    }

    // Handles GET request to fetch payment statistics
    // URL: /api/admin/payments/stats
    @GetMapping("/stats")
    public ResponseEntity<?> getPaymentStats() {

        // Log stats request
        logger.info("📊 GET /api/admin/payments/stats - getPaymentStats() called");

        // Fetch all payments
        List<Payment> allPayments = paymentRepository.findAll();

        // Count payments based on their status
        long pendingCount = allPayments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.PENDING)
                .count();

        long successCount = allPayments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.SUCCESS)
                .count();

        long refundedCount = allPayments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.REFUNDED)
                .count();

        long failedCount = allPayments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.FAILED)
                .count();

        // Create a response map to send stats to frontend
        Map<String, Object> stats = new HashMap<>();
        stats.put("pendingPayments", pendingCount);
        stats.put("successPayments", successCount);
        stats.put("refundedPayments", refundedCount);
        stats.put("failedPayments", failedCount);
        stats.put("totalPayments", allPayments.size());

        // Log stats summary
        logger.info(
                "✅ Payment stats - Pending: {}, Success: {}, Refunded: {}, Failed: {}, Total: {}",
                pendingCount, successCount, refundedCount, failedCount, allPayments.size()
        );

        // Return stats as JSON
        return ResponseEntity.ok(stats);
    }
}
