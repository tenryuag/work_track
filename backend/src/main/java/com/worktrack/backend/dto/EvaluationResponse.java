package com.worktrack.backend.dto;

import com.worktrack.backend.enums.EvaluationStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class EvaluationResponse {

    private Long id;
    private AssignmentResponse assignment;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private Boolean valueBoolean;
    private Double valueNumber;
    private String valueText;
    private EvaluationStatus status;
    private UserResponse createdBy;
    private List<EvidenceResponse> evidence;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public EvaluationResponse() {
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AssignmentResponse getAssignment() {
        return assignment;
    }

    public void setAssignment(AssignmentResponse assignment) {
        this.assignment = assignment;
    }

    public LocalDate getPeriodStart() {
        return periodStart;
    }

    public void setPeriodStart(LocalDate periodStart) {
        this.periodStart = periodStart;
    }

    public LocalDate getPeriodEnd() {
        return periodEnd;
    }

    public void setPeriodEnd(LocalDate periodEnd) {
        this.periodEnd = periodEnd;
    }

    public Boolean getValueBoolean() {
        return valueBoolean;
    }

    public void setValueBoolean(Boolean valueBoolean) {
        this.valueBoolean = valueBoolean;
    }

    public Double getValueNumber() {
        return valueNumber;
    }

    public void setValueNumber(Double valueNumber) {
        this.valueNumber = valueNumber;
    }

    public String getValueText() {
        return valueText;
    }

    public void setValueText(String valueText) {
        this.valueText = valueText;
    }

    public EvaluationStatus getStatus() {
        return status;
    }

    public void setStatus(EvaluationStatus status) {
        this.status = status;
    }

    public UserResponse getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserResponse createdBy) {
        this.createdBy = createdBy;
    }

    public List<EvidenceResponse> getEvidence() {
        return evidence;
    }

    public void setEvidence(List<EvidenceResponse> evidence) {
        this.evidence = evidence;
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
