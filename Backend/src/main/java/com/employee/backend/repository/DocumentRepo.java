package com.employee.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.backend.models.CompanyTable;
import com.employee.backend.models.DocumentTable;

public interface DocumentRepo extends JpaRepository<DocumentTable, Long>{
    List<DocumentTable> findByCompany(CompanyTable Company); // fetching record based on companyID foreign field 
}
