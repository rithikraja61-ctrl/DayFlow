package com.DayFlow.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "login_id_sequences",
       uniqueConstraints = @UniqueConstraint(columnNames = {"company_id", "year"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoginIdSequence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false)
    private int year;

    @Column(nullable = false)
    private int lastSerial = 0;
}