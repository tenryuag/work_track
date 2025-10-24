package com.worktrack.backend.controller;

import com.worktrack.backend.dto.OrderResponse;
import com.worktrack.backend.dto.UserRequest;
import com.worktrack.backend.dto.UserResponse;
import com.worktrack.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UserController {

    @Autowired
    private UserService userService;

    // Existing endpoints used by OrderService - preserve these
    @GetMapping("/operators")
    public ResponseEntity<List<OrderResponse.UserBasicDTO>> getAllOperators() {
        List<OrderResponse.UserBasicDTO> operators = userService.getAllOperators();
        return ResponseEntity.ok(operators);
    }

    @GetMapping("/basic")
    public ResponseEntity<List<OrderResponse.UserBasicDTO>> getAllUsersBasic() {
        List<OrderResponse.UserBasicDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // New user management endpoints (admin-only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsersForManagement();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest request) {
        UserResponse user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserRequest request) {
        UserResponse user = userService.updateUser(id, request);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}

