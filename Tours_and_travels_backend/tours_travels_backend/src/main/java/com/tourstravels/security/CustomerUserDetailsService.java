package com.tourstravels.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.tourstravels.entity.User;
import com.tourstravels.repository.UserRepository;

import lombok.RequiredArgsConstructor;

// Marks this class as a Spring service component
@Service
// Generates constructor for all final fields (constructor injection)
@RequiredArgsConstructor
public class CustomerUserDetailsService implements UserDetailsService {

    // Repository used to fetch user details from the database
    private final UserRepository userRepository;

    // This method is called automatically by Spring Security during authentication
    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        // Fetch user from database using email
        // If user is not found, throw UsernameNotFoundException
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found with email: " + email
                        )
                );

        // Convert custom User entity into Spring Security UserDetails object
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())   // Set username (email)
                .password(user.getPassword())    // Encrypted password (BCrypt hash)
                .authorities("ROLE_" + user.getRole().getRoleName()) // Assign role
                .build();
    }
}
