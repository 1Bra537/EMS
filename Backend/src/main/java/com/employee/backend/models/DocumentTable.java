package com.employee.backend.models;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@Table(name="documents")
public class DocumentTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String validDuration;

    @ManyToOne( cascade = CascadeType.ALL)
    @JoinColumn(name = "companyID")
    private CompanyTable company;

    public DocumentTable(Long id, String name, String desc, String validDur){
        this.id = id;
        this.name = name;
        this.description = desc;
        this.validDuration = validDur;
    }
    public DocumentTable(){}

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
    public void setValidDuration(String validDuration) {
        this.validDuration = validDuration;
    }
    public String getValidDuration() {
        return validDuration;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getDescription() {
        return description;
    }
    public CompanyTable getCompany() {
        return company;
    }
    public void setCompany(CompanyTable company) {
        this.company = company;
    }
}
