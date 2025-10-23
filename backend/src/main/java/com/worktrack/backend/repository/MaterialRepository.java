package com.worktrack.backend.repository;

import com.worktrack.backend.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {

    List<Material> findAllByOrderByNameAsc();

    Optional<Material> findByName(String name);

    boolean existsByName(String name);
}
