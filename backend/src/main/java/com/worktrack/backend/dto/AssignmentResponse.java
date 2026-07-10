package com.worktrack.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AssignmentResponse {

    private Long id;
    private UserResponse worker;
    private KpiResponse kpi;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double weight;
    private Double targetOverride;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AssignmentResponse() {
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserResponse getWorker() {
        return worker;
    }

    public void setWorker(UserResponse worker) {
        this.worker = worker;
    }

    public KpiResponse getKpi() {
        return kpi;
    }

    public void setKpi(KpiResponse kpi) {
        this.kpi = kpi;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Double getTargetOverride() {
        return targetOverride;
    }

    public void setTargetOverride(Double targetOverride) {
        this.targetOverride = targetOverride;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
