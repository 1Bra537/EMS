package com.employee.backend.RequestBodies;

import java.util.List;

public class loginResponse {
    private String serverStatus;
    private String JWT;
    private Long id;
    private List<companyList> companyList;

    public String getServerStatus() {
        return serverStatus;
    }
    public void setServerStatus(String serverStatus) {
        this.serverStatus = serverStatus;
    }
    public void setJWT(String jWT) {
        this.JWT = jWT;
    }
    public String getJWT() {
        return JWT;
    }
    public void setCompanyList(List<companyList> companyList) {
        this.companyList = companyList;
    }
    public List<companyList> getCompanyList() {
        return companyList;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
}
