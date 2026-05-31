package com.employee.backend.classes;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.employee.backend.RequestBodies.loginResponse;
import com.employee.backend.RequestBodies.logoutResponse;
import com.employee.backend.RequestBodies.signupResponse;
import com.employee.backend.RequestBodies.companyList;
import com.employee.backend.RequestBodies.genericResponse;
import com.employee.backend.models.ApplicantTable;
import com.employee.backend.models.CompanyTable;
import com.employee.backend.models.DirectorTable;
import com.employee.backend.models.EmployeeTable;
import com.employee.backend.models.InformationTable;
import com.employee.backend.models.ResumeTable;
import com.employee.backend.repository.ApplicantRepo;
import com.employee.backend.repository.CompanyRepo;
import com.employee.backend.repository.DirectorRepo;
import com.employee.backend.repository.EmployeeRepo;
import com.employee.backend.repository.InfoRepo;

@Service
public class Worker {
        /**
     * Default constructor
     */
    @Autowired
    private EmployeeRepo employee;
    @Autowired
    private DirectorRepo director;
    @Autowired
    private CompanyRepo company;
    @Autowired
    private InfoRepo information;
    @Autowired
    private ApplicantRepo applicant;

    public Worker() {
    }

    /**
     * 
     */
    private String name;

    /**
     * 
     */
    private int age;

    /**
     * 
     */
    private String email;

    /**
     * 
     */
    private String responsibility;

    /**
     * 
     */
    private String Status;

    /**
     * 
     */
    public int id;

     // SIGNUP
    public signupResponse signup(String name, String email, String password, int age, String status) {
        signupResponse response = new signupResponse();
        String tokenkey = "12345$%^&";

        // checking if user email already exist
        InformationTable info = information.findByEmail(email);
        if ( info != null){
            response.setResponse("user already present");
            response.setJWT(null);
            response.setId(null);
            response.setCompanyList(null);
            return response;
        }
        
        if ( status.equalsIgnoreCase("Employee")){
            EmployeeTable emp = new EmployeeTable();
            InformationTable information = new InformationTable(name, email, age, "Regular worker bee", password, tokenkey);
            
            emp.setInformation(information);
            employee.save(emp);
            List<companyList> signupDetail = company.findAllBy();

            response.setResponse("successfully added");
            response.setJWT(tokenkey);
            response.setId(emp.getId());
            response.setCompanyList(signupDetail);


            return response;
        }

        String responsibility = status.equals("Manager") ? "Managing general business affairs of the company" : "Managing human relational affairs of the business";

        DirectorTable dir = new DirectorTable(status);
        InformationTable information = new InformationTable(name, email, age,responsibility, password, tokenkey);

        dir.setInformation(information);
        director.save(dir);
        List<companyList> signupDetail = company.findAllBy();

        response.setResponse("successfully added");
        response.setJWT(tokenkey);
        response.setId(dir.getId());
        response.setCompanyList(signupDetail);

        return response;
    }

    // LOGIN
    public loginResponse login(String email, String password, String status) {
        loginResponse response = new loginResponse();
        InformationTable _info = information.findByEmail(email);

        if (_info == null){
            response.setJWT(null);
            response.setId(null);
            response.setCompanyList(null);
            return response;   
        }

        if ( status.equalsIgnoreCase("Employee")){
            EmployeeTable _employee = employee.findByInformation(_info);

            if ( password.equals(_info.getPasswordHash())){
                response.setJWT(_info.getTokenKey());
                response.setId(_employee.getId());
                response.setCompanyList(company.findAllBy());   
                return response;
            }
            else {
                response.setJWT("invalid");
                response.setId(null);
                response.setCompanyList(null);
                return response;   
            }
        }
        else {
            
            DirectorTable dir = director.findByInformation(_info);

            if ( password.equals(_info.getPasswordHash())){
                response.setJWT(_info.getTokenKey());
                response.setId(dir.getId());
                response.setCompanyList(company.findAllBy());   
                return response;
            }
            else {
                response.setJWT(null);
                response.setId(null);
                response.setCompanyList(null);
                return response;   
            }
        }
    }

    // LOGOUT
    public logoutResponse employeeLogout(Long empID) {
        logoutResponse response = new logoutResponse();
        EmployeeTable _employee = employee.findById(empID).orElseThrow();
        InformationTable info = _employee.getInformation();
        if (info != null) {
            info.setTokenKey(null);
            information.save(info);
        }

        response.setResponse("logged out successfully");
        return response;
    }

    public logoutResponse directorLogout(Long dirID) {
        logoutResponse response = new logoutResponse();
        DirectorTable dir = director.findById(dirID).orElseThrow();
        InformationTable info = dir.getInformation();
        if (info != null) {
            info.setTokenKey(null);
            information.save(info);
        }

        response.setResponse("logged out successfully");
        return response;
    }

    // enrolling for a company
    public genericResponse enroll(Long empID, Long compID, int pricingBid){
        genericResponse response = new genericResponse();

        EmployeeTable emp = employee.findById(empID).orElseThrow();
        CompanyTable comp = company.findById(compID).orElseThrow();

        ApplicantTable _applicant = new ApplicantTable(pricingBid);
        _applicant.setCompany(comp);
        _applicant.setEmployee(emp);

        applicant.save(_applicant);

        response.setResponse("successful enrollment");
        return response;

    }

    
    public void createResume(Long ID, String specialties, String workRecord, String status){
        if (status.equalsIgnoreCase("Employee")){
            EmployeeTable emp = employee.findById(ID).orElseThrow();
            ResumeTable resume = emp.getResume();
            if (resume == null) {
                InformationTable infoTable = emp.getInformation();
                resume = new ResumeTable(infoTable != null ? infoTable.getName() : "Unknown", specialties, workRecord);
                emp.setResume(resume);
            } else {
                resume.setSpecialities(specialties);
                resume.setWorkRecord(workRecord);
            }
            employee.save(emp);
        }
        else {
            DirectorTable dir = director.findById(ID).orElseThrow();
            ResumeTable resume = dir.getResume();
            if (resume == null) {
                InformationTable info = dir.getInformation();
                resume = new ResumeTable(info != null ? info.getName() : "Unknown", specialties, workRecord);
                dir.setResume(resume);
            } else {
                resume.setSpecialities(specialties);
                resume.setWorkRecord(workRecord);
            }
            director.save(dir);
        }
    }

    /**
     * @param Resume
     */
    public void changeResume(Long ID, String specialties, String workRec, String status) {
        if ( status.equalsIgnoreCase("Employee")){
            EmployeeTable emp = employee.findById(ID).orElseThrow();
            ResumeTable resume = emp.getResume();
            if (resume == null) {
                InformationTable infoTable = emp.getInformation();
                resume = new ResumeTable(infoTable != null ? infoTable.getName() : "Unknown", specialties, workRec);
                emp.setResume(resume);
            } else {
                String specialty = specialties == null ? resume.getSpecialities() : specialties;
                String workRecord = workRec == null ? resume.getWorkRecord(): workRec;
                resume.setSpecialities(specialty);
                resume.setWorkRecord(workRecord);
            }
            employee.save(emp);
        }
        else{
            DirectorTable dir = director.findById(ID).orElseThrow();
            ResumeTable resume  = dir.getResume();
            if (resume == null) {
                InformationTable info = dir.getInformation();
                resume = new ResumeTable(info != null ? info.getName() : "Unknown", specialties, workRec);
                dir.setResume(resume);
            } else {
                String specialty = specialties == null ? resume.getSpecialities() : specialties;
                String workRecord = workRec == null ? resume.getWorkRecord(): workRec;
                resume.setSpecialities(specialty);
                resume.setWorkRecord(workRecord);
            }
            director.save(dir);
        }
    }

}
