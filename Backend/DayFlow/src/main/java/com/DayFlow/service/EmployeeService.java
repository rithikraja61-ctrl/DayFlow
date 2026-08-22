package com.DayFlow.service;

import com.DayFlow.dto.CreateEmployeeRequest;
import com.DayFlow.dto.CreateEmployeeResponse;
import com.DayFlow.dto.EmployeeListResponse;
import com.DayFlow.dto.EmployeeSummaryResponse;
import com.DayFlow.model.Role;
import com.DayFlow.model.User;
import com.DayFlow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Year;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final LoginIdGeneratorService loginIdGenerator;

    @Transactional(readOnly = true)
    public EmployeeListResponse listEmployees(String hrLoginId, String search) {
        User hrUser = userRepository.findByLoginIdWithCompany(hrLoginId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (hrUser.getRole() != Role.HR) {
            throw new IllegalArgumentException("Only HR can view employees");
        }

        String searchTerm = search == null ? "" : search.trim();
        List<EmployeeSummaryResponse> employees = userRepository
                .findEmployeesByCompany(hrUser.getCompany().getId(), Role.EMPLOYEE, searchTerm)
                .stream()
                .map(this::toSummary)
                .toList();

        return new EmployeeListResponse(employees, employees.size());
    }

    @Transactional
    public CreateEmployeeResponse createEmployee(CreateEmployeeRequest request, String hrLoginId) {
        User hrUser = userRepository.findByLoginIdWithCompany(hrLoginId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (hrUser.getRole() != Role.HR) {
            throw new IllegalArgumentException("Only HR can create employees");
        }
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        int year = Year.now().getValue();
        String loginId = loginIdGenerator.generateLoginId(
                hrUser.getCompany(),
                request.getFirstName(),
                request.getLastName(),
                year
        );

        String tempPassword = generateTemporaryPassword();

        User employee = User.builder()
                .loginId(loginId)
                .email(request.getEmail().toLowerCase())
                .password(passwordEncoder.encode(tempPassword))
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .phone(request.getPhone().trim())
                .role(Role.EMPLOYEE)
                .company(hrUser.getCompany())
                .yearOfJoining(year)
                .mustChangePassword(true)
                .enabled(true)
                .build();

        userRepository.save(employee);

        return CreateEmployeeResponse.builder()
                .id(employee.getId())
                .loginId(loginId)
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .fullName(fullName(employee))
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .temporaryPassword(tempPassword)
                .message("Employee created successfully")
                .build();
    }

    private EmployeeSummaryResponse toSummary(User user) {
        return EmployeeSummaryResponse.builder()
                .id(user.getId())
                .loginId(user.getLoginId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(fullName(user))
                .email(user.getEmail())
                .phone(user.getPhone())
                .build();
    }

    private String fullName(User user) {
        return (user.getFirstName() + " " + user.getLastName()).trim();
    }

    private String generateTemporaryPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 12; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
