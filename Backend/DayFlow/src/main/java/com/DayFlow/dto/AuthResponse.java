package com.DayFlow.dto;

import com.DayFlow.model.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String loginId;
    private String email;
    private Role role;
    private String companyName;
    private boolean mustChangePassword;
    private String message;
}