package com.worktrack.backend.dto;

import com.worktrack.backend.entity.Material;

import java.time.LocalDateTime;

public class MaterialResponse {

    private Long id;
    private String name;
    private String description;
    private String unit;
    private Double stockQuantity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public MaterialResponse() {
    }

    public MaterialResponse(Long id, String name, String description, String unit, Double stockQuantity, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.unit = unit;
        this.stockQuantity = stockQuantity;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public MaterialResponse(Material material) {
        this.id = material.getId();
        this.name = material.getName();
        this.description = material.getDescription();
        this.unit = material.getUnit();
        this.stockQuantity = material.getStockQuantity();
        this.createdAt = material.getCreatedAt();
        this.updatedAt = material.getUpdatedAt();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
