package com.DayFlow.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateEmployeeResponse {
    private String loginId;
    private String email;
    private String temporaryPassword;
    private String message;
}