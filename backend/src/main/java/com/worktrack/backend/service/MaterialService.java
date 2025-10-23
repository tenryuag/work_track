package com.worktrack.backend.service;

import com.worktrack.backend.dto.MaterialRequest;
import com.worktrack.backend.dto.MaterialResponse;
import com.worktrack.backend.entity.Material;
import com.worktrack.backend.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaterialService {

    @Autowired
    private MaterialRepository materialRepository;

    @Transactional(readOnly = true)
    public List<MaterialResponse> getAllMaterials() {
        return materialRepository.findAllByOrderByNameAsc()
                .stream()
                .map(MaterialResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MaterialResponse getMaterialById(Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + id));
        return new MaterialResponse(material);
    }

    @Transactional
    public MaterialResponse createMaterial(MaterialRequest request) {
        // Check if material with same name already exists
        if (request.getName() != null && !request.getName().isEmpty()
                && materialRepository.existsByName(request.getName())) {
            throw new RuntimeException("Material with this name already exists");
        }

        Material material = new Material();
        material.setName(request.getName());
        material.setDescription(request.getDescription());
        material.setUnit(request.getUnit());
        material.setStockQuantity(request.getStockQuantity());

        Material saved = materialRepository.save(material);
        return new MaterialResponse(saved);
    }

    @Transactional
    public MaterialResponse updateMaterial(Long id, MaterialRequest request) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + id));

        // Check if name is being changed and if new name already exists
        if (request.getName() != null && !request.getName().isEmpty()
                && !request.getName().equals(material.getName())
                && materialRepository.existsByName(request.getName())) {
            throw new RuntimeException("Material with this name already exists");
        }

        material.setName(request.getName());
        material.setDescription(request.getDescription());
        material.setUnit(request.getUnit());
        material.setStockQuantity(request.getStockQuantity());

        Material updated = materialRepository.save(material);
        return new MaterialResponse(updated);
    }

    @Transactional
    public void deleteMaterial(Long id) {
        if (!materialRepository.existsById(id)) {
            throw new RuntimeException("Material not found with id: " + id);
        }
        materialRepository.deleteById(id);
    }
}
