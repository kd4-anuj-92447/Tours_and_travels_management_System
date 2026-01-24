package com.tourstravels.controller.customer;

import com.tourstravels.entity.Payment;
import com.tourstravels.entity.User;
import com.tourstravels.repository.PaymentRepository;
import com.tourstravels.repository.UserRepository;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/payments")
@PreAuthorize("hasRole('CUSTOMER')")
public class CustomerPaymentController {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    public CustomerPaymentController(
            PaymentRepository paymentRepository,
            UserRepository userRepository
    ) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Payment> getMyPayments(Authentication auth) {

        User customer = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return paymentRepository.findByBookingUser(customer);
    }
}
