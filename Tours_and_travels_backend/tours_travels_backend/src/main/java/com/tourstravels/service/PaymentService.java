package com.tourstravels.service;

import com.tourstravels.entity.Payment;
import com.tourstravels.entity.User;

import java.util.List;

public interface PaymentService {

    Payment createPayment(Long bookingId, Double amount, String paymentMode);

    Payment getPayment(Long paymentId);

    List<Payment> getPaymentsByUser(User user);

    List<Payment> getAllPayments();

    Payment confirmPayment(Long paymentId);

    Payment refundPayment(Long paymentId);
}
