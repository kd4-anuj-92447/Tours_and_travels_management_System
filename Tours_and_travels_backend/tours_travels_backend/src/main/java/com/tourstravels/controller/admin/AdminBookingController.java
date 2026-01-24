package com.tourstravels.controller.admin;

import com.tourstravels.entity.Booking;
import com.tourstravels.enums.BookingStatus;
import com.tourstravels.service.BookingService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/bookings")
@PreAuthorize("hasRole('ADMIN')")
public class AdminBookingController {

    private final BookingService bookingService;

    public AdminBookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /* ================= ALL BOOKINGS ================= */

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getBookingsForAdmin();
    }

    /* ================= PENDING BOOKINGS ================= */

    @GetMapping("/pending")
    public List<Booking> getPendingBookings() {
        return bookingService.getBookingsForAdmin()
                .stream()
                .filter(b -> b.getStatus() == BookingStatus.AGENT_APPROVED)
                .toList();
    }

    /* ================= ADMIN DECISION ================= */

    @PutMapping("/{id}/decision")
    public Booking adminDecision(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        return bookingService.adminDecision(id, body.get("decision"));
    }
}
