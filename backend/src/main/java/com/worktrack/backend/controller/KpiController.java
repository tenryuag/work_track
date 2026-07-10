package com.worktrack.backend.controller;

import com.worktrack.backend.dto.KpiRequest;
import com.worktrack.backend.dto.KpiResponse;
import com.worktrack.backend.service.KpiService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/kpis")
@CrossOrigin(origins = "*", maxAge = 3600)
public class KpiController {

    @Autowired
    private KpiService kpiService;

    @GetMapping
    public ResponseEntity<List<KpiResponse>> getAllKpis() {
        return ResponseEntity.ok(kpiService.getAllKpis());
    }

    @GetMapping("/active")
    public ResponseEntity<List<KpiResponse>> getActiveKpis() {
        return ResponseEntity.ok(kpiService.getActiveKpis());
    }

    @GetMapping("/{id}")
    public ResponseEntity<KpiResponse> getKpiById(@PathVariable UUID id) {
        return ResponseEntity.ok(kpiService.getKpiById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<KpiResponse> createKpi(@Valid @RequestBody KpiRequest request) {
        KpiResponse response = kpiService.createKpi(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<KpiResponse> updateKpi(@PathVariable UUID id, @Valid @RequestBody KpiRequest request) {
        return ResponseEntity.ok(kpiService.updateKpi(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteKpi(@PathVariable UUID id) {
        kpiService.deleteKpi(id);
        return ResponseEntity.noContent().build();
    }
}
