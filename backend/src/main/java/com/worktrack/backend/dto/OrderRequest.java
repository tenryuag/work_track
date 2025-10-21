package com.worktrack.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class OrderRequest {

    @NotBlank(message = "Producto es requerido")
    private String product;

    private String description;

    @NotNull(message = "Prioridad es requerida")
    private String priority; // HIGH, MEDIUM, LOW

    @NotNull(message = "Asignado a es requerido")
    private Long assignedToId;

    private Long customerId;

    @NotNull(message = "Fecha límite es requerida")
    private LocalDate deadline;

    public OrderRequest() {
    }

    public OrderRequest(String product, String description, String priority, Long assignedToId, Long customerId, LocalDate deadline) {
        this.product = product;
        this.description = description;
        this.priority = priority;
        this.assignedToId = assignedToId;
        this.customerId = customerId;
        this.deadline = deadline;
    }

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public Long getAssignedToId() {
        return assignedToId;
    }

    public void setAssignedToId(Long assignedToId) {
        this.assignedToId = assignedToId;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }
}
