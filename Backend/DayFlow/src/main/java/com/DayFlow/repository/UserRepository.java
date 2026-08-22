package com.DayFlow.repository;

import com.DayFlow.model.Role;
import com.DayFlow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(String email);

    Optional<User> findByLoginIdIgnoreCase(String loginId);

    Optional<User> findByLoginIdIgnoreCaseOrEmailIgnoreCase(String loginId, String email);

    boolean existsByEmailIgnoreCase(String email);

    @Query("SELECT u FROM User u JOIN FETCH u.company WHERE u.loginId = :loginId")
    Optional<User> findByLoginIdWithCompany(@Param("loginId") String loginId);

    @Query("""
            SELECT u FROM User u
            WHERE u.company.id = :companyId AND u.role = :role
            AND (
                :search IS NULL OR :search = '' OR
                LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(u.loginId) LIKE LOWER(CONCAT('%', :search, '%'))
            )
            ORDER BY u.firstName ASC, u.lastName ASC
            """)
    List<User> findEmployeesByCompany(
            @Param("companyId") Long companyId,
            @Param("role") Role role,
            @Param("search") String search
    );
}
