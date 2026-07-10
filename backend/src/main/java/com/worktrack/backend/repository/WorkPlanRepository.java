package com.worktrack.backend.repository;

import com.worktrack.backend.entity.WorkPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkPlanRepository extends JpaRepository<WorkPlan, Long> {
    Optional<WorkPlan> findByYearAndUserId(Integer year, Long userId);

    Optional<WorkPlan> findByYearAndUserIdIsNull(Integer year);
}
