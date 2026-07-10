package com.worktrack.backend.service;

import com.worktrack.backend.dto.*;
import com.worktrack.backend.entity.*;
import com.worktrack.backend.enums.EvaluationFrequency;
import com.worktrack.backend.enums.TargetType;
import com.worktrack.backend.repository.AssignmentRepository;
import com.worktrack.backend.repository.EvaluationRepository;
import com.worktrack.backend.repository.EvidenceRepository;
import com.worktrack.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.IsoFields;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EvaluationService {

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private EvidenceRepository evidenceRepository;

    @Autowired
    private UserRepository userRepository;

    public PeriodDTO getCurrentPeriod(EvaluationFrequency frequency) {
        LocalDate now = LocalDate.now();
        LocalDate start;
        LocalDate end;
        String label;

        switch (frequency) {
            case DAILY:
                start = now;
                end = now;
                label = now.toString();
                break;
            case WEEKLY:
                start = now.with(IsoFields.WEEK_OF_WEEK_BASED_YEAR, now.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR))
                        .with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));
                end = start.plusDays(6);
                label = "Week " + now.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR) + " " + now.getYear();
                break;
            case BIWEEKLY:
                if (now.getDayOfMonth() <= 15) {
                    start = now.withDayOfMonth(1);
                    end = now.withDayOfMonth(15);
                    label = "First Half " + now.getMonth() + " " + now.getYear();
                } else {
                    start = now.withDayOfMonth(16);
                    end = now.with(TemporalAdjusters.lastDayOfMonth());
                    label = "Second Half " + now.getMonth() + " " + now.getYear();
                }
                break;
            case MONTHLY:
                start = now.with(TemporalAdjusters.firstDayOfMonth());
                end = now.with(TemporalAdjusters.lastDayOfMonth());
                label = now.getMonth() + " " + now.getYear();
                break;
            case QUARTERLY:
                int quarter = now.get(IsoFields.QUARTER_OF_YEAR);
                int month = now.getMonthValue();
                int qStartMonth = ((month - 1) / 3) * 3 + 1;
                start = LocalDate.of(now.getYear(), qStartMonth, 1);
                end = start.plusMonths(3).minusDays(1);
                label = "Q" + quarter + " " + now.getYear();
                break;
            case SEMIANNUAL:
                if (now.getMonthValue() <= 6) {
                    start = LocalDate.of(now.getYear(), 1, 1);
                    end = LocalDate.of(now.getYear(), 6, 30);
                    label = "H1 " + now.getYear();
                } else {
                    start = LocalDate.of(now.getYear(), 7, 1);
                    end = LocalDate.of(now.getYear(), 12, 31);
                    label = "H2 " + now.getYear();
                }
                break;
            default:
                throw new IllegalArgumentException("Unknown frequency");
        }
        return new PeriodDTO(start, end, label);
    }

    @Transactional
    public EvaluationResponse submitEvaluation(EvaluationRequest request, String userEmail) {
        Assignment assignment = assignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Evaluation evaluation = new Evaluation();
        evaluation.setAssignment(assignment);
        evaluation.setPeriodStart(request.getPeriodStart());
        evaluation.setPeriodEnd(request.getPeriodEnd());
        evaluation.setValueBoolean(request.getValueBoolean());
        evaluation.setValueNumber(request.getValueNumber());
        evaluation.setValueText(request.getValueText());
        evaluation.setStatus(request.getStatus());
        evaluation.setCreatedBy(user);

        Evaluation saved = evaluationRepository.save(evaluation);

        // Handle Evidence
        if (request.getEvidence() != null && !request.getEvidence().isEmpty()) {
            List<Evidence> evidenceList = new ArrayList<>();
            for (EvidenceRequest evReq : request.getEvidence()) {
                Evidence evidence = new Evidence();
                evidence.setEvaluation(saved);
                evidence.setFileUrl(evReq.getFileUrl());
                evidence.setNote(evReq.getNote());
                evidenceList.add(evidence);
            }
            evidenceRepository.saveAll(evidenceList);
        }

        return mapToResponse(saved);
    }

    public ScoreDTO calculateScore(Long evaluationId) {
        Evaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new RuntimeException("Evaluation not found"));

        Assignment assignment = evaluation.getAssignment();
        Kpi kpi = assignment.getKpi();

        Double actualValue = evaluation.getValueNumber();
        if (actualValue == null) {
            // Handle Boolean
            if (evaluation.getValueBoolean() != null) {
                actualValue = evaluation.getValueBoolean() ? 1.0 : 0.0;
            } else {
                return new ScoreDTO(assignment.getId(), evaluation.getPeriodStart(), 0.0, 0.0);
            }
        }

        Double target = assignment.getTargetOverride() != null ? assignment.getTargetOverride() : kpi.getTargetValue1();
        // Fallback for types that don't need target value 1 (like Boolean)
        if (target == null)
            target = 1.0;

        Double normalizedScore = 0.0;

        if (kpi.getValueType() == com.worktrack.backend.enums.ValueType.BOOLEAN) {
            normalizedScore = (evaluation.getValueBoolean() != null && evaluation.getValueBoolean()) ? 1.0 : 0.0;
        } else {
            TargetType type = kpi.getTargetType();
            switch (type) {
                case MIN: // Actual >= Target is Good
                    if (actualValue >= target)
                        normalizedScore = 1.0;
                    else
                        normalizedScore = target != 0 ? actualValue / target : 0.0;
                    break;
                case MAX: // Actual <= Target is Good
                    if (actualValue <= target)
                        normalizedScore = 1.0;
                    else
                        normalizedScore = actualValue != 0 ? target / actualValue : 0.0;
                    break;
                case EQUAL:
                    normalizedScore = Math.abs(actualValue - target) < 0.001 ? 1.0 : 0.0;
                    break;
                case RANGE:
                    Double t1 = kpi.getTargetValue1(); // min
                    Double t2 = kpi.getTargetValue2(); // max
                    if (t1 != null && t2 != null && actualValue >= t1 && actualValue <= t2) {
                        normalizedScore = 1.0;
                    } else {
                        normalizedScore = 0.0;
                    }
                    break;
            }
        }

        return new ScoreDTO(assignment.getId(), evaluation.getPeriodStart(), actualValue, normalizedScore);
    }

    private EvaluationResponse mapToResponse(Evaluation evaluation) {
        EvaluationResponse response = new EvaluationResponse();
        response.setId(evaluation.getId());

        // Map Assignment Basic - manually creating assignment response shell
        AssignmentResponse assignmentResp = new AssignmentResponse();
        assignmentResp.setId(evaluation.getAssignment().getId());
        // For simple response, we might not populate full assignment details unless
        // needed
        // But let's at least give it a shell so frontend knows the ID
        response.setAssignment(assignmentResp);

        response.setPeriodStart(evaluation.getPeriodStart());
        response.setPeriodEnd(evaluation.getPeriodEnd());
        response.setValueBoolean(evaluation.getValueBoolean());
        response.setValueNumber(evaluation.getValueNumber());
        response.setValueText(evaluation.getValueText());
        response.setStatus(evaluation.getStatus());
        response.setCreatedBy(new UserResponse(evaluation.getCreatedBy()));
        response.setCreatedAt(evaluation.getCreatedAt());
        response.setUpdatedAt(evaluation.getUpdatedAt());

        List<Evidence> evidenceList = evidenceRepository.findByEvaluationId(evaluation.getId());
        response.setEvidence(evidenceList.stream().map(e -> {
            EvidenceResponse er = new EvidenceResponse();
            er.setId(e.getId());
            er.setFileUrl(e.getFileUrl());
            er.setNote(e.getNote());
            er.setCreatedAt(e.getCreatedAt());
            return er;
        }).collect(Collectors.toList()));

        return response;
    }
}
