package com.worktrack.backend.service;

import com.worktrack.backend.dto.AssignmentRequest;
import com.worktrack.backend.dto.AssignmentResponse;
import com.worktrack.backend.dto.KpiResponse;
import com.worktrack.backend.dto.UserResponse;
import com.worktrack.backend.entity.Assignment;
import com.worktrack.backend.entity.Kpi;
import com.worktrack.backend.entity.User;
import com.worktrack.backend.repository.AssignmentRepository;
import com.worktrack.backend.repository.KpiRepository;
import com.worktrack.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private KpiRepository kpiRepository;

    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAssignmentsByWorker(Long workerId) {
        return assignmentRepository.findByWorkerId(workerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAssignmentsByKpi(UUID kpiId) {
        return assignmentRepository.findByKpiId(kpiId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AssignmentResponse createAssignment(AssignmentRequest request) {
        User worker = userRepository.findById(request.getWorkerId())
                .orElseThrow(() -> new RuntimeException("Worker not found"));
        Kpi kpi = kpiRepository.findById(request.getKpiId())
                .orElseThrow(() -> new RuntimeException("KPI not found"));

        Assignment assignment = new Assignment();
        assignment.setWorker(worker);
        assignment.setKpi(kpi);
        assignment.setStartDate(request.getStartDate());
        assignment.setEndDate(request.getEndDate());
        assignment.setWeight(request.getWeight());
        assignment.setTargetOverride(request.getTargetOverride());

        return mapToResponse(assignmentRepository.save(assignment));
    }

    @Transactional
    public AssignmentResponse updateAssignment(Long id, AssignmentRequest request) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        // Allowed updates
        assignment.setStartDate(request.getStartDate());
        assignment.setEndDate(request.getEndDate());
        assignment.setWeight(request.getWeight());
        assignment.setTargetOverride(request.getTargetOverride());

        return mapToResponse(assignmentRepository.save(assignment));
    }

    @Transactional
    public void deleteAssignment(Long id) {
        assignmentRepository.deleteById(id);
    }

    private AssignmentResponse mapToResponse(Assignment assignment) {
        AssignmentResponse response = new AssignmentResponse();
        response.setId(assignment.getId());
        response.setWorker(new UserResponse(assignment.getWorker()));

        // Manual mapping of KpiResponse since KpiService mapToResponse is private
        // Ideally should separate Mapper class. For now duplicate logic or exposing
        // public mapper in Service.
        // I will do manual mapping for now to avoid modifying KpiService again
        // unnecessarily.
        response.setKpi(mapKpiToResponse(assignment.getKpi()));

        response.setStartDate(assignment.getStartDate());
        response.setEndDate(assignment.getEndDate());
        response.setWeight(assignment.getWeight());
        response.setTargetOverride(assignment.getTargetOverride());
        response.setCreatedAt(assignment.getCreatedAt());
        response.setUpdatedAt(assignment.getUpdatedAt());
        return response;
    }

    // Duplicated from KpiService - in a real app, use a Mapper bean/Utils
    private KpiResponse mapKpiToResponse(Kpi kpi) {
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
