package com.worktrack.backend.repository;

import com.worktrack.backend.entity.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByAssignmentId(Long assignmentId);

    List<Evaluation> findByAssignmentIdAndPeriodStart(Long assignmentId, LocalDate periodStart);
}
