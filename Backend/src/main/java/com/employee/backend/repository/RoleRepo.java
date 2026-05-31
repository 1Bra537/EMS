package com.employee.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.employee.backend.models.RoleTable;
import com.employee.backend.RequestBodies.roleInfo;
import com.employee.backend.models.CompanyTable;

public interface RoleRepo extends JpaRepository<RoleTable, Long>{
    List<roleInfo> findByCompany(CompanyTable company);
}
