package com.employee.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.backend.models.DirectorTable;
import com.employee.backend.models.InformationTable;;

public interface DirectorRepo extends JpaRepository<DirectorTable,  Long> {
    DirectorTable findByInformation(InformationTable information);
}