package com.DayFlow.controller;

import com.DayFlow.dto.CreateEmployeeRequest;
import com.DayFlow.dto.CreateEmployeeResponse;
import com.DayFlow.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<CreateEmployeeResponse> createEmployee(
            @Valid @RequestBody CreateEmployeeRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(employeeService.createEmployee(request, userDetails.getUsername()));
    }
}