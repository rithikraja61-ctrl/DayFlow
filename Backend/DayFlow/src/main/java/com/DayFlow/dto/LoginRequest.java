package com.DayFlow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Login ID or Email is required")
    private String loginIdOrEmail;

    @NotBlank(message = "Password is required")
    private String password;
}