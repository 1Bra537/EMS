package com.employee.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.employee.backend.RequestBodies.ApplicantInfo;
import com.employee.backend.RequestBodies.ApplicantsResponse;
import com.employee.backend.RequestBodies.EmployeeInfo;
import com.employee.backend.RequestBodies.roleInfo;
import com.employee.backend.RequestBodies.companyList;
import com.employee.backend.classes.Company;


@RestController
public class Record {
    @Autowired
    private Company company;

    // Public: all companies (for employees to browse)
    @GetMapping("/companies")
    public List<companyList> getCompanies() {
        return company.getCompanies();
    }

    // Manager-scoped: only companies belonging to this director
    @GetMapping("/User/director/{directorID}/companies")
    public List<companyList> getManagerCompanies(@PathVariable Long directorID) {
        return company.getManagerCompanies(directorID);
    }

    // Public: roles for a company (employees browse this)
    @GetMapping("/{companyID}/roles")
    public List<roleInfo> viewRoles(@PathVariable Long companyID){
        return company.viewRoles(companyID);
    }

    // Manager-scoped: view employees only if this director owns the company
    @GetMapping("/User/director/{directorID}/company/{companyID}/employees")
    public List<EmployeeInfo> viewEmployees(@PathVariable Long directorID, @PathVariable Long companyID){
        if (!company.directorOwnsCompany(directorID, companyID)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: you do not own this company");
        }
        return company.viewEmployees(companyID);
    }

    // Manager-scoped: view applicants only if this director owns the company
    @GetMapping("/User/director/{directorID}/company/{companyID}/applicants")
    public ApplicantsResponse viewApplicants(@PathVariable Long directorID, @PathVariable Long companyID) {
        if (!company.directorOwnsCompany(directorID, companyID)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: you do not own this company");
        }
        ApplicantsResponse response = new ApplicantsResponse();
        List<ApplicantInfo> applicants = company.viewApplicants(companyID);
        response.setApplicants(applicants);
        response.setServerStatus("ok");
        return response;
    }

    @GetMapping("/test")
    public String test(){
        return "Backend works !";
    }
}
