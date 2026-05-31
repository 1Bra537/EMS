package com.employee.backend.models;

import java.time.LocalDate;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@Table(name="roles")
public class RoleTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String roleName;
    private String description;
    private String duration;
    private int salaryAmount;
    private LocalDate startDate;
    private String payFreq;
    private String currency;
    private int bonus;
    private String benefits;

    @ManyToOne( cascade = CascadeType.DETACH)
    @JoinColumn(name = "companyID")
    private CompanyTable company;

    public RoleTable(String roleName, String desc, String duration, int salary, LocalDate date, String payFreq, String currency, int Bonus, String benefits){
        this.roleName = roleName;
        this.description = desc;
        this.duration = duration;
        this.salaryAmount = salary;
        this.startDate = date;
        this.payFreq = payFreq;
        this.currency = currency;
        this.bonus = Bonus;
        this.benefits = benefits;
    }

    public RoleTable(){}
    
    public void setId(Long id) {
        this.id = id;
    }
    public Long getId() {
        return id;
    }
    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
    public String getRoleName() {
        return roleName;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getDescription() {
        return description;
    }
    public void setDuration(String duration) {
        this.duration = duration;
    }
    public String getDuration() {
        return duration;
    }
    public void setSalaryAmount(int salaryAmount) {
        this.salaryAmount = salaryAmount;
    }
    public int getSalaryAmount() {
        return salaryAmount;
    }
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    public LocalDate getStartDate() {
        return startDate;
    }
    public void setPayFreq(String payFreq) {
        this.payFreq = payFreq;
    }
    public String getPayFreq() {
        return payFreq;
    }
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    public String getCurrency() {
        return currency;
    }
    public void setBonus(int bonus) {
        this.bonus = bonus;
    }
    public int getBonus() {
        return bonus;
    }
    public void setBenefits(String benefits) {
        this.benefits = benefits;
    }
    public String getBenefits() {
        return benefits;
    }
    public CompanyTable getCompany() {
        return company;
    }
    public void setCompany(CompanyTable company) {
        this.company = company;
    }
}
