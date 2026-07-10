package com.worktrack.backend.dto;

import java.time.LocalDateTime;

public class WorkPlanResponse {

    private Long id;
    private Integer year;
    private UserResponse user;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private java.util.List<WorkPlanTaskDTO> tasks;

    public WorkPlanResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public java.util.List<WorkPlanTaskDTO> getTasks() {
        return tasks;
    }

    public void setTasks(java.util.List<WorkPlanTaskDTO> tasks) {
        this.tasks = tasks;
    }
}
