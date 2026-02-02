package com.tourstravels.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Marks this class as a Spring-managed component
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // Utility class for JWT related operations (extracting & validating token)
    private final JwtUtil jwtUtil;

    // Service to load user details from database
    private final UserDetailsService userDetailsService;

    // Constructor for dependency injection
    public JwtAuthenticationFilter(
            JwtUtil jwtUtil,
            UserDetailsService userDetailsService
    ) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    // This method runs once for every incoming HTTP request
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Get Authorization header from the request
        String authHeader = request.getHeader("Authorization");

        // Check if Authorization header is present and starts with "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            // Extract JWT token by removing "Bearer " prefix
            String token = authHeader.substring(7);

            // Extract email (username) from the JWT token
            String email = jwtUtil.extractUsername(token);

            // Continue only if email is valid and user is not already authenticated
            if (email != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

                // Load user details using email
                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(email);

                // Validate the token against user details
                if (jwtUtil.validateToken(token, userDetails)) {

                    // Create authentication token for Spring Security
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, // authenticated user
                                    null,        // credentials not required
                                    userDetails.getAuthorities() // user roles
                            );

                    // Attach request-related details to authentication object
                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    // Set authentication in Spring Security context
                    SecurityContextHolder.getContext()
                            .setAuthentication(authentication);
                }
            }
        }

        // Pass request and response to the next filter in the chain
        filterChain.doFilter(request, response);
    }
}
