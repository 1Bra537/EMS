package com.employee.backend;

import com.employee.backend.models.CompanyTable;
import com.employee.backend.repository.CompanyRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CompanyRepo companyRepo;

    public DataSeeder(CompanyRepo companyRepo) {
        this.companyRepo = companyRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        if (companyRepo.count() == 0) {
            CompanyTable techCorp = new CompanyTable("TechCorp", LocalDate.of(2018, 1, 1), "Software & SaaS solutions", 68, 12000000);
            CompanyTable bizHub = new CompanyTable("BizHub", LocalDate.of(2020, 1, 1), "Business & consulting services", 41, 5800000);
            CompanyTable finGroup = new CompanyTable("FinGroup", LocalDate.of(2015, 1, 1), "Finance & investment advisory", 15, 22000000);
            companyRepo.save(techCorp);
            companyRepo.save(bizHub);
            companyRepo.save(finGroup);
            System.out.println("Default companies seeded successfully!");
        }
    }
}
