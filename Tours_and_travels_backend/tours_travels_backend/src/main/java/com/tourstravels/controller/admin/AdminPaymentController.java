package com.tourstravels.controller.admin;

import com.tourstravels.entity.Payment;
import com.tourstravels.enums.PaymentStatus;
import com.tourstravels.repository.PaymentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AdminPaymentController
 * ----------------------
 * Handles all ADMIN operations related to payments:
 * - View all payments
 * - Confirm a payment
 * - Refund a payment
 * - View payment statistics
 */
@RestController // Marks this class as a REST controller
@RequestMapping("/api/admin/payments") // Base URL for admin payment APIs
@PreAuthorize("hasRole('ADMIN')") // Only ADMIN users can access
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend access (React/Vite)
public class AdminPaymentController {

    // Logger for monitoring API activity
    private static final Logger logger =
            LoggerFactory.getLogger(AdminPaymentController.class);

    // Repository to interact with Payment table
    private final PaymentRepository paymentRepository;

    // Constructor-based dependency injection
    public AdminPaymentController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    /**
     * Get all payments
     * URL: GET /api/admin/payments
     */
    @GetMapping
    public List<Payment> getAllPayments() {

        // Log API call
        logger.info("💳 GET /api/admin/payments - getAllPayments() called");

        // Fetch all payments from database
        List<Payment> payments = paymentRepository.findAll();

        // Log number of payments fetched
        logger.info("✅ Retrieved {} payments", payments.size());

        // Return list of payments
        return payments;
    }

    /**
     * Confirm a payment (mark as SUCCESS)
     * URL: PUT /api/admin/payments/confirm/{id}
     */
    @PutMapping("/confirm/{id}")
    public ResponseEntity<?> confirmPayment(@PathVariable Long id) {

        // Log confirmation request
        logger.info("✅ PUT /api/admin/payments/confirm/{} - confirmPayment() called", id);

        // Fetch payment by ID
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // Update payment status to SUCCESS
        payment.setStatus(PaymentStatus.SUCCESS);

        // Save updated payment
        paymentRepository.save(payment);

        // Log success
        logger.info("✅ Payment ID {} confirmed successfully", id);

        // Return success response
        return ResponseEntity.ok("Payment confirmed");
    }

    /**
     * Refund a payment (mark as REFUNDED)
     * URL: PUT /api/admin/payments/refund/{id}
     */
    @PutMapping("/refund/{id}")
    public ResponseEntity<?> refundPayment(@PathVariable Long id) {

        // Log refund request
        logger.info("💰 PUT /api/admin/payments/refund/{} - refundPayment() called", id);

        // Fetch payment by ID
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // Update payment status to REFUNDED
        payment.setStatus(PaymentStatus.REFUNDED);

        // Save updated payment
        paymentRepository.save(payment);

        // Log success
        logger.info("✅ Payment ID {} refunded successfully", id);

        // Return success response
        return ResponseEntity.ok("Payment refunded");
    }

    /**
     * Get payment statistics
     * URL: GET /api/admin/payments/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getPaymentStats() {

        // Log stats request
        logger.info("📊 GET /api/admin/payments/stats - getPaymentStats() called");

        // Fetch all payments
        List<Payment> allPayments = paymentRepository.findAll();

        // Count payments by status
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

        // Prepare stats response
        Map<String, Object> stats = new HashMap<>();
        stats.put("pendingPayments", pendingCount);
        stats.put("successPayments", successCount);
        stats.put("refundedPayments", refundedCount);
        stats.put("failedPayments", failedCount);
        stats.put("totalPayments", allPayments.size());

        // Log summary
        logger.info(
                "✅ Payment stats - Pending: {}, Success: {}, Refunded: {}, Failed: {}, Total: {}",
                pendingCount,
                successCount,
                refundedCount,
                failedCount,
                allPayments.size()
        );

        // Return stats as JSON
        return ResponseEntity.ok(stats);
    }
}
