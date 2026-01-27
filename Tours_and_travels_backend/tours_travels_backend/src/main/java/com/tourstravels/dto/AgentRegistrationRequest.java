package com.tourstravels.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgentRegistrationRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String address;
    private String companyName;
    private String licenseNumber;
}
