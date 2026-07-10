package com.worktrack.backend.service;

import com.worktrack.backend.dto.KpiRequest;
import com.worktrack.backend.dto.KpiResponse;
import com.worktrack.backend.entity.Kpi;
import com.worktrack.backend.repository.KpiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class KpiService {

    @Autowired
    private KpiRepository kpiRepository;

    @Transactional(readOnly = true)
    public List<KpiResponse> getAllKpis() {
        return kpiRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<KpiResponse> getActiveKpis() {
        return kpiRepository.findByActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public KpiResponse getKpiById(UUID id) {
        Kpi kpi = kpiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("KPI not found with id: " + id));
        return mapToResponse(kpi);
    }

    @Transactional
    public KpiResponse createKpi(KpiRequest request) {
        Kpi kpi = new Kpi();
        mapRequestToEntity(request, kpi);
        kpi.setActive(true); // Default active
        return mapToResponse(kpiRepository.save(kpi));
    }

    @Transactional
    public KpiResponse updateKpi(UUID id, KpiRequest request) {
        Kpi kpi = kpiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("KPI not found with id: " + id));
        mapRequestToEntity(request, kpi);
        if (request.getActive() != null) {
            kpi.setActive(request.getActive());
        }
        return mapToResponse(kpiRepository.save(kpi));
    }

    @Transactional
    public void deleteKpi(UUID id) {
        // Soft delete? User requested "activo (bool)" field, implying soft delete
        // capability.
        Kpi kpi = kpiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("KPI not found with id: " + id));
        kpi.setActive(false);
        kpiRepository.save(kpi);
    }

    private void mapRequestToEntity(KpiRequest request, Kpi kpi) {
        kpi.setCompetence(request.getCompetence());
        kpi.setSpecificRoleApplication(request.getSpecificRoleApplication());
        kpi.setName(request.getName());
        kpi.setControlMeasure(request.getControlMeasure());
        kpi.setFrequency(request.getFrequency());
        kpi.setValueType(request.getValueType());
        kpi.setTargetType(request.getTargetType());
        kpi.setTargetValue1(request.getTargetValue1());
        kpi.setTargetValue2(request.getTargetValue2());
        kpi.setAggregationMethod(request.getAggregationMethod());
        kpi.setUnit(request.getUnit());
        kpi.setEvidenceRequired(request.getEvidenceRequired());
        kpi.setDescription(request.getDescription());
    }

    private KpiResponse mapToResponse(Kpi kpi) {
        KpiResponse response = new KpiResponse();
        response.setId(kpi.getId());
        response.setCompetence(kpi.getCompetence());
        response.setSpecificRoleApplication(kpi.getSpecificRoleApplication());
        response.setName(kpi.getName());
        response.setControlMeasure(kpi.getControlMeasure());
        response.setFrequency(kpi.getFrequency());
        response.setValueType(kpi.getValueType());
        response.setTargetType(kpi.getTargetType());
        response.setTargetValue1(kpi.getTargetValue1());
        response.setTargetValue2(kpi.getTargetValue2());
        response.setAggregationMethod(kpi.getAggregationMethod());
        response.setUnit(kpi.getUnit());
        response.setEvidenceRequired(kpi.getEvidenceRequired());
        response.setDescription(kpi.getDescription());
        response.setActive(kpi.getActive());
        response.setCreatedAt(kpi.getCreatedAt());
        response.setUpdatedAt(kpi.getUpdatedAt());
        return response;
    }
}
