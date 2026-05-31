package com.employee.backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
@Table(name ="resume")
public class ResumeTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String specialities;
    private String workRecord;

    public ResumeTable(String name, String specialties, String workRec){
        this.name = name;
        this.specialities = specialties;
        this.workRecord = workRec;
    }
    public ResumeTable(){}

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
    public void setSpecialities(String specialities) {
        this.specialities = specialities;
    }
    public String getSpecialities() {
        return specialities;
    }
    public void setWorkRecord(String workRecord) {
        this.workRecord = workRecord;
    } 
    public String getWorkRecord() {
        return workRecord;
    }
    
}
