package com.tourstravels.repository;

import com.tourstravels.entity.User;
import com.tourstravels.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByRoleAndIsApprovedFalse(Role role);

    List<User> findByRoleAndIsApprovedTrue(Role role);
}
