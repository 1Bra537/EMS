package com.employee.backend.RequestBodies;

public class EmployeeInfo {
    private Long id;
    private String name;
    private String specialties;
    private String status;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getSpecialties() {
        return specialties;
    }
    public void setSpecialties(String specialties) {
        this.specialties = specialties;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public String getStatus() {
        return status;
    }
}
