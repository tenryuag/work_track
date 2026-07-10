package com.worktrack.backend.controller;

import com.worktrack.backend.dto.EvaluationRequest;
import com.worktrack.backend.dto.EvaluationResponse;
import com.worktrack.backend.dto.PeriodDTO;
import com.worktrack.backend.dto.ScoreDTO;
import com.worktrack.backend.enums.EvaluationFrequency;
import com.worktrack.backend.service.EvaluationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/evaluations")
@CrossOrigin(origins = "*", maxAge = 3600)
public class EvaluationController {

    @Autowired
    private EvaluationService evaluationService;

    @GetMapping("/period")
    public ResponseEntity<PeriodDTO> getCurrentPeriod(@RequestParam EvaluationFrequency frequency) {
        return ResponseEntity.ok(evaluationService.getCurrentPeriod(frequency));
    }

    @PostMapping
    public ResponseEntity<EvaluationResponse> submitEvaluation(@Valid @RequestBody EvaluationRequest request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        EvaluationResponse response = evaluationService.submitEvaluation(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}/score")
    public ResponseEntity<ScoreDTO> getScore(@PathVariable Long id) {
        return ResponseEntity.ok(evaluationService.calculateScore(id));
    }
}
