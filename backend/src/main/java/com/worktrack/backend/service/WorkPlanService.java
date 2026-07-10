package com.worktrack.backend.service;

import com.worktrack.backend.dto.UserResponse;
import com.worktrack.backend.dto.WorkPlanRequest;
import com.worktrack.backend.dto.WorkPlanResponse;
import com.worktrack.backend.entity.User;
import com.worktrack.backend.entity.WorkPlan;
import com.worktrack.backend.repository.UserRepository;
import com.worktrack.backend.repository.WorkPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class WorkPlanService {

    @Autowired
    private WorkPlanRepository workPlanRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.worktrack.backend.repository.WorkPlanTaskRepository workPlanTaskRepository;

    @Transactional(readOnly = true)
    public WorkPlanResponse getGlobalPlan(Integer year) {
        WorkPlan plan = workPlanRepository.findByYearAndUserIdIsNull(year)
                .orElse(null);
        return plan != null ? mapToResponse(plan) : null;
    }

    @Transactional(readOnly = true)
    public WorkPlanResponse getUserPlan(Integer year, Long userId) {
        WorkPlan plan = workPlanRepository.findByYearAndUserId(year, userId)
                .orElse(null);
        return plan != null ? mapToResponse(plan) : null;
    }

    @Transactional
    public WorkPlanResponse upsertPlan(WorkPlanRequest request) {
        WorkPlan plan;
        if (request.getUserId() != null) {
            plan = workPlanRepository.findByYearAndUserId(request.getYear(), request.getUserId())
                    .orElse(new WorkPlan());
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            plan.setUser(user);
        } else {
            plan = workPlanRepository.findByYearAndUserIdIsNull(request.getYear())
                    .orElse(new WorkPlan());
            plan.setUser(null);
        }

        plan.setYear(request.getYear());
        plan.setDescription(request.getDescription());

        return mapToResponse(workPlanRepository.save(plan));
    }

    @Transactional
    public WorkPlanResponse addTask(Long workPlanId, com.worktrack.backend.dto.WorkPlanTaskDTO taskDTO) {
        WorkPlan plan = workPlanRepository.findById(workPlanId)
                .orElseThrow(() -> new RuntimeException("WorkPlan not found"));

        com.worktrack.backend.entity.WorkPlanTask task = new com.worktrack.backend.entity.WorkPlanTask();
        task.setWorkPlan(plan);
        task.setName(taskDTO.getName());
        task.setStartDate(taskDTO.getStartDate());
        task.setEndDate(taskDTO.getEndDate());
        task.setProgress(taskDTO.getProgress());
        task.setStatus(taskDTO.getStatus());

        workPlanTaskRepository.save(task);
        return mapToResponse(plan);
    }

    @Transactional
    public WorkPlanResponse updateTask(Long taskId, com.worktrack.backend.dto.WorkPlanTaskDTO taskDTO) {
        com.worktrack.backend.entity.WorkPlanTask task = workPlanTaskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setName(taskDTO.getName());
        task.setStartDate(taskDTO.getStartDate());
        task.setEndDate(taskDTO.getEndDate());
        task.setProgress(taskDTO.getProgress());
        task.setStatus(taskDTO.getStatus());

        workPlanTaskRepository.save(task);
        return mapToResponse(task.getWorkPlan());
    }

    @Transactional
    public WorkPlanResponse deleteTask(Long taskId) {
        com.worktrack.backend.entity.WorkPlanTask task = workPlanTaskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        WorkPlan plan = task.getWorkPlan();
        workPlanTaskRepository.delete(task);
        return mapToResponse(plan);
    }

    private WorkPlanResponse mapToResponse(WorkPlan plan) {
        WorkPlanResponse response = new WorkPlanResponse();
        response.setId(plan.getId());
        response.setYear(plan.getYear());
        if (plan.getUser() != null) {
            response.setUser(new UserResponse(plan.getUser()));
        }
        response.setDescription(plan.getDescription());
        response.setCreatedAt(plan.getCreatedAt());
        response.setUpdatedAt(plan.getUpdatedAt());

        // Map tasks
        java.util.List<com.worktrack.backend.entity.WorkPlanTask> tasks = workPlanTaskRepository
                .findByWorkPlanId(plan.getId());
        response.setTasks(tasks.stream().map(t -> {
            com.worktrack.backend.dto.WorkPlanTaskDTO dto = new com.worktrack.backend.dto.WorkPlanTaskDTO();
            dto.setId(t.getId());
            dto.setWorkPlanId(t.getWorkPlan().getId());
            dto.setName(t.getName());
            dto.setStartDate(t.getStartDate());
            dto.setEndDate(t.getEndDate());
            dto.setProgress(t.getProgress());
            dto.setStatus(t.getStatus());
            return dto;
        }).collect(java.util.stream.Collectors.toList()));

        return response;
    }
}
