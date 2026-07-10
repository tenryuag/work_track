package com.worktrack.backend.repository;

import com.worktrack.backend.entity.WorkPlanTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkPlanTaskRepository extends JpaRepository<WorkPlanTask, Long> {
    List<WorkPlanTask> findByWorkPlanId(Long workPlanId);
}
