package com.DayFlow.service;

import com.DayFlow.dto.AttendanceResponse;
import com.DayFlow.model.AttendanceRecord;
import com.DayFlow.model.AttendanceStatus;
import com.DayFlow.model.Role;
import com.DayFlow.model.User;
import com.DayFlow.repository.AttendanceRepository;
import com.DayFlow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    @Transactional
    public AttendanceResponse clockIn(String loginId) {
        User user = requireUser(loginId);
        LocalDate today = LocalDate.now();
        AttendanceRecord record = attendanceRepository.findByUserAndWorkDate(user, today)
                .orElseGet(() -> AttendanceRecord.builder()
                        .user(user)
                        .workDate(today)
                        .status(AttendanceStatus.ABSENT)
                        .build());

        if (record.getClockInAt() != null && record.getClockOutAt() == null) {
            throw new IllegalArgumentException("Already clocked in");
        }

        record.setClockInAt(LocalDateTime.now());
        record.setClockOutAt(null);
        record.setStatus(AttendanceStatus.PRESENT);
        attendanceRepository.save(record);
        return toResponse(record, "Clocked in successfully");
    }

    @Transactional
    public AttendanceResponse clockOut(String loginId) {
        User user = requireUser(loginId);
        LocalDate today = LocalDate.now();
        AttendanceRecord record = attendanceRepository.findByUserAndWorkDate(user, today)
                .orElseThrow(() -> new IllegalArgumentException("You have not clocked in today"));

        if (record.getClockInAt() == null) {
            throw new IllegalArgumentException("You have not clocked in today");
        }
        if (record.getClockOutAt() != null) {
            throw new IllegalArgumentException("Already clocked out");
        }

        record.setClockOutAt(LocalDateTime.now());
        attendanceRepository.save(record);
        return toResponse(record, "Clocked out successfully");
    }

    @Transactional(readOnly = true)
    public AttendanceResponse todayStatus(String loginId) {
        User user = requireUser(loginId);
        return attendanceRepository.findByUserAndWorkDate(user, LocalDate.now())
                .map(r -> toResponse(r, "Today's attendance"))
                .orElse(AttendanceResponse.builder()
                        .userId(user.getId())
                        .loginId(user.getLoginId())
                        .fullName(fullName(user))
                        .status(AttendanceStatus.ABSENT)
                        .message("Not clocked in today")
                        .build());
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponse> companyToday(String loginId) {
        User actor = requireUser(loginId);
        if (actor.getRole() != Role.HR) {
            throw new IllegalArgumentException("Only HR can view company attendance");
        }
        return attendanceRepository
                .findByCompanyAndDate(actor.getCompany().getId(), LocalDate.now())
                .stream()
                .map(r -> toResponse(r, null))
                .toList();
    }

    @Transactional(readOnly = true)
    public AttendanceStatus statusForUserToday(User user) {
        return attendanceRepository.findByUserAndWorkDate(user, LocalDate.now())
                .map(AttendanceRecord::getStatus)
                .orElse(AttendanceStatus.ABSENT);
    }

    private User requireUser(String loginId) {
        return userRepository.findByLoginIdWithCompany(loginId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private AttendanceResponse toResponse(AttendanceRecord record, String message) {
        User user = record.getUser();
        return AttendanceResponse.builder()
                .id(record.getId())
                .userId(user.getId())
                .loginId(user.getLoginId())
                .fullName(fullName(user))
                .status(record.getStatus())
                .clockInAt(record.getClockInAt())
                .clockOutAt(record.getClockOutAt())
                .message(message)
                .build();
    }

    private String fullName(User user) {
        return (user.getFirstName() + " " + user.getLastName()).trim();
    }
}
