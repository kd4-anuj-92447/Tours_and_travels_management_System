package com.tourstravels.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tourstravels.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {
}
