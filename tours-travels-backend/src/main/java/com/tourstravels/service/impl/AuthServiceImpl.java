package com.tourstravels.service.impl;

import com.tourstravels.dto.LoginRequest;
import com.tourstravels.dto.LoginResponse;
import com.tourstravels.entity.User;
import com.tourstravels.repository.UserRepository;
import com.tourstravels.service.AuthService;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    public AuthServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return new LoginResponse(
                user.getUserId(),
                user.getName(),
                user.getRole().getRoleName()
        );
    }
}
