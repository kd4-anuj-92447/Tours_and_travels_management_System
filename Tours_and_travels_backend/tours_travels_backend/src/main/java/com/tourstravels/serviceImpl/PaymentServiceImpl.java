package com.tourstravels.serviceImpl;

import com.tourstravels.entity.Booking;
import com.tourstravels.entity.Payment;
import com.tourstravels.entity.User;
import com.tourstravels.enums.BookingStatus;
import com.tourstravels.enums.PaymentStatus;
import com.tourstravels.repository.BookingRepository;
import com.tourstravels.repository.PaymentRepository;
import com.tourstravels.service.PaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Override
    public Payment createPayment(Long bookingId, Double amount, String paymentMode) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new RuntimeException("Payment allowed only for CONFIRMED bookings");
        }

        paymentRepository.findByBooking(booking).ifPresent(p -> {
            throw new RuntimeException("Payment already exists");
        });

        Payment payment = Payment.builder()
                .booking(booking)
                .status(PaymentStatus.SUCCESS)
                .build();

        return paymentRepository.save(payment);
    }

    @Override
    public Payment getPayment(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    @Override
    public List<Payment> getPaymentsByUser(User user) {
        return paymentRepository.findByBookingUser(user);
    }

    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    public Payment refundPayment(Long paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new RuntimeException("Only successful payments can be refunded");
        }

        payment.setStatus(PaymentStatus.REFUNDED);
        return paymentRepository.save(payment);
    }
}
