package com.worktrack.backend.repository;

import com.worktrack.backend.entity.StatusLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StatusLogRepository extends JpaRepository<StatusLog, Long> {
    List<StatusLog> findByOrderIdOrderByCreatedAtDesc(Long orderId);
}
