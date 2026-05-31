package com.employee.backend.classes;

import com.employee.backend.RequestBodies.Applicant;
import com.employee.backend.RequestBodies.ApplicantInfo;
import com.employee.backend.RequestBodies.ApplicantsResponse;
import com.employee.backend.RequestBodies.EmployeeInfo;
import com.employee.backend.RequestBodies.roleInfo;
import com.employee.backend.RequestBodies.companyList;
import com.employee.backend.models.CompanyTable;
import com.employee.backend.models.DirectorTable;
import com.employee.backend.models.DocumentTable;
import com.employee.backend.models.EmployeeTable;
import com.employee.backend.models.InformationTable;
import com.employee.backend.models.ResumeTable;
import com.employee.backend.models.RoleTable;
import com.employee.backend.repository.ApplicantRepo;
import com.employee.backend.repository.CompanyRepo;
import com.employee.backend.repository.DocumentRepo;
import com.employee.backend.repository.EmployeeRepo;
import com.employee.backend.repository.InfoRepo;
import com.employee.backend.repository.ResumeRepo;
import com.employee.backend.repository.RoleRepo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Company {
     private final Director_ director_;
     /**
     * Default constructor
     */
    @Autowired
    private DocumentRepo document;
    @Autowired
    private CompanyRepo company;
    @Autowired
    private RoleRepo roleRepo;
    @Autowired
    private ApplicantRepo applicants;
    @Autowired
    private EmployeeRepo employee;
    @Autowired
    private ResumeRepo resume;

    public Company(Director_ director_) {
        this.director_ = director_;}

    /**
     * 
     */
    
    
    private String name;

    /**
     * 
     */
    private String creationDate;

    /**
     * 
     */
    private String Description;

    /**
     * 
     */
    private int NumWorkers;

    /**
     * non-static method findAll() cannot be referenced from a static context(compiler.err.non-static.cant.be.ref)
Cannot make a static reference to the non-static method findAll() from the type ListCrudRepository<DocumentTable,Long>Java(603979977)
     */
    private int NetWorth;

    /**
     * 
     */
    public List<roleInfo> viewRoles(Long companyID) {
        CompanyTable _company = company.findById(companyID).orElseThrow();
        return roleRepo.findByCompany(_company);
    }

    /**
     * Check if the given director owns (is associated with) the given company.
     */
    public boolean directorOwnsCompany(Long directorID, Long companyID) {
        List<companyList> directorCompanies = company.findByDirectors_Id(directorID);
        for (companyList c : directorCompanies) {
            if (c.getId() != null && c.getId().equals(companyID)) {
                return true;
            }
        }
        return false;
    }

    public List<companyList> getCompanies() {
        return company.findAllBy();
    }

    /**
     * 
     */
    public List<EmployeeInfo> viewEmployees(Long companyID) {
        CompanyTable _company = company.findById(companyID).orElseThrow(() -> new RuntimeException("Company not Found"));
        List<EmployeeTable> _employees =  _company.getEmployees();
        List<DirectorTable> _directors = _company.getDirectors();

        // creating variables to store employee info from received employees
        List<EmployeeInfo> _employeesResponse = new ArrayList<>();
        
        // getting list of employees first 
        for(int idx = 0; idx < _employees.size(); idx++){
            EmployeeInfo info = new EmployeeInfo();
            EmployeeTable emp = _employees.get(idx);
            InformationTable infoTable = emp.getInformation();
            info.setName(infoTable != null ? infoTable.getName() : "Unknown");
            ResumeTable resume = emp.getResume();
            info.setSpecialties(resume != null ? resume.getSpecialities() : "No resume created");
            info.setId(emp.getId());
            info.setStatus(emp.getStatus() != null ? emp.getStatus() : "Active");

            _employeesResponse.add(info);
        }
        // getting list of directors next 
        for(int idx = 0; idx < _directors.size(); idx++){
            EmployeeInfo info = new EmployeeInfo();
            DirectorTable dir = _directors.get(idx);
            InformationTable infoTable = dir.getInformation();
            info.setName(infoTable != null ? infoTable.getName() : "Unknown");
            ResumeTable resume = dir.getResume();
            info.setSpecialties(resume != null ? resume.getSpecialities() : "No resume created");
            info.setId(-dir.getId()); // Signed ID Multiplexing: Negated ID for Directors/Managers
            info.setStatus(dir.getStatus());

            _employeesResponse.add(info);
        }

        return _employeesResponse;
    }

    /**
     * 
     */
    public List<DocumentTable> viewDocs(CompanyTable company) {
        return document.findByCompany(company);
    }

    public List<ApplicantInfo> viewApplicants(Long compID){

        CompanyTable comp = company.findById(compID).orElseThrow();
        List<Applicant> _applicants = applicants.findByCompany(comp);  
        List<ApplicantInfo> applicantsResponse = new ArrayList<>();
        

        for (int idx = 0; idx < _applicants.size(); idx++){
            ApplicantInfo current_applicant = new ApplicantInfo();
            EmployeeTable emp = _applicants.get(idx).getEmployee();
            current_applicant.setId(emp.getId());
            InformationTable infoTable = emp.getInformation();
            current_applicant.setEmployeeName(infoTable != null ? infoTable.getName() : "Unknown");
            current_applicant.setPricingBid(_applicants.get(idx).getPricingBid());

            applicantsResponse.add(current_applicant);
        }

        
        return applicantsResponse;
    }

    public List<companyList> getManagerCompanies(Long directorID) {
        return company.findByDirectors_Id(directorID);
    }

    
}
