package com.tourstravels.service;

import java.util.List;

import com.tourstravels.entity.User;

public interface AuthService {

	 User registerCustomer(User user);

	    User registerAgent(User user);

	    User getUserByEmail(String email);

	    List<User> getAllUsers();
}
