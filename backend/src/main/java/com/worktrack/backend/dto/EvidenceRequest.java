package com.worktrack.backend.dto;

public class EvidenceRequest {

    private String fileUrl;
    private String note;

    public EvidenceRequest() {
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
