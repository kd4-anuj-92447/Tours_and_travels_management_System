package com.tourstravels.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.tourstravels.entity.Booking;
import com.tourstravels.entity.User;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // CUSTOMER → My Bookings
    List<Booking> findByUserUserId(Long userId);

    // AGENT → Bookings for agent's packages
    List<Booking> findByTourPackageAgent(User agent);
}
