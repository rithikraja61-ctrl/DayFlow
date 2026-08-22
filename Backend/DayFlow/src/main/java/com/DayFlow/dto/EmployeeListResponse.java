package com.DayFlow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class EmployeeListResponse {
    private List<EmployeeSummaryResponse> employees;
    private int total;
}
