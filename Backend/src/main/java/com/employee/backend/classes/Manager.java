package com.employee.backend.classes;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.employee.backend.models.CompanyTable;
import com.employee.backend.models.DirectorTable;
import com.employee.backend.models.RoleTable;
import com.employee.backend.repository.CompanyRepo;
import com.employee.backend.repository.DirectorRepo;
import com.employee.backend.repository.RoleRepo;

@Service
public class Manager extends Director_{
     /**
     * Default constructor
     */
    @Autowired
    private RoleRepo Role;
    @Autowired
    private CompanyRepo company;
    @Autowired
    private DirectorRepo director;
    public Manager() {
    }


    public Boolean createOffer(Long dirID, Long compID, String roleName, String Desc, String dur, int salary, LocalDate startDate, String payFreq, String currency, int Bonus, String benefits) {
        // Ownership check: only the director who owns the company can add offers
        if (!directorOwnsCompany(dirID, compID)) {
            return false;
        }
        RoleTable role = new RoleTable(roleName, Desc, dur, salary, startDate, payFreq, currency, Bonus, benefits);
        CompanyTable comp = company.findById(compID).orElseThrow();
        role.setCompany(comp);
        Role.save(role);
        return true;
    }

    /**
     * 
     */
    public void createBusiness(Long dirID, String name, LocalDate creationDate, String desc, int netWorth) {
        DirectorTable dir = director.findById(dirID).orElseThrow();
        CompanyTable comp = new CompanyTable(name, creationDate, desc, 1, netWorth);

        List<DirectorTable> directors = new ArrayList<>();
        directors.add(dir);
        comp.setDirectors(directors);
        company.save(comp);
    }

}
