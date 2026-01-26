package com.tourstravels.serviceImpl;

import com.tourstravels.entity.Booking;
import com.tourstravels.entity.TravelPackage;
import com.tourstravels.entity.User;
import com.tourstravels.enums.BookingStatus;
import com.tourstravels.enums.PackageStatus;
import com.tourstravels.enums.PaymentStatus;
import com.tourstravels.repository.BookingRepository;
import com.tourstravels.repository.PackageRepository;
import com.tourstravels.repository.UserRepository;
import com.tourstravels.service.BookingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingServiceImpl.class);

    private final BookingRepository bookingRepository;
    private final PackageRepository packageRepository;
    private final UserRepository userRepository;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            PackageRepository packageRepository,
            UserRepository userRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.packageRepository = packageRepository;
        this.userRepository = userRepository;
    }

    /* CUSTOMER */

    @Override
    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserUserId(userId);
    }

    @Override
    public Booking createBooking(Booking booking) {

        User customer = userRepository.findById(
                booking.getUser().getUserId()
        ).orElseThrow(() -> new RuntimeException("Customer not found"));

        TravelPackage travelPackage = packageRepository.findById(
                booking.getTourPackage().getId()
        ).orElseThrow(() -> new RuntimeException("Package not found"));

        if (travelPackage.getStatus() != PackageStatus.APPROVED) {
            throw new RuntimeException("Package not approved");
        }

        booking.setUser(customer);
        booking.setTourPackage(travelPackage);
        booking.setAmount(BigDecimal.valueOf(travelPackage.getPrice()));
        booking.setStatus(BookingStatus.PENDING);
        booking.setPaymentStatus(PaymentStatus.PENDING);  // Initially PENDING payment

        return bookingRepository.save(booking);
    }

    @Override
    public Booking cancelByCustomer(Long bookingId, Long customerId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getUserId().equals(customerId)) {
            throw new RuntimeException("Unauthorized cancellation");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only PENDING bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED_BY_CUSTOMER);
        return bookingRepository.save(booking);
    }

    /* AGENT */

    @Override
    public List<Booking> getBookingsForAgent(String agentEmail) {

        User agent = userRepository.findByEmail(agentEmail)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        return bookingRepository.findByTourPackageAgent(agent);
    }

    @Override
    public Booking agentDecision(Long bookingId, String decision) {
        throw new UnsupportedOperationException(
                "Agents cannot make booking decisions"
        );
    }

    /* ADMIN */

    @Override
    public List<Booking> getBookingsForAdmin() {
        logger.info("📅 getBookingsForAdmin() - Fetching all bookings with eager loading");
        List<Booking> bookings = bookingRepository.findAllWithDetails();
        logger.info("✅ Retrieved {} bookings", bookings.size());
        return bookings;
    }

    @Override
    public Booking adminDecision(Long bookingId, String decision) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        switch (decision.toUpperCase()) {
            case "CONFIRM":
                booking.setStatus(BookingStatus.CONFIRMED);
                break;
            case "CANCEL":
                booking.setStatus(BookingStatus.CANCELLED);
                break;
            default:
                throw new RuntimeException("Invalid admin decision");
        }

        return bookingRepository.save(booking);
    }
}
