package com.worktrack.backend.controller;

import com.worktrack.backend.dto.AssignmentRequest;
import com.worktrack.backend.dto.AssignmentResponse;
import com.worktrack.backend.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<AssignmentResponse>> getAssignmentsByWorker(@PathVariable Long workerId) {
        // Potentially check if requesting user is the worker or admin/manager
        return ResponseEntity.ok(assignmentService.getAssignmentsByWorker(workerId));
    }

    @GetMapping("/kpi/{kpiId}")
    public ResponseEntity<List<AssignmentResponse>> getAssignmentsByKpi(@PathVariable UUID kpiId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByKpi(kpiId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<AssignmentResponse> createAssignment(@Valid @RequestBody AssignmentRequest request) {
        AssignmentResponse response = assignmentService.createAssignment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<AssignmentResponse> updateAssignment(@PathVariable Long id,
            @Valid @RequestBody AssignmentRequest request) {
        return ResponseEntity.ok(assignmentService.updateAssignment(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }
}
