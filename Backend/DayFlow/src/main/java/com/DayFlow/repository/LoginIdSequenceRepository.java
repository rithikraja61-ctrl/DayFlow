package com.DayFlow.repository;

import com.DayFlow.model.Company;
import com.DayFlow.model.LoginIdSequence;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.util.Optional;

public interface LoginIdSequenceRepository extends JpaRepository<LoginIdSequence, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<LoginIdSequence> findByCompanyAndYear(Company company, int year);
}