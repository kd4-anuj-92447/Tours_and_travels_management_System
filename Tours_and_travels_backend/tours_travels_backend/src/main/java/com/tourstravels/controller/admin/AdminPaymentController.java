package com.tourstravels.controller.admin;

import com.tourstravels.entity.Payment;
import com.tourstravels.repository.PaymentRepository;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/payments")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPaymentController {

    private final PaymentRepository paymentRepository;

    public AdminPaymentController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    /* ================= ALL PAYMENTS ================= */

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    /* ================= GET PAYMENT BY ID ================= */

    @GetMapping("/{id}")
    public Payment getPaymentById(@PathVariable Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }
}
