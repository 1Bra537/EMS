package com.employee.backend.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.backend.models.EmployeeTable;
import com.employee.backend.models.InformationTable;

public interface EmployeeRepo extends JpaRepository<EmployeeTable,  Long> {
    List<EmployeeTable> findByCompanies_Id(Long CompanyID);
    EmployeeTable findByInformation(InformationTable information);
}