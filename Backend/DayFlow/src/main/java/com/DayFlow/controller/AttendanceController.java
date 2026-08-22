package com.DayFlow.controller;

import com.DayFlow.dto.AttendanceResponse;
import com.DayFlow.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/clock-in")
    public ResponseEntity<AttendanceResponse> clockIn(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(attendanceService.clockIn(user.getUsername()));
    }

    @PostMapping("/clock-out")
    public ResponseEntity<AttendanceResponse> clockOut(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(attendanceService.clockOut(user.getUsername()));
    }

    @GetMapping("/today")
    public ResponseEntity<AttendanceResponse> today(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(attendanceService.todayStatus(user.getUsername()));
    }

    @GetMapping("/company/today")
    public ResponseEntity<Map<String, Object>> companyToday(@AuthenticationPrincipal UserDetails user) {
        List<AttendanceResponse> records = attendanceService.companyToday(user.getUsername());
        return ResponseEntity.ok(Map.of("records", records, "total", records.size()));
    }
}
