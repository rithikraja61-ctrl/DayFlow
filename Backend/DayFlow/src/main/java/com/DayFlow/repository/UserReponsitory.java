package com.DayFlow.repository;

import com.DayFlow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(String email);

    Optional<User> findByLoginIdIgnoreCase(String loginId);

    Optional<User> findByLoginIdIgnoreCaseOrEmailIgnoreCase(String loginId, String email);

    boolean existsByEmailIgnoreCase(String email);

    @Query("SELECT u FROM User u JOIN FETCH u.company WHERE u.loginId = :loginId")
    Optional<User> findByLoginIdWithCompany(@Param("loginId") String loginId);
}