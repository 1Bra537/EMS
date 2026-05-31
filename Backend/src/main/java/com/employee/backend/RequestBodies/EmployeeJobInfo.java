package com.employee.backend.RequestBodies;

public class EmployeeJobInfo {
    private Long companyId;
    private String companyName;
    private String companyDescription;
    private String status;
    private String role;

    public EmployeeJobInfo(Long companyId, String companyName, String companyDescription, String status, String role) {
        this.companyId = companyId;
        this.companyName = companyName;
        this.companyDescription = companyDescription;
        this.status = status;
        this.role = role;
    }

    public EmployeeJobInfo() {}

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyDescription() {
        return companyDescription;
    }

    public void setCompanyDescription(String companyDescription) {
        this.companyDescription = companyDescription;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
