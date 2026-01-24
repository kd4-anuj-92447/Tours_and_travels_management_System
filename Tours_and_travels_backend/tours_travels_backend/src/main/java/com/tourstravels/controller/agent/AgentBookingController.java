package com.tourstravels.controller.agent;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Map;

import com.tourstravels.entity.Booking;
import com.tourstravels.service.BookingService;

@RestController
@RequestMapping("/api/agent/bookings")
@PreAuthorize("hasRole('AGENT')")
public class AgentBookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public List<Booking> getAgentBookings(Authentication auth) {
        return bookingService.getBookingsForAgent(auth.getName());
    }

    @PutMapping("/{id}/decision")
    public Booking agentDecision(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        return bookingService.agentDecision(id, body.get("decision"));
    }
}

