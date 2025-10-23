package com.worktrack.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {
    private Long id;
    private String product;
    private String description;
    private String priority;
    private String status;
    private UserBasicDTO assignedTo;
    private UserBasicDTO createdBy;
    private CustomerBasicDTO customer;
    private LocalDate deadline;
    private String machine;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<StatusLogDTO> statusLogs;

    public OrderResponse() {
    }

    public OrderResponse(Long id, String product, String description, String priority, String status, UserBasicDTO assignedTo, UserBasicDTO createdBy, CustomerBasicDTO customer, LocalDate deadline, String machine, LocalDateTime createdAt, LocalDateTime updatedAt, List<StatusLogDTO> statusLogs) {
        this.id = id;
        this.product = product;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.assignedTo = assignedTo;
        this.createdBy = createdBy;
        this.customer = customer;
        this.deadline = deadline;
        this.machine = machine;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.statusLogs = statusLogs;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public UserBasicDTO getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(UserBasicDTO assignedTo) {
        this.assignedTo = assignedTo;
    }

    public UserBasicDTO getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserBasicDTO createdBy) {
        this.createdBy = createdBy;
    }

    public CustomerBasicDTO getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerBasicDTO customer) {
        this.customer = customer;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public String getMachine() {
        return machine;
    }

    public void setMachine(String machine) {
        this.machine = machine;
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

    public List<StatusLogDTO> getStatusLogs() {
        return statusLogs;
    }

    public void setStatusLogs(List<StatusLogDTO> statusLogs) {
        this.statusLogs = statusLogs;
    }

    public CustomerBasicDTO getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerBasicDTO customer) {
        this.customer = customer;
    }

    public static class UserBasicDTO {
        private Long id;
        private String name;
        private String email;

        public UserBasicDTO() {
        }

        public UserBasicDTO(Long id, String name, String email) {
            this.id = id;
            this.name = name;
            this.email = email;
        }

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

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

    public static class CustomerBasicDTO {
        private Long id;
        private String name;
        private String company;

        public CustomerBasicDTO() {
        }

        public CustomerBasicDTO(Long id, String name, String company) {
            this.id = id;
            this.name = name;
            this.company = company;
        }

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

        public String getCompany() {
            return company;
        }

        public void setCompany(String company) {
            this.company = company;
        }
    }

    public static class StatusLogDTO {
        private Long id;
        private String previousStatus;
        private String newStatus;
        private String comment;
        private UserBasicDTO changedBy;
        private LocalDateTime createdAt;

        public StatusLogDTO() {
        }

        public StatusLogDTO(Long id, String previousStatus, String newStatus, String comment, UserBasicDTO changedBy, LocalDateTime createdAt) {
            this.id = id;
            this.previousStatus = previousStatus;
            this.newStatus = newStatus;
            this.comment = comment;
            this.changedBy = changedBy;
            this.createdAt = createdAt;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getPreviousStatus() {
            return previousStatus;
        }

        public void setPreviousStatus(String previousStatus) {
            this.previousStatus = previousStatus;
        }

        public String getNewStatus() {
            return newStatus;
        }

        public void setNewStatus(String newStatus) {
            this.newStatus = newStatus;
        }

        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }

        public UserBasicDTO getChangedBy() {
            return changedBy;
        }

        public void setChangedBy(UserBasicDTO changedBy) {
            this.changedBy = changedBy;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
    }

    public static class CustomerBasicDTO {
        private Long id;
        private String name;
        private String company;

        public CustomerBasicDTO() {
        }

        public CustomerBasicDTO(Long id, String name, String company) {
            this.id = id;
            this.name = name;
            this.company = company;
        }

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

        public String getCompany() {
            return company;
        }

        public void setCompany(String company) {
            this.company = company;
        }
    }
}
