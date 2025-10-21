package com.worktrack.backend.repository;

import com.worktrack.backend.entity.Order;
import com.worktrack.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatus(Order.Status status);
    List<Order> findByAssignedTo(User user);
    List<Order> findByAssignedToId(Long userId);
    List<Order> findAllByOrderByCreatedAtDesc();
}
