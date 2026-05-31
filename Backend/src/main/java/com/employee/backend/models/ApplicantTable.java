package com.employee.backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Entity
@Table(name = "applicants")
public class ApplicantTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int pricingBid;

    @ManyToOne
    @JoinColumn(name = "companyID")
    private CompanyTable company;

    @ManyToOne
    @JoinColumn(name = "employeeID")
    private EmployeeTable employee;

    public ApplicantTable(int pricingBid){
        this.pricingBid = pricingBid;
    }
    public ApplicantTable(){}

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public void setPricingBid(int pricingBid) {
        this.pricingBid = pricingBid;
    }
    public int getPricingBid() {
        return pricingBid;
    }
    public CompanyTable getCompany() {
        return company;
    }
    public void setCompany(CompanyTable company) {
        this.company = company;
    }
    public EmployeeTable getEmployee() {
        return employee;
    }
    public void setEmployee(EmployeeTable employee) {
        this.employee = employee;
    }
}
