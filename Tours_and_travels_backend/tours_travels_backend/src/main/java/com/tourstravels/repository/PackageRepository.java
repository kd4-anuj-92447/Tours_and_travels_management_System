package com.tourstravels.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import com.tourstravels.entity.TravelPackage;
import com.tourstravels.entity.User;
import com.tourstravels.enums.PackageStatus;

public interface PackageRepository extends JpaRepository<TravelPackage, Long> {

    List<TravelPackage> findByAgent(User agent);

    @Query("SELECT DISTINCT p FROM TravelPackage p LEFT JOIN FETCH p.agent WHERE p.status = :status")
    List<TravelPackage> findByStatus(PackageStatus status);

    // ADMIN → All packages with eager loading of agent
    @Query("SELECT DISTINCT p FROM TravelPackage p LEFT JOIN FETCH p.agent")
    List<TravelPackage> findAllWithDetails();
}

