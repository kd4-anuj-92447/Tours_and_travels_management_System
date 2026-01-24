package com.tourstravels.serviceImpl;

import com.tourstravels.entity.Booking;
import com.tourstravels.entity.User;
import com.tourstravels.repository.BookingRepository;
import com.tourstravels.repository.UserRepository;
import com.tourstravels.service.BookingService;
import com.tourstravels.enums.BookingStatus;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    /* ================= CUSTOMER ================= */

    @Override
    public Booking createBooking(Booking booking) {
    	booking.setStatus(BookingStatus.PENDING);

        booking.setBookingDate(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserUserId(userId);
    }

    /* ================= AGENT ================= */

    @Override
    public List<Booking> getBookingsForAgent(String agentEmail) {

        User agent = userRepository.findByEmail(agentEmail)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        return bookingRepository.findByTourPackageAgent(agent);
    }

    @Override
    public Booking agentDecision(Long bookingId, String decision) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Guard: agent can act only on fresh bookings
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking already processed");
        }

        if ("APPROVE".equalsIgnoreCase(decision)) {
            booking.setStatus(BookingStatus.AGENT_APPROVED);
        } else if ("REJECT".equalsIgnoreCase(decision)) {
            booking.setStatus(BookingStatus.AGENT_REJECTED);
        }


        return bookingRepository.save(booking);
    }

    /* ================= ADMIN ================= */

    @Override
    public List<Booking> getBookingsForAdmin() {
        return bookingRepository.findAll();
    }

    @Override
    public Booking adminDecision(Long bookingId, String decision) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Guard: admin acts only after agent approval
        if (booking.getStatus() != BookingStatus.AGENT_APPROVED) {
            throw new RuntimeException("Booking not ready for admin action");
        }

        if ("CONFIRM".equalsIgnoreCase(decision)) {
            booking.setStatus(BookingStatus.CONFIRMED);
        } else if ("CANCEL".equalsIgnoreCase(decision)) {
            booking.setStatus(BookingStatus.CANCELLED);
        }


        return bookingRepository.save(booking);
    }
    
    @Override
    public Booking cancelByCustomer(Long bookingId, Long customerId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Ownership check
        if (!booking.getUser().getUserId().equals(customerId)) {
            throw new RuntimeException("Unauthorized cancellation attempt");
        }

        // Status guard
        if (
        	    booking.getStatus() != BookingStatus.PENDING &&
        	    booking.getStatus() != BookingStatus.AGENT_APPROVED
        	) {
        	    throw new RuntimeException("Booking cannot be cancelled");
        	}

        	booking.setStatus(BookingStatus.CANCELLED_BY_CUSTOMER);

        return bookingRepository.save(booking);
    }

}
