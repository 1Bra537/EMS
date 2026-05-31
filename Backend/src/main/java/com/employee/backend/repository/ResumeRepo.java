package com.employee.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.backend.models.ResumeTable;

public interface ResumeRepo extends JpaRepository<ResumeTable, Long>{
}
