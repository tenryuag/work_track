package com.worktrack.backend.controller;

import com.worktrack.backend.dto.OrderResponse;
import com.worktrack.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/operators")
    public ResponseEntity<List<OrderResponse.UserBasicDTO>> getAllOperators() {
        List<OrderResponse.UserBasicDTO> operators = userService.getAllOperators();
        return ResponseEntity.ok(operators);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse.UserBasicDTO>> getAllUsers() {
        List<OrderResponse.UserBasicDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
