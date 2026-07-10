package com.worktrack.backend.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public class AssignmentRequest {

    @NotNull
    private Long workerId;

    @NotNull
    private UUID kpiId;

    @NotNull
    private LocalDate startDate;

    private LocalDate endDate;

    private Double weight;

    private Double targetOverride;

    public AssignmentRequest() {
    }

    // Getters and Setters

    public Long getWorkerId() {
        return workerId;
    }

    public void setWorkerId(Long workerId) {
        this.workerId = workerId;
    }

    public UUID getKpiId() {
        return kpiId;
    }

    public void setKpiId(UUID kpiId) {
        this.kpiId = kpiId;
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
}
