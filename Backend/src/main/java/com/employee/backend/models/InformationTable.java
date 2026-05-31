package com.employee.backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
@Table(name="information")
public class InformationTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private int age;
    private String responsibilities;
    private String passwordHash;
    private String tokenKey;

    public InformationTable(String name, String email, int age, String responsibilities, String passwordHash, String tokenKey){
        this.age = age;
        this.email = email;
        this.passwordHash = passwordHash;
        this.tokenKey = tokenKey;
        this.name = name;
        this.responsibilities = responsibilities;
    }

    public InformationTable(){}

    public void setId(Long id) {
        this.id = id;
    }
    public Long getId() {
        return id;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getName() {
        return name;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public void setAge(int age) {
        this.age = age;
    }
    public int getAge() {
        return age;
    }
    public void setResponsibilities(String responsibilities) {
        this.responsibilities = responsibilities;
    }
    public String getResponsibilities() {
        return responsibilities;
    }
    public String getPasswordHash() {
        return passwordHash;
    }
    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }
    public void setTokenKey(String tokenKey) {
        this.tokenKey = tokenKey;
    }
    public String getTokenKey() {
        return tokenKey;
    }
}
