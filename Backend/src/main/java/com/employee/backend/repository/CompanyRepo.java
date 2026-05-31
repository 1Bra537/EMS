package com.employee.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.backend.RequestBodies.companyList;
import com.employee.backend.models.CompanyTable;

public interface CompanyRepo extends JpaRepository<CompanyTable, Long>{
    List<companyList> findAllBy();
    List<companyList> findByDirectors_Id(Long directorID);
}
