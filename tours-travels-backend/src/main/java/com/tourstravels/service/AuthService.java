package com.tourstravels.service;

import com.tourstravels.dto.LoginRequest;
import com.tourstravels.dto.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}
