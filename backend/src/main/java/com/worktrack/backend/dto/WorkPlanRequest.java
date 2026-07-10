package com.worktrack.backend.dto;

import jakarta.validation.constraints.NotNull;

public class WorkPlanRequest {

    @NotNull
    private Integer year;

    private Long userId; // Null for global

    @NotNull
    private String description;

    public WorkPlanRequest() {
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
