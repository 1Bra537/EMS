package com.employee.backend.controllers;

import com.employee.backend.classes.Worker;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import com.employee.backend.RequestBodies.genericResponse;
import com.employee.backend.RequestBodies.resumeBody;
import com.employee.backend.classes.Director_;
import com.employee.backend.classes.Manager;
import com.employee.backend.classes.Resume;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;





@RestController
public class WorkerController {
    
    private final Worker worker;
    @Autowired
    @Qualifier("director_")
    private Director_ director;
    @Autowired
    private Manager manager;
    @Autowired 
    private Resume resume;


    WorkerController(Worker worker) {
        this.worker = worker;
    }
    

    // HIRE EMPLOYEE — directorID required for ownership validation
    @PostMapping("/User/director/{directorID}/company/{companyID}/hire/{employeeID}")
    public genericResponse hireEmployee(@PathVariable Long directorID, @PathVariable Long employeeID, @PathVariable Long companyID) {
        genericResponse response = new genericResponse();
        Boolean hired = director.HireEmployee(directorID, employeeID, companyID);
        response.setResponse(hired ? "successful hire" : "Access denied: you do not own this company");
        response.setServerStatus(hired ? "ok" : "forbidden");
        return response;
    }
    
    // FIRE EMPLOYEE — directorID required for ownership validation
    @DeleteMapping("/User/director/{directorID}/company/{companyID}/fire/{employeeID}")
    public genericResponse FireEmployee(@PathVariable Long directorID, @PathVariable Long employeeID, @PathVariable Long companyID) {
        genericResponse response = new genericResponse();
        Boolean isFired = director.FireEmployee(directorID, employeeID, companyID);
        response.setResponse(isFired ? "Employee fired successfully" : "Could not fire employee or access denied");
        response.setServerStatus(isFired ? "ok" : "failed");
        return response;
    }

    // CHANGE STATUS — directorID required for ownership validation
    @PostMapping("/User/director/{directorID}/changeStatus/{employeeID}")
    public genericResponse changeStatus(@PathVariable Long directorID, @PathVariable Long employeeID, @RequestBody String status) {
        genericResponse response = new genericResponse();
        Boolean changed = director.changeStatus(directorID, employeeID, status);
        response.setResponse(changed ? "Status changed successfully" : "Access denied or employee not in your company");
        response.setServerStatus(changed ? "ok" : "forbidden");
        return response;
    }

    
    @GetMapping("/User/resume/{employeeID}")
    public String viewResume(@PathVariable Long employeeID) {
        String specialties = resume.viewSpecialities(employeeID);
        return specialties;
    }
    
        // CREATE RESUME
    @PostMapping("/User/{userID}/createResume")
    public genericResponse createResume(@RequestBody resumeBody request, @PathVariable Long userID) {
        genericResponse response = new genericResponse();

        worker.createResume(userID, request.getSpecialities(), request.getWorkRecord(), request.getStatus());
        response.setResponse("resume created successfully");
        response.setServerStatus("ok");
        
        return response;
    }

    // UPDATE RESUME
   @PutMapping("/User/{userID}/updateresume")
   public genericResponse updateResume(@RequestBody resumeBody request, @PathVariable Long userID){
        genericResponse response = new genericResponse();

        worker.changeResume(userID, request.getSpecialities(), request.getWorkRecord(), request.getStatus());
        response.setResponse("resume updated successfull");
        response.setServerStatus("ok");

        return response; 
   }
    
}
