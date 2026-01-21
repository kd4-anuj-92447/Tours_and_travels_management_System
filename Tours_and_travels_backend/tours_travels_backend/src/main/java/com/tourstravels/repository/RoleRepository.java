package com.tourstravels.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tourstravels.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByRoleName(String roleName);
}
