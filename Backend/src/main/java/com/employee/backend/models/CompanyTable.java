package com.employee.backend.models;

import java.util.List;
import java.time.LocalDate;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;

@Entity
@Table(name = "company")
public class CompanyTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private LocalDate creationDate;
    private String description;
    private int numOfWorkers;
    private int netWorth;

    @ManyToMany( cascade = CascadeType.ALL)
    @JoinTable(name = "company_director", 
                joinColumns = @JoinColumn(name = "companyID"),
                inverseJoinColumns = @JoinColumn(name = "directorID"))
    private List<DirectorTable> directors;

    @ManyToMany ( cascade = CascadeType.ALL, mappedBy = "companies")
    private List<EmployeeTable> employees;

    public CompanyTable(String name, LocalDate date, String desc, int numWorker, int netWorth){
        this.name = name;
        this.creationDate = date;
        this.description = desc;
        this.numOfWorkers = numWorker;
        this.netWorth = netWorth;
    }
    public CompanyTable(){}

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
    public LocalDate getCreationDate() {
        return creationDate;
    }
    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public int getNumOfWorkers() {
        return numOfWorkers;
    }
    public void setNumOfWorkers(int numOfWorkers) {
        this.numOfWorkers = numOfWorkers;
    }
    public int getNetWorth() {
        return netWorth;
    }
    public void setNetWorth(int netWorth) {
        this.netWorth = netWorth;
    }
    public List<DirectorTable> getDirectors() {
        return directors;
    }
    public void setDirectors(List<DirectorTable> directors) {
        this.directors = directors;
    }
    public List<EmployeeTable> getEmployees() {
        return employees;
    }
    public void setEmployees(List<EmployeeTable> employees) {
        this.employees = employees;
    }
}


