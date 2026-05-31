package com.employee.backend.classes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.employee.backend.models.CompanyTable;
import com.employee.backend.models.EmployeeTable;
import com.employee.backend.models.ResumeTable;
import com.employee.backend.models.InformationTable;
import com.employee.backend.models.ApplicantTable;
import com.employee.backend.repository.CompanyRepo;
import com.employee.backend.repository.EmployeeRepo;
import com.employee.backend.repository.ApplicantRepo;
import com.employee.backend.RequestBodies.EmployeeJobInfo;

import java.util.List;
import java.util.ArrayList;

@Service
public class Employee {
     /**
     * Default constructor
     */
    @Autowired
    private EmployeeRepo employee;
    @Autowired
    private CompanyRepo company;
    @Autowired
    private ApplicantRepo applicantRepo;

    public Employee() {
    }

    /**
     * 
     */
    public int id;

    /**
     * 
     */
    public String Company;

    /**
     * 
     */
    public void setClockIn(Long empID, int clockIn) {
        EmployeeTable emp = employee.findById(empID).orElseThrow();
        emp.setClockIn(clockIn);
        employee.save(emp);
    }

    /**
     * 
     */
    public  void setClockOut(Long empID, int clockOut) {
        EmployeeTable emp = employee.findById(empID).orElseThrow();
        emp.setClockOut(clockOut);
        employee.save(emp);
    }

    /**
     * 
     */
    public void QuitJob(Long empID, Long compID) {
        CompanyTable comp = company.findById(compID).orElseThrow();
        EmployeeTable emp = employee.findById(empID).orElseThrow();

        emp.getCompanies().remove(comp);
        employee.save(emp);

        comp.getEmployees().remove(emp);
        company.save(comp);
    }

    /**
     * 
     */
    public List<EmployeeJobInfo> getEmployeeJobs(Long empID) {
        EmployeeTable emp = employee.findById(empID).orElseThrow();
        List<EmployeeJobInfo> jobs = new ArrayList<>();

        // 1. Add active/hired jobs
        for (CompanyTable comp : emp.getCompanies()) {
            ResumeTable res = emp.getResume();
            String role = (res != null && res.getSpecialities() != null) ? res.getSpecialities() : "Regular worker bee";
            jobs.add(new EmployeeJobInfo(
                comp.getId(),
                comp.getName(),
                comp.getDescription(),
                emp.getStatus() != null ? emp.getStatus() : "Active",
                role
            ));
        }

        // 2. Add pending application/enrollment jobs
        List<ApplicantTable> applications = applicantRepo.findByEmployee(emp);
        for (ApplicantTable app : applications) {
            CompanyTable comp = app.getCompany();
            if (comp != null) {
                // Check if already in active jobs to prevent duplicates
                boolean exists = false;
                for (EmployeeJobInfo j : jobs) {
                    if (j.getCompanyId().equals(comp.getId())) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    jobs.add(new EmployeeJobInfo(
                        comp.getId(),
                        comp.getName(),
                        comp.getDescription(),
                        "Pending",
                        "Applicant"
                    ));
                }
            }
        }
        return jobs;
    }
}
