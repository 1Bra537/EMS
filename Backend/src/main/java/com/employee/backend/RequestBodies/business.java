package com.employee.backend.RequestBodies;

import java.time.LocalDate;

public class business {
    private String companyName;
    private LocalDate creationDate;
    private String description;
    private int netWorth;
    
    public String getCompanyName() {
        return companyName;
    }
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
    public LocalDate getCreationDate() {
        return creationDate;
    }
    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public void setNetWorth(int netWorth) {
        this.netWorth = netWorth;
    }
    public int getNetWorth() {
        return netWorth;
    }
}
