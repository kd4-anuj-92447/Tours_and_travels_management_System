package com.tourstravels.service;

import java.util.List;
import com.tourstravels.entity.Booking;

/**
 * BookingService
 * ---------------
 * This interface defines all booking-related operations
 * for different user roles: Customer, Agent, and Admin.
 *
 * The implementation class will contain the actual business logic.
 */
public interface BookingService {

    /* ===================== CUSTOMER OPERATIONS ===================== */

    /**
     * Fetch all bookings made by a specific customer
     *
     * @param userId ID of the customer
     * @return list of bookings associated with the customer
     */
    List<Booking> getBookingsByUser(Long userId);

    /**
     * Create a new booking request by a customer
     *
     * @param booking booking details sent from frontend
     * @return saved booking entity
     */
    Booking createBooking(Booking booking);

    /**
     * Cancel a booking by the customer
     *
     * @param bookingId ID of the booking to be cancelled
     * @param customerId ID of the customer requesting cancellation
     * @return updated booking entity
     */
    Booking cancelByCustomer(Long bookingId, Long customerId);

    /* ===================== AGENT OPERATIONS ===================== */

    /**
     * Fetch all bookings assigned to an agent
     *
     * @param agentEmail email of the agent
     * @return list of bookings handled by the agent
     */
    List<Booking> getBookingsForAgent(String agentEmail);

    /**
     * Agent approves or rejects a booking request
     *
     * @param bookingId ID of the booking
     * @param decision agent decision (APPROVED / REJECTED)
     * @return updated booking entity
     */
    Booking agentDecision(Long bookingId, String decision);

    /* ===================== ADMIN OPERATIONS ===================== */

    /**
     * Fetch all bookings in the system (admin access)
     *
     * @return list of all bookings
     */
    List<Booking> getBookingsForAdmin();

    /**
     * Admin takes final decision on a booking
     *
     * @param bookingId ID of the booking
     * @param decision admin decision (CONFIRMED / CANCELLED)
     * @return updated booking entity
     */
    Booking adminDecision(Long bookingId, String decision);
}
