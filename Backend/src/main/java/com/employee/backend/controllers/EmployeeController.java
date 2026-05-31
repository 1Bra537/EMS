package com.employee.backend.controllers;

import com.employee.backend.RequestBodies.genericResponse;
import com.employee.backend.RequestBodies.loginBody;
import com.employee.backend.RequestBodies.loginResponse;
import com.employee.backend.RequestBodies.logoutResponse;
import com.employee.backend.RequestBodies.signupBody;
import com.employee.backend.RequestBodies.signupResponse;
import com.employee.backend.classes.Worker;
import com.employee.backend.classes.Employee;
import com.employee.backend.RequestBodies.EmployeeJobInfo;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
public class EmployeeController {

    @Autowired
    private Worker worker;
    @Autowired 
    private Employee employee;
    
    // SIGNUP
    @PostMapping("/User/signup")
    public signupResponse signup(@RequestBody signupBody employee) {
        signupResponse response =  worker.signup(employee.getName(), employee.getEmail(), employee.getPassword(), employee.getAge(), employee.getStatus());

        if ( response.getId() == null){
            response.setServerStatus("failed");    
        }
        else{
            response.setServerStatus("ok");
        }
        
        return response;
    }

    // LOGIN
    @PostMapping("/User/login")
    public loginResponse login(@RequestBody loginBody request) {
        loginResponse response = worker.login(request.getEmail(), request.getPassword(), request.getStatus());

        if ( response.getId() == null){
            response.setServerStatus("failed");    
        }
        else{
            response.setServerStatus("ok");
        }

        return response;
    }

    // LOGOUT
    @DeleteMapping("/User/director/{directorID}/logout")
    public logoutResponse dirLogout(@PathVariable Long directorID) {
        logoutResponse response = worker.directorLogout(directorID);
        response.setServerStatus("ok");
        
        return response;
    }

    // setting employee logout 
    @DeleteMapping("/User/employee/{empID}/logout")
    public logoutResponse empLogout(@PathVariable Long empID) {
        logoutResponse response = worker.employeeLogout(empID);
        response.setServerStatus("ok");
        
        return response;
    }
    
    // CLOCK IN
    @PatchMapping("/User/employee/{employeeID}/clockin")
    public genericResponse clockIn(@PathVariable Long employeeID, @RequestBody int time) {
        genericResponse response = new genericResponse();
        employee.setClockIn(employeeID, time);

        response.setResponse("clock-in added successfully");
        response.setServerStatus("ok");
        return response;
    }

    @PatchMapping("/User/employee/{employeeID}/clockout")
    public genericResponse clockOut(@PathVariable Long employeeID, @RequestBody int time) {
        genericResponse response = new genericResponse();
        employee.setClockOut(employeeID, time);

        response.setResponse("clock-out added successfully");
        response.setServerStatus("ok");
        return response;
    }

    // quit job
    @DeleteMapping("/User/employee/{employeeID}/quit/{companyID}")
    public genericResponse quitJob(@PathVariable Long companyID, @PathVariable Long employeeID) {
        genericResponse response = new genericResponse();

        employee.QuitJob(employeeID, companyID);
        response.setResponse("jobless man");
        response.setServerStatus("ok");
        
        return response;
    }

    // GET ALL JOBS (ACTIVE & PENDING)
    @GetMapping("/User/employee/{employeeID}/jobs")
    public List<EmployeeJobInfo> getEmployeeJobs(@PathVariable Long employeeID) {
        return employee.getEmployeeJobs(employeeID);
    }

    @PostMapping("/User/employee/{employeeID}/enroll/company/{companyID}")
    public genericResponse enroll(@PathVariable Long employeeID, @PathVariable Long companyID, @RequestBody int pricingBid) {
        genericResponse response = worker.enroll(employeeID, companyID, pricingBid);
        
        response.setServerStatus("ok");
        return response;
    }
    // @RestController
    // @RequestMapping("/api/employees")
    // public class EmployeeController{
    //     @GetMapping
    //     public List<Employee>
    //     getEmployees(){
    //         return service.getAllEmployees();
    //     }
    // }

   
    
    
}