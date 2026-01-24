package com.tourstravels.serviceImpl;

import com.tourstravels.entity.Booking;
import com.tourstravels.entity.Payment;
import com.tourstravels.entity.User;
import com.tourstravels.enums.PaymentStatus;
import com.tourstravels.repository.BookingRepository;
import com.tourstravels.repository.PaymentRepository;
import com.tourstravels.service.PaymentService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentServiceImpl(
            PaymentRepository paymentRepository,
            BookingRepository bookingRepository
    ) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    /* ================= CREATE PAYMENT ================= */

    @Override
    public Payment createPayment(Long bookingId, Double amount, String paymentMode) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Prevent duplicate payment for same booking
        if (paymentRepository.findByBooking(booking).isPresent()) {
            throw new RuntimeException("Payment already exists for this booking");
        }

        Payment payment = Payment.builder()
                .booking(booking)
                .amount(amount)
                .paymentMode(paymentMode)
                .paymentStatus(PaymentStatus.SUCCESS)
                .paymentDate(LocalDateTime.now())
                .build();

        return paymentRepository.save(payment);
    }

    /* ================= GET SINGLE PAYMENT ================= */

    @Override
    public Payment getPayment(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    /* ================= CUSTOMER ================= */

    @Override
    public List<Payment> getPaymentsByUser(User user) {
        return paymentRepository.findByBookingUser(user);
    }

    /* ================= ADMIN ================= */

    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    public Payment refundPayment(Long paymentId) {

        Payment payment = getPayment(paymentId);

        if (payment.getPaymentStatus() != PaymentStatus.SUCCESS) {
            throw new RuntimeException("Only successful payments can be refunded");
        }

        payment.setPaymentStatus(PaymentStatus.REFUNDED);
        return paymentRepository.save(payment);
    }
}
