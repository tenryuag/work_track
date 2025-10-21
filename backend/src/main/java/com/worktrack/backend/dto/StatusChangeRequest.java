package com.worktrack.backend.dto;

import jakarta.validation.constraints.NotNull;

public class StatusChangeRequest {

    @NotNull(message = "Nuevo estado es requerido")
    private String newStatus; // PENDING, IN_PROGRESS, COMPLETED, DELIVERED

    private String comment;

    private String machine; // Machine identifier (optional)

    public StatusChangeRequest() {
    }

    public StatusChangeRequest(String newStatus, String comment, String machine) {
        this.newStatus = newStatus;
        this.comment = comment;
        this.machine = machine;
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

    public String getMachine() {
        return machine;
    }

    public void setMachine(String machine) {
        this.machine = machine;
    }
}
