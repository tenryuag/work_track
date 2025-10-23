package com.worktrack.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class MaterialRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;

    private String description;

    @Size(max = 50, message = "Unit cannot exceed 50 characters")
    private String unit;

    private Double stockQuantity;

    // Constructors
    public MaterialRequest() {
    }

    public MaterialRequest(String name, String description, String unit, Double stockQuantity) {
        this.name = name;
        this.description = description;
        this.unit = unit;
        this.stockQuantity = stockQuantity;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Double getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Double stockQuantity) {
        this.stockQuantity = stockQuantity;
    }
}
