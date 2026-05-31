package com.employee.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.backend.RequestBodies.Applicant;
import com.employee.backend.models.ApplicantTable;
import com.employee.backend.models.CompanyTable;
import com.employee.backend.models.EmployeeTable;

public interface ApplicantRepo extends JpaRepository<ApplicantTable, Long> {
    List<Applicant> findByCompany(CompanyTable company); 
    List<ApplicantTable> findByEmployee(EmployeeTable employee);
    ApplicantTable findByEmployeeAndCompany(EmployeeTable employee, CompanyTable company);
}
