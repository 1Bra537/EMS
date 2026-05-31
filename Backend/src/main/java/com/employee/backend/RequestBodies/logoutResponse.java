package com.employee.backend.RequestBodies;

public class logoutResponse {
    private String serverStatus;
    private String response;

    public String getServerStatus() {
        return serverStatus;
    }
    public void setServerStatus(String serverStatus) {
        this.serverStatus = serverStatus;
    }
    public String getResponse() {
        return response;
    }
    public void setResponse(String response) {
        this.response = response;
    }
}
