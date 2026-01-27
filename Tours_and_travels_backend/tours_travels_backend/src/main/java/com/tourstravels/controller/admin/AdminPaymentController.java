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

@RestController
@RequestMapping("/api/admin/payments")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminPaymentController {

    private static final Logger logger = LoggerFactory.getLogger(AdminPaymentController.class);
    private final PaymentRepository paymentRepository;

    public AdminPaymentController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @GetMapping
    public List<Payment> getAllPayments() {
        logger.info("💳 GET /api/admin/payments - getAllPayments() called");
        List<Payment> payments = paymentRepository.findAll();
        logger.info("✅ Retrieved {} payments", payments.size());
        return payments;
    }

    @PutMapping("/confirm/{id}")
    public ResponseEntity<?> confirmPayment(@PathVariable Long id) {
        logger.info("✅ PUT /api/admin/payments/confirm/{} - confirmPayment() called", id);
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setStatus(PaymentStatus.SUCCESS);
        paymentRepository.save(payment);
        logger.info("✅ Payment ID {} confirmed successfully", id);
        return ResponseEntity.ok("Payment confirmed");
    }

    @PutMapping("/refund/{id}")
    public ResponseEntity<?> refundPayment(@PathVariable Long id) {
        logger.info("💰 PUT /api/admin/payments/refund/{} - refundPayment() called", id);
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setStatus(PaymentStatus.REFUNDED);
        paymentRepository.save(payment);
        logger.info("✅ Payment ID {} refunded successfully", id);
        return ResponseEntity.ok("Payment refunded");
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getPaymentStats() {
        logger.info("📊 GET /api/admin/payments/stats - getPaymentStats() called");
        List<Payment> allPayments = paymentRepository.findAll();
        
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
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("pendingPayments", pendingCount);
        stats.put("successPayments", successCount);
        stats.put("refundedPayments", refundedCount);
        stats.put("failedPayments", failedCount);
        stats.put("totalPayments", allPayments.size());
        
        logger.info("✅ Payment stats - Pending: {}, Success: {}, Refunded: {}, Failed: {}, Total: {}", 
                pendingCount, successCount, refundedCount, failedCount, allPayments.size());
        
        return ResponseEntity.ok(stats);
    }
}


