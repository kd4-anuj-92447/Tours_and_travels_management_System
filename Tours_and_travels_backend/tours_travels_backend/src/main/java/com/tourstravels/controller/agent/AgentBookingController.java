package com.tourstravels.controller.agent;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Map;

import com.tourstravels.entity.Booking;
import com.tourstravels.repository.BookingRepository;
import com.tourstravels.service.BookingService;

@RestController
@RequestMapping("/api/agent/bookings")
@PreAuthorize("hasRole('AGENT')")
public class AgentBookingController {

    private final BookingRepository bookingRepository;

    public AgentBookingController(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @GetMapping("/{agentId}")
    public List<Booking> getBookingsForAgent(@PathVariable Long agentId) {
        return bookingRepository.findBookingsByAgentId(agentId);
    }
}
