package com.worktrack.backend.dto;

import java.time.LocalDate;

public class ScoreDTO {

    private Long assignmentId;
    private LocalDate periodStart;
    private Double score; // 0-100 or raw
    private Double normalizedScore; // 0.0 - 1.0

    public ScoreDTO() {
    }

    public ScoreDTO(Long assignmentId, LocalDate periodStart, Double score, Double normalizedScore) {
        this.assignmentId = assignmentId;
        this.periodStart = periodStart;
        this.score = score;
        this.normalizedScore = normalizedScore;
    }

    public Long getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(Long assignmentId) {
        this.assignmentId = assignmentId;
    }

    public LocalDate getPeriodStart() {
        return periodStart;
    }

    public void setPeriodStart(LocalDate periodStart) {
        this.periodStart = periodStart;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Double getNormalizedScore() {
        return normalizedScore;
    }

    public void setNormalizedScore(Double normalizedScore) {
        this.normalizedScore = normalizedScore;
    }
}
