package com.tourstravels.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import com.tourstravels.entity.Booking;
import com.tourstravels.entity.User;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // CUSTOMER → My Bookings
    List<Booking> findByUserUserId(Long userId);

    // AGENT → Bookings for agent's packages
    List<Booking> findByTourPackageAgent(User agent);

	List<Booking> findBookingsByAgentId(Long agentId);

    // ADMIN → All bookings with eager loading
    @Query("SELECT DISTINCT b FROM Booking b LEFT JOIN FETCH b.user LEFT JOIN FETCH b.tourPackage tp LEFT JOIN FETCH tp.agent")
    List<Booking> findAllWithDetails();
}
