package com.employee.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.backend.models.InformationTable;

public interface InfoRepo extends JpaRepository<InformationTable,  Long> {
    InformationTable findByEmail(String email);
}