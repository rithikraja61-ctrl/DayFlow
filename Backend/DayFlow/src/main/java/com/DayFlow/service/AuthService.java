package com.DayFlow.service;

import com.DayFlow.dto.*;
import com.DayFlow.model.Company;
import com.DayFlow.model.Role;
import com.DayFlow.model.User;
import com.DayFlow.repository.CompanyRepository;
import com.DayFlow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final LoginIdGeneratorService loginIdGenerator;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        Company company = companyRepository.save(
                Company.builder().name(request.getCompanyName()).build()
        );

        int year = Year.now().getValue();
        String loginId = loginIdGenerator.generateLoginId(
                company, request.getFirstName(), request.getLastName(), year
        );

        User user = User.builder()
                .loginId(loginId)
                .email(request.getEmail().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .role(Role.HR)
                .company(company)
                .yearOfJoining(year)
                .mustChangePassword(false)
                .enabled(true)
                .build();

        userRepository.save(user);

        return AuthResponse.builder()
                .loginId(loginId)
                .email(user.getEmail())
                .role(Role.HR)
                .companyName(company.getName())
                .message("Account created successfully")
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository
                .findByLoginIdIgnoreCaseOrEmailIgnoreCase(
                        request.getLoginIdOrEmail(),
                        request.getLoginIdOrEmail()
                )
                .orElseThrow(() -> new IllegalArgumentException("Invalid Login Id or Password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid Login Id or Password");
        }
        if (!user.isEnabled()) {
            throw new IllegalArgumentException("Account is disabled");
        }

        String token = jwtService.generateToken(user.getLoginId(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .loginId(user.getLoginId())
                .email(user.getEmail())
                .role(user.getRole())
                .companyName(user.getCompany().getName())
                .mustChangePassword(user.isMustChangePassword())
                .message("Login successful")
                .build();
    }
}