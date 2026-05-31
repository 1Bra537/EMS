package com.employee.backend.models;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;

@Entity
@Table(name = "director")
public class DirectorTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String status;
    
    @OneToOne( cascade = CascadeType.ALL)
    @JoinColumn(name = "informationID")
    private InformationTable information;

    @ManyToMany ( cascade = CascadeType.DETACH, mappedBy = "directors")
    private List<CompanyTable> companies;

    @OneToOne( cascade = CascadeType.ALL)
    @JoinColumn(name = "resumeID")
    private ResumeTable resume;

    public DirectorTable(String status){
        this.status = status;
    }
    public DirectorTable(){}

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public List<CompanyTable> getCompanies() {
        return companies;
    }
    public void setCompanies(List<CompanyTable> companies) {
        this.companies = companies;
    }
    public void setInformation(InformationTable information) {
        this.information = information;
    }
    public InformationTable getInformation() {
        return information;
    }
    public ResumeTable getResume() {
        return resume;
    }
    public void setResume(ResumeTable resume) {
        this.resume = resume;
    }
}
