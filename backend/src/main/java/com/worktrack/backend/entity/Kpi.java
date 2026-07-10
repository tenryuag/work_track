package com.worktrack.backend.entity;

import com.worktrack.backend.enums.AggregationMethod;
import com.worktrack.backend.enums.EvaluationFrequency;
import com.worktrack.backend.enums.TargetType;
import com.worktrack.backend.enums.ValueType;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "kpis")
public class Kpi {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(columnDefinition = "TEXT")
    private String competence;

    @Column(name = "specific_role_application", columnDefinition = "TEXT")
    private String specificRoleApplication;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "control_measure")
    private String controlMeasure;

    @Enumerated(EnumType.STRING)
    @Column(name = "frequency", nullable = false)
    private EvaluationFrequency frequency;

    @Enumerated(EnumType.STRING)
    @Column(name = "value_type", nullable = false)
    private ValueType valueType;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false)
    private TargetType targetType;

    @Column(name = "target_value_1")
    private Double targetValue1;

    @Column(name = "target_value_2")
    private Double targetValue2;

    @Enumerated(EnumType.STRING)
    @Column(name = "aggregation_method", nullable = false)
    private AggregationMethod aggregationMethod;

    @Column(name = "unit")
    private String unit;

    @Column(name = "evidence_required", nullable = false)
    private Boolean evidenceRequired = false;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Boolean active = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Kpi() {
    }

    // Getters and Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getCompetence() {
        return competence;
    }

    public void setCompetence(String competence) {
        this.competence = competence;
    }

    public String getSpecificRoleApplication() {
        return specificRoleApplication;
    }

    public void setSpecificRoleApplication(String specificRoleApplication) {
        this.specificRoleApplication = specificRoleApplication;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getControlMeasure() {
        return controlMeasure;
    }

    public void setControlMeasure(String controlMeasure) {
        this.controlMeasure = controlMeasure;
    }

    public EvaluationFrequency getFrequency() {
        return frequency;
    }

    public void setFrequency(EvaluationFrequency frequency) {
        this.frequency = frequency;
    }

    public ValueType getValueType() {
        return valueType;
    }

    public void setValueType(ValueType valueType) {
        this.valueType = valueType;
    }

    public TargetType getTargetType() {
        return targetType;
    }

    public void setTargetType(TargetType targetType) {
        this.targetType = targetType;
    }

    public Double getTargetValue1() {
        return targetValue1;
    }

    public void setTargetValue1(Double targetValue1) {
        this.targetValue1 = targetValue1;
    }

    public Double getTargetValue2() {
        return targetValue2;
    }

    public void setTargetValue2(Double targetValue2) {
        this.targetValue2 = targetValue2;
    }

    public AggregationMethod getAggregationMethod() {
        return aggregationMethod;
    }

    public void setAggregationMethod(AggregationMethod aggregationMethod) {
        this.aggregationMethod = aggregationMethod;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Boolean getEvidenceRequired() {
        return evidenceRequired;
    }

    public void setEvidenceRequired(Boolean evidenceRequired) {
        this.evidenceRequired = evidenceRequired;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
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
