package com.employee.backend.RequestBodies;

public class resumeBody {
    private String status;
    private String specialities;
    private String workRecord;

    public String getSpecialities() {
        return specialities;
    }
    public void setSpecialities(String specialities) {
        this.specialities = specialities;
    }
    public String getWorkRecord() {
        return workRecord;
    }
    public void setWorkRecord(String workRecord) {
        this.workRecord = workRecord;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}
