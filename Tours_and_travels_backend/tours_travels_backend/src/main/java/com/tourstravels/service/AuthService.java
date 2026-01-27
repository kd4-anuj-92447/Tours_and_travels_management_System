package com.tourstravels.service;

import java.util.List;

import com.tourstravels.entity.User;

public interface AuthService {

	User registerCustomer(User user);

	User registerAgent(User user);

	User registerAgentPending(User user);

	User getUserByEmail(String email);

	List<User> getAllUsers();

	List<User> getPendingAgents();

	List<User> getApprovedAgents();

	User approveAgent(Long agentId, String adminName);

	void rejectAgent(Long agentId);

	boolean emailExists(String email);
}
