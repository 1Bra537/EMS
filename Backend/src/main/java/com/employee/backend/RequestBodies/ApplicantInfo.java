package com.employee.backend.RequestBodies;

public class ApplicantInfo {
    private Long id;
    private int pricingBid;
    private String employeeName;

    public String getEmployeeName() {
        return employeeName;
    }
    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public int getPricingBid() {
        return pricingBid;
    }
    public void setPricingBid(int pricingBid) {
        this.pricingBid = pricingBid;
    }
}
