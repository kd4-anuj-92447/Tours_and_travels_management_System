package com.tourstravels.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.tourstravels.entity.TravelPackage;
import com.tourstravels.entity.User;
import com.tourstravels.enums.PackageStatus;

public interface PackageRepository extends JpaRepository<TravelPackage, Long> {

    List<TravelPackage> findByAgent(User agent);

    List<TravelPackage> findByStatus(PackageStatus status);
}

