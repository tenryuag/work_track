package com.worktrack.backend.controller;

import com.worktrack.backend.dto.MaterialRequest;
import com.worktrack.backend.dto.MaterialResponse;
import com.worktrack.backend.service.MaterialService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'OPERATOR')")
    public ResponseEntity<List<MaterialResponse>> getAllMaterials() {
        List<MaterialResponse> materials = materialService.getAllMaterials();
        return ResponseEntity.ok(materials);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'OPERATOR')")
    public ResponseEntity<MaterialResponse> getMaterialById(@PathVariable Long id) {
        MaterialResponse material = materialService.getMaterialById(id);
        return ResponseEntity.ok(material);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MaterialResponse> createMaterial(@Valid @RequestBody MaterialRequest request) {
        MaterialResponse material = materialService.createMaterial(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(material);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MaterialResponse> updateMaterial(
            @PathVariable Long id,
            @Valid @RequestBody MaterialRequest request) {
        MaterialResponse material = materialService.updateMaterial(id, request);
        return ResponseEntity.ok(material);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long id) {
        materialService.deleteMaterial(id);
        return ResponseEntity.noContent().build();
    }
}
