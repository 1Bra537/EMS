package com.employee.backend.classes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.employee.backend.models.EmployeeTable;
import com.employee.backend.models.ResumeTable;
import com.employee.backend.models.DirectorTable;
import com.employee.backend.repository.EmployeeRepo;
import com.employee.backend.repository.DirectorRepo;

@Service
public class Resume {
      /**
     * Default constructor
     */
    @Autowired
    private EmployeeRepo employee;
    @Autowired
    private DirectorRepo director;
    
    public Resume() {
    }

    /**
     * 
     */
    private String EmployeeName;

    /**
     * 
     */
    private String Specialities;

    /**
     * 
     */
    private int age;

    /**
     * 
     */
    public int id;

    /**
     * 
     */
    private String workRecord;



    /**
     * 
     */
    public String viewSpecialities(Long empID) {
        if (empID < 0) {
            Long dirID = -empID;
            DirectorTable dir = director.findById(dirID).orElseThrow();
            ResumeTable resume = dir.getResume();
            return resume != null ? resume.getSpecialities() : "No specialities listed";
        } else {
            EmployeeTable emp = employee.findById(empID).orElseThrow();
            ResumeTable resume = emp.getResume();
            return resume != null ? resume.getSpecialities() : "No specialities listed";
        }
    }

    /**
     * 
     */
    public String viewRecord(Long empID) {       
        if (empID < 0) {
            Long dirID = -empID;
            DirectorTable dir = director.findById(dirID).orElseThrow();
            ResumeTable resume = dir.getResume();
            return resume != null ? resume.getWorkRecord() : "No work record listed";
        } else {
            EmployeeTable emp = employee.findById(empID).orElseThrow();
            ResumeTable resume = emp.getResume();
            return resume != null ? resume.getWorkRecord() : "No work record listed";
        }
    }
}
