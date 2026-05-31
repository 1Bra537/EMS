package com.employee.backend.classes;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.employee.backend.models.CompanyTable;
import com.employee.backend.models.DirectorTable;
import com.employee.backend.models.EmployeeTable;
import com.employee.backend.models.InformationTable;
import com.employee.backend.models.ResumeTable;
import com.employee.backend.repository.DirectorRepo;
import com.employee.backend.repository.EmployeeRepo;

@Service
public class HRManager extends Director_{
     /**
     * Default constructor
     */
    @Autowired
    private EmployeeRepo employee;
    @Autowired
    private DirectorRepo director;
    HRManager() {
    }

    /**
     * 
     */
    @Override
    public Boolean changeStatus(Long directorID, Long empID, String newStatus){
        return super.changeStatus(directorID, empID, newStatus);
    }
}
