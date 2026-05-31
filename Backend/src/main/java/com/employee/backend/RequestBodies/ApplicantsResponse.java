package com.employee.backend.RequestBodies;

import java.util.List;

public class ApplicantsResponse {
    private List<ApplicantInfo> applicants;
    private String serverStatus;

    public List<ApplicantInfo> getApplicants() {
        return applicants;
    }
    public void setApplicants(List<ApplicantInfo> applicants) {
        this.applicants = applicants;
    }
    public String getServerStatus() {
        return serverStatus;
    }
    public void setServerStatus(String serverStatus) {
        this.serverStatus = serverStatus;
    }
}
