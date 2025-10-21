package com.worktrack.backend.service;

import com.worktrack.backend.dto.OrderResponse;
import com.worktrack.backend.entity.User;
import com.worktrack.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

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
}
