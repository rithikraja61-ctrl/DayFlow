package com.DayFlow.repository;

import com.DayFlow.model.AttendanceRecord;
import com.DayFlow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<AttendanceRecord, Long> {

    Optional<AttendanceRecord> findByUserAndWorkDate(User user, LocalDate workDate);

    @Query("""
            SELECT a FROM AttendanceRecord a
            JOIN FETCH a.user u
            WHERE u.company.id = :companyId AND a.workDate = :workDate
            ORDER BY u.firstName ASC
            """)
    List<AttendanceRecord> findByCompanyAndDate(
            @Param("companyId") Long companyId,
            @Param("workDate") LocalDate workDate
    );
}
