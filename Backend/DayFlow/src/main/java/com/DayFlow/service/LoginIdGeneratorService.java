package com.DayFlow.service;

import com.DayFlow.model.Company;
import com.DayFlow.model.LoginIdSequence;
import com.DayFlow.repository.LoginIdSequenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LoginIdGeneratorService {

    private final LoginIdSequenceRepository sequenceRepository;

    @Transactional
    public String generateLoginId(Company company, String firstName, String lastName, int year) {
        LoginIdSequence sequence = sequenceRepository
                .findByCompanyAndYear(company, year)
                .orElseGet(() -> sequenceRepository.save(
                        LoginIdSequence.builder().company(company).year(year).lastSerial(0).build()
                ));

        int nextSerial = sequence.getLastSerial() + 1;
        sequence.setLastSerial(nextSerial);
        sequenceRepository.save(sequence);

        String companyPrefix = extractPrefix(company.getName(), 2);
        String namePrefix = extractPrefix(firstName, 2) + extractPrefix(lastName, 2);
        String serialPart = String.format("%04d", nextSerial);

        return companyPrefix + namePrefix + year + serialPart;
    }

    private String extractPrefix(String value, int length) {
        if (value == null || value.isBlank()) {
            return "X".repeat(length);
        }
        String cleaned = value.replaceAll("[^a-zA-Z]", "").toUpperCase();
        if (cleaned.length() >= length) {
            return cleaned.substring(0, length);
        }
        return String.format("%-" + length + "s", cleaned).replace(' ', 'X').toUpperCase();
    }
}