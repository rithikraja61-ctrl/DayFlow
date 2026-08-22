package com.DayFlow.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmployeeSummaryResponse {
    private Long id;
    private String loginId;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
}
