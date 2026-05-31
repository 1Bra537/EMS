package com.employee.backend.RequestBodies;

import java.time.LocalDate;

public class Offer {
    private String roleName;
    private String description;
    private String duration;
    private int salary;
    private LocalDate startDate;
    private String payFrequency;
    private String currency;
    private int bonus;
    private String benefits;

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
    public void setSalary(int salary) {
        this.salary = salary;
    }
    public int getSalary() {
        return salary;
    }
    public void setBenefits(String benefits) {
        this.benefits = benefits;
    }
    public String getBenefits() {
        return benefits;
    }
    public void setBonus(int bonus) {
        this.bonus = bonus;
    }
    public int getBonus() {
        return bonus;
    }
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    public LocalDate getStartDate() {
        return startDate;
    }
    public String getCurrency() {
        return currency;
    }
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    public void setPayFrequency(String payFrequency) {
        this.payFrequency = payFrequency;
    }
    public String getPayFrequency() {
        return payFrequency;
    }
    
}
