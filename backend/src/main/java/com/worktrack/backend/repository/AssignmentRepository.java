package com.worktrack.backend.repository;

import com.worktrack.backend.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByWorkerId(Long workerId);

    List<Assignment> findByKpiId(UUID kpiId);

    @Query("SELECT a FROM Assignment a JOIN FETCH a.kpi")
    List<Assignment> findAllWithKpi();
}
