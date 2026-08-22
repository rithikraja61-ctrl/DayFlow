package com.DayFlow.service;

import com.DayFlow.dto.CreateEmployeeRequest;
import com.DayFlow.dto.CreateEmployeeResponse;
import com.DayFlow.model.Role;
import com.DayFlow.model.User;
import com.DayFlow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Year;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final LoginIdGeneratorService loginIdGenerator;

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
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .role(Role.EMPLOYEE)
                .company(hrUser.getCompany())
                .yearOfJoining(year)
                .mustChangePassword(true)
                .enabled(true)
                .build();

        userRepository.save(employee);

        return CreateEmployeeResponse.builder()
                .loginId(loginId)
                .email(employee.getEmail())
                .temporaryPassword(tempPassword)
                .message("Employee created successfully")
                .build();
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