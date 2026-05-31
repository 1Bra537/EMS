package com.employee.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.employee.backend.RequestBodies.Offer;
import com.employee.backend.RequestBodies.business;
import com.employee.backend.classes.Manager;

@RestController
public class Business {
    @Autowired
    private Manager manager;
    
    @PostMapping("/User/director/{directorID}/company/{companyID}/createoffer")
    public String createOffer(@PathVariable Long directorID, @PathVariable Long companyID, @RequestBody Offer offer) {
        Boolean success = manager.createOffer(directorID, companyID, offer.getRoleName(), offer.getDescription(), offer.getDuration(), offer.getSalary(), offer.getStartDate(), offer.getPayFrequency(), offer.getCurrency(), offer.getBonus(), offer.getBenefits());
        return success ? "successful change" : "Access denied: you do not own this company";
    }

    @PostMapping("/User/director/manager/{directorID}/company/create")
    public String createBusiness(@PathVariable Long directorID,  @RequestBody business business) {
        manager.createBusiness(directorID, business.getCompanyName(), business.getCreationDate(), business.getDescription(), business.getNetWorth());
        
        return "successful creation";
    }
    
}
