package com.employee.backend.RequestBodies;

import java.time.LocalDate;

public interface roleInfo {
    Long getId();
    String getRoleName();
    String getDescription();
    String getDuration();
    int getSalaryAmount();
    LocalDate getStartDate();
    String getPayFreq();
    String getCurrency();
    int getBonus();
    String getBenefits();
}
