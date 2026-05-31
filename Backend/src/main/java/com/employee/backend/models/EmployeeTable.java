package com.employee.backend.models;

import java.util.List;

import jakarta.persistence.Table;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;

@Entity
@Table(name = "employees")
public class EmployeeTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int clockIn; 
    private int clockOut;
    private String status;
    
    @OneToOne( cascade = CascadeType.ALL)
    @JoinColumn(name = "informationID")
    private InformationTable information;

    @ManyToMany( cascade = CascadeType.ALL)
    @JoinTable(name = "employee_company",
                joinColumns = @JoinColumn(name = "employeeID"),
                inverseJoinColumns = @JoinColumn(name = "companyID"))
    private List<CompanyTable> companies;

    @OneToOne( cascade = CascadeType.ALL)
    @JoinColumn(name = "resumeID")
    private ResumeTable resume;

    public EmployeeTable(){
    }

    public void setId(Long id) {
        this.id = id;
    }
    public Long getId() {
        return id;
    }
    public void setClockIn(int clockIn) {
        this.clockIn = clockIn;
    }
    public int getClockIn() {
        return clockIn;
    }
    public void setClockOut(int clockOut) {
        this.clockOut = clockOut;
    }
    public int getClockOut() {
        return clockOut;
    }
    public void setCompanies(List<CompanyTable> companies) {
        this.companies = companies;
    }
    public List<CompanyTable> getCompanies() {
        return companies;
    }
    public void setInformation(InformationTable information) {
        this.information = information;
    }
    public InformationTable getInformation() {
        return information;
    }
    public void setResume(ResumeTable resume) {
        this.resume = resume;
    }
    public ResumeTable getResume() {
        return resume;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}
