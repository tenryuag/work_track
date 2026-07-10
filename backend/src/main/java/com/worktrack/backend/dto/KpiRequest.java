package com.worktrack.backend.dto;

import com.worktrack.backend.enums.AggregationMethod;
import com.worktrack.backend.enums.EvaluationFrequency;
import com.worktrack.backend.enums.TargetType;
import com.worktrack.backend.enums.ValueType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class KpiRequest {

    private String competence;
    private String specificRoleApplication;

    @NotBlank
    private String name;

    private String controlMeasure;

    @NotNull
    private EvaluationFrequency frequency;

    @NotNull
    private ValueType valueType;

    @NotNull
    private TargetType targetType;

    private Double targetValue1;
    private Double targetValue2;

    @NotNull
    private AggregationMethod aggregationMethod;

    private String unit;

    private Boolean evidenceRequired;
    private String description;
    private Boolean active;

    public KpiRequest() {
    }

    // Getters and Setters

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
}
