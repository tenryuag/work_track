package com.worktrack.backend.controller;

import com.worktrack.backend.dto.WorkPlanRequest;
import com.worktrack.backend.dto.WorkPlanResponse;
import com.worktrack.backend.dto.WorkPlanTaskDTO;
import com.worktrack.backend.service.WorkPlanService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/work-plans")
@CrossOrigin(origins = "*", maxAge = 3600)
public class WorkPlanController {

    @Autowired
    private WorkPlanService workPlanService;

    @GetMapping("/global")
    public ResponseEntity<WorkPlanResponse> getGlobalPlan(@RequestParam Integer year) {
        return ResponseEntity.ok(workPlanService.getGlobalPlan(year));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<WorkPlanResponse> getUserPlan(@RequestParam Integer year, @PathVariable Long userId) {
        return ResponseEntity.ok(workPlanService.getUserPlan(year, userId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<WorkPlanResponse> upsertPlan(@Valid @RequestBody WorkPlanRequest request) {
        return ResponseEntity.ok(workPlanService.upsertPlan(request));
    }

    @PostMapping("/{workPlanId}/tasks")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<WorkPlanResponse> addTask(@PathVariable Long workPlanId,
            @RequestBody WorkPlanTaskDTO taskDTO) {
        return ResponseEntity.ok(workPlanService.addTask(workPlanId, taskDTO));
    }

    @PutMapping("/tasks/{taskId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<WorkPlanResponse> updateTask(@PathVariable Long taskId,
            @RequestBody WorkPlanTaskDTO taskDTO) {
        return ResponseEntity.ok(workPlanService.updateTask(taskId, taskDTO));
    }

    @DeleteMapping("/tasks/{taskId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<WorkPlanResponse> deleteTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(workPlanService.deleteTask(taskId));
    }
}
