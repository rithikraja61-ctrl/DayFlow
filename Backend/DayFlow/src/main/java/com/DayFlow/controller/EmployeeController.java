package com.DayFlow.controller;

import com.DayFlow.dto.CreateEmployeeRequest;
import com.DayFlow.dto.CreateEmployeeResponse;
import com.DayFlow.dto.EmployeeListResponse;
import com.DayFlow.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<EmployeeListResponse> listEmployees(
            @RequestParam(required = false) String search,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(employeeService.listEmployees(userDetails.getUsername(), search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<com.DayFlow.dto.EmployeeSummaryResponse> getEmployee(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(employeeService.getEmployee(userDetails.getUsername(), id));
    }

    @PostMapping
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<CreateEmployeeResponse> createEmployee(
            @Valid @RequestBody CreateEmployeeRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(employeeService.createEmployee(request, userDetails.getUsername()));
    }
}
