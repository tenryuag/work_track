package com.worktrack.backend.service;

import com.worktrack.backend.dto.OrderResponse;
import com.worktrack.backend.dto.UserRequest;
import com.worktrack.backend.dto.UserResponse;
import com.worktrack.backend.entity.User;
import com.worktrack.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Existing methods used by OrderService - preserve these
    public List<OrderResponse.UserBasicDTO> getAllOperators() {
        return userRepository.findByRole(User.Role.OPERATOR).stream()
                .filter(User::getActive)
                .map(user -> new OrderResponse.UserBasicDTO(user.getId(), user.getName(), user.getEmail()))
                .collect(Collectors.toList());
    }

    public List<OrderResponse.UserBasicDTO> getAllUsers() {
        return userRepository.findByActiveTrue().stream()
                .map(user -> new OrderResponse.UserBasicDTO(user.getId(), user.getName(), user.getEmail()))
                .collect(Collectors.toList());
    }

    // New CRUD methods for user management
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsersForManagement() {
        return userRepository.findAll().stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return new UserResponse(user);
    }

    @Transactional
    public UserResponse createUser(UserRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User with this email already exists");
        }

        // Validate role
        User.Role role;
        try {
            role = User.Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + request.getRole());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setActive(true);

        User saved = userRepository.save(user);
        return new UserResponse(saved);
    }

    @Transactional
    public UserResponse updateUser(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Check if email is being changed and if new email already exists
        if (!request.getEmail().equals(user.getEmail()) &&
                userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User with this email already exists");
        }

        // Validate role
        User.Role role;
        try {
            role = User.Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + request.getRole());
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRole(role);

        // Only update password if provided
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updated = userRepository.save(user);
        return new UserResponse(updated);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Soft delete by setting active to false
        user.setActive(false);
        userRepository.save(user);
    }
}
