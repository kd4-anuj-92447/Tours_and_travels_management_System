package com.tourstravels.service;

import java.util.List;
import com.tourstravels.entity.Booking;

public interface BookingService {

    // CUSTOMER
    List<Booking> getBookingsByUser(Long userId);
    Booking createBooking(Booking booking);

    // AGENT
    List<Booking> getBookingsForAgent(String agentEmail);
    Booking agentDecision(Long bookingId, String decision);

    // ADMIN
    List<Booking> getBookingsForAdmin();
    Booking adminDecision(Long bookingId, String decision);
    
    Booking cancelByCustomer(Long bookingId, Long customerId);
}
