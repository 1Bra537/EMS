package com.employee.backend.classes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import com.employee.backend.models.ApplicantTable;
import com.employee.backend.models.CompanyTable;
import com.employee.backend.models.DirectorTable;
import com.employee.backend.models.EmployeeTable;
import com.employee.backend.repository.ApplicantRepo;
import com.employee.backend.repository.CompanyRepo;
import com.employee.backend.repository.EmployeeRepo;
import com.employee.backend.models.InformationTable;
import com.employee.backend.models.ResumeTable;
import com.employee.backend.repository.DirectorRepo;

@Service
public class Director_ {
    @Autowired
    private EmployeeRepo employee;
    @Autowired
    private CompanyRepo company;
    @Autowired
    private DirectorRepo director;
    @Autowired
    private ApplicantRepo applicants;

    public Director_() {
    }

    // ─── Ownership Validation ─────────────────────────────────────────────────
    /**
     * Returns true if the given director is an owner/member of the given company.
     */
    protected boolean directorOwnsCompany(Long directorID, Long companyID) {
        DirectorTable dir = director.findById(directorID).orElse(null);
        if (dir == null) return false;
        for (CompanyTable c : dir.getCompanies()) {
            if (c.getId().equals(companyID)) return true;
        }
        return false;
    }

    // ─── Hire Employee ────────────────────────────────────────────────────────
    /**
     * Hires an employee into a company — only if the requesting director owns it.
     * Returns true on success, false if access denied or not found.
     */
    public Boolean HireEmployee(Long directorID, Long empID, Long compID) {
        if (!directorOwnsCompany(directorID, compID)) {
            return false;
        }

        EmployeeTable emp = employee.findById(empID).orElseThrow();
        CompanyTable comp = company.findById(compID).orElseThrow();

        List<CompanyTable> companies = new ArrayList<>();
        companies.addAll(emp.getCompanies());
        companies.add(comp);
        emp.setCompanies(companies);
        emp.setStatus("Active");
        employee.save(emp);

        int workers = comp.getNumOfWorkers();
        comp.setNumOfWorkers(workers + 1);
        comp.getEmployees().add(emp);
        company.save(comp);

        // Remove employee from applicants list after hiring
        ApplicantTable applicant = applicants.findByEmployeeAndCompany(emp, comp);
        if (applicant != null) {
            applicants.delete(applicant);
        }
        return true;
    }

    // ─── Fire Employee ────────────────────────────────────────────────────────
    /**
     * Fires an employee or director from a company — only if the requesting
     * director owns the company. Signed ID multiplexing: negative empID means director.
     * Returns true on success, false if access denied.
     */
    public Boolean FireEmployee(Long directorID, Long empID, Long compID) {
        if (!directorOwnsCompany(directorID, compID)) {
            return false;
        }

        if (empID < 0) {
            // Negative ID → it's a DirectorTable entry
            Long dirID = -empID;
            DirectorTable dir = director.findById(dirID).orElseThrow();
            CompanyTable comp = company.findById(compID).orElseThrow();

            dir.getCompanies().remove(comp);
            director.save(dir);

            Boolean isRemoved = comp.getDirectors().remove(dir);

            int workers = comp.getNumOfWorkers();
            comp.setNumOfWorkers(workers - 1);
            company.save(comp);
            return isRemoved;
        } else {
            EmployeeTable emp = employee.findById(empID).orElseThrow();
            CompanyTable comp = company.findById(compID).orElseThrow();

            emp.getCompanies().remove(comp);
            emp.setStatus("Terminated");
            employee.save(emp);

            Boolean isRemoved = comp.getEmployees().remove(emp);

            int workers = comp.getNumOfWorkers();
            comp.setNumOfWorkers(workers - 1);
            company.save(comp);
            return isRemoved;
        }
    }

    // ─── Change Status ────────────────────────────────────────────────────────
    /**
     * Changes a worker's status (or promotes/demotes) — only if the requesting
     * director owns at least one company in common with the target employee.
     * Returns true on success, false if access denied.
     */
    public Boolean changeStatus(Long directorID, Long empID, String newStatus) {
        // Strip surrounding quotes (raw JSON string body)
        String cleanStatus = newStatus.replaceAll("^\"|\"$", "").trim();

        if (empID < 0) {
            Long dirID = -empID;
            DirectorTable dir = director.findById(dirID).orElseThrow();

            // Verify requesting director shares at least one company with the target
            boolean hasAccess = false;
            for (CompanyTable c : dir.getCompanies()) {
                if (directorOwnsCompany(directorID, c.getId())) {
                    hasAccess = true;
                    break;
                }
            }
            if (!hasAccess) return false;

            // 1. Updating to another director/manager role
            if (cleanStatus.equalsIgnoreCase("Manager") || cleanStatus.equalsIgnoreCase("Director")
                    || cleanStatus.equalsIgnoreCase("HR Manager") || cleanStatus.equalsIgnoreCase("HRManager")) {
                String role = cleanStatus.equalsIgnoreCase("HRManager") ? "HR Manager" : cleanStatus;
                dir.setStatus(role);

                String responsibility = "Managing general business affairs of the company";
                if (role.equalsIgnoreCase("HR Manager")) {
                    responsibility = "Managing human relational affairs of the business";
                } else if (role.equalsIgnoreCase("Director")) {
                    responsibility = "Managing general board affairs and corporate direction";
                }

                InformationTable info = dir.getInformation();
                if (info != null) {
                    info.setResponsibilities(responsibility);
                }
                director.save(dir);
                return true;
            }

            // 2. Demoting back to regular employee
            if (cleanStatus.equalsIgnoreCase("Active") || cleanStatus.equalsIgnoreCase("On leave")
                    || cleanStatus.equalsIgnoreCase("Suspended") || cleanStatus.equalsIgnoreCase("Probation")) {
                InformationTable info = dir.getInformation();
                ResumeTable resume = dir.getResume();
                List<CompanyTable> comp = dir.getCompanies();

                director.delete(dir);

                EmployeeTable emp = new EmployeeTable();
                if (info != null) {
                    info.setResponsibilities("Regular worker bee");
                }
                emp.setInformation(info);
                emp.setResume(resume);
                emp.setCompanies(comp);
                emp.setStatus(cleanStatus);
                employee.save(emp);

                for (CompanyTable c : comp) {
                    c.getEmployees().add(emp);
                    company.save(c);
                }
                return true;
            }

        } else {
            // empID is positive → regular employee
            EmployeeTable emp = employee.findById(empID).orElseThrow();

            // Verify that the requesting director shares at least one company with the employee
            boolean hasAccess = false;
            for (CompanyTable c : emp.getCompanies()) {
                if (directorOwnsCompany(directorID, c.getId())) {
                    hasAccess = true;
                    break;
                }
            }
            if (!hasAccess) return false;

            // Plain status changes (no promotion)
            if (cleanStatus.equalsIgnoreCase("Active") || cleanStatus.equalsIgnoreCase("On leave")
                    || cleanStatus.equalsIgnoreCase("Suspended") || cleanStatus.equalsIgnoreCase("Probation")) {
                emp.setStatus(cleanStatus);
                employee.save(emp);
                return true;
            }

            InformationTable information = emp.getInformation();
            ResumeTable resume = emp.getResume();
            List<CompanyTable> comp = emp.getCompanies();

            // Remove as employee before promoting
            employee.delete(emp);

            if (cleanStatus.equalsIgnoreCase("Manager")) {
                if (information != null) {
                    information.setResponsibilities("Managing general business affairs of the company");
                }
                DirectorTable dir = new DirectorTable("Manager");
                dir.setInformation(information);
                dir.setResume(resume);
                dir.setCompanies(comp);
                director.save(dir);
                for (CompanyTable c : comp) {
                    c.getDirectors().add(dir);
                    company.save(c);
                }
            } else if (cleanStatus.equalsIgnoreCase("HR Manager") || cleanStatus.equalsIgnoreCase("HRManager")) {
                if (information != null) {
                    information.setResponsibilities("Managing human relational affairs of the business");
                }
                DirectorTable dir = new DirectorTable("HR Manager");
                dir.setInformation(information);
                dir.setResume(resume);
                dir.setCompanies(comp);
                director.save(dir);
                for (CompanyTable c : comp) {
                    c.getDirectors().add(dir);
                    company.save(c);
                }
            } else if (cleanStatus.equalsIgnoreCase("Director")) {
                if (information != null) {
                    information.setResponsibilities("Managing general board affairs and corporate direction");
                }
                DirectorTable dir = new DirectorTable("Director");
                dir.setInformation(information);
                dir.setResume(resume);
                dir.setCompanies(comp);
                director.save(dir);
                for (CompanyTable c : comp) {
                    c.getDirectors().add(dir);
                    company.save(c);
                }
            }
            return true;
        }
        return false;
    }
}
