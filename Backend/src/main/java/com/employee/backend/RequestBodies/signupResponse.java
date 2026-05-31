package com.employee.backend.RequestBodies;

import java.util.List;

public class signupResponse {
    private String serverStatus;
    private String response;
    private String JWT;
    private Long id;
    private List<companyList> companyList;

    public void setServerStatus(String serverStatus) {
        this.serverStatus = serverStatus;
    }
    public String getServerStatus() {
        return serverStatus;
    }
    public String getResponse() {
        return response;
    }
    public void setResponse(String response) {
        this.response = response;
    }
    public void setJWT(String jWT) {
        this.JWT = jWT;
    }
    public String getJWT() {
        return JWT;
    }
    public List<companyList> getCompanyList() {
        return companyList;
    }
    public void setCompanyList(List<companyList> companyList) {
        this.companyList = companyList;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
}
