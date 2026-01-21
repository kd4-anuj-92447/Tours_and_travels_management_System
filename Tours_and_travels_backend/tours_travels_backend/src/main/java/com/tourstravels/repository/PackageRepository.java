package com.tourstravels.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tourstravels.entity.TravelPackage;

public interface PackageRepository extends JpaRepository<TravelPackage, Long> {
}
