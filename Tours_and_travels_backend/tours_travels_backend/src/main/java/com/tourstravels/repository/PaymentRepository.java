package com.tourstravels.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tourstravels.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
