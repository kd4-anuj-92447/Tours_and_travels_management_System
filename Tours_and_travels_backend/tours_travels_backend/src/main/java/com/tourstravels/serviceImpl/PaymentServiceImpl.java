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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentServiceImpl.class);

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
        logger.info("💳 getAllPayments() - Fetching all payments with eager loading");
        List<Payment> payments = paymentRepository.findAllWithDetails();
        logger.info("✅ Retrieved {} payments", payments.size());
        return payments;
    }

    @Override
    public Payment confirmPayment(Long paymentId) {
        logger.info("✅ Confirming payment ID: {}", paymentId);
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new RuntimeException("Only PENDING payments can be confirmed");
        }

        payment.setStatus(PaymentStatus.SUCCESS);
        logger.info("✅ Payment {} confirmed successfully", paymentId);
        return paymentRepository.save(payment);
    }

    @Override
    public Payment refundPayment(Long paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new RuntimeException("Only successful payments can be refunded");
        }

        logger.info("💰 Refunding payment ID: {}", paymentId);
        payment.setStatus(PaymentStatus.REFUNDED);
        logger.info("✅ Payment {} refunded successfully", paymentId);
        return paymentRepository.save(payment);
    }
}
