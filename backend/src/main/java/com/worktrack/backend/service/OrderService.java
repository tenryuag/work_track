package com.worktrack.backend.service;

import com.worktrack.backend.dto.OrderRequest;
import com.worktrack.backend.dto.OrderResponse;
import com.worktrack.backend.dto.StatusChangeRequest;
import com.worktrack.backend.entity.Customer;
import com.worktrack.backend.entity.Material;
import com.worktrack.backend.entity.Order;
import com.worktrack.backend.entity.StatusLog;
import com.worktrack.backend.entity.User;
import com.worktrack.backend.repository.CustomerRepository;
import com.worktrack.backend.repository.MaterialRepository;
import com.worktrack.backend.repository.OrderRepository;
import com.worktrack.backend.repository.StatusLogRepository;
import com.worktrack.backend.repository.UserRepository;
import com.worktrack.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StatusLogRepository statusLogRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        User currentUser = getCurrentUser();
        User assignedUser = userRepository.findById(request.getAssignedToId())
                .orElseThrow(() -> new RuntimeException("Usuario asignado no encontrado"));

        Order order = new Order();
        order.setProduct(request.getProduct());
        order.setDescription(request.getDescription());
        order.setPriority(Order.Priority.valueOf(request.getPriority()));
        order.setStatus(Order.Status.PENDING);
        order.setAssignedTo(assignedUser);
        order.setCreatedBy(currentUser);
        order.setDeadline(request.getDeadline());

        // Set customer if provided
        if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
            order.setCustomer(customer);
        }

        // Set material if provided
        if (request.getMaterialId() != null) {
            Material material = materialRepository.findById(request.getMaterialId())
                    .orElseThrow(() -> new RuntimeException("Material no encontrado"));
            order.setMaterial(material);
        }

        // Set quantity if provided
        if (request.getQuantity() != null) {
            order.setQuantity(request.getQuantity());
        }

        Order savedOrder = orderRepository.save(order);
        return mapToResponse(savedOrder);
    }

    public List<OrderResponse> getAllOrders() {
        User currentUser = getCurrentUser();
        List<Order> orders;

        // Operators solo ven sus órdenes asignadas
        if (currentUser.getRole() == User.Role.OPERATOR) {
            orders = orderRepository.findByAssignedTo(currentUser);
        } else {
            orders = orderRepository.findAllByOrderByCreatedAtDesc();
        }

        return orders.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

        User currentUser = getCurrentUser();
        // Operators solo pueden ver sus propias órdenes
        if (currentUser.getRole() == User.Role.OPERATOR &&
                !order.getAssignedTo().getId().equals(currentUser.getId())) {
            throw new RuntimeException("No tienes permiso para ver esta orden");
        }

        return mapToResponseWithLogs(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, StatusChangeRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

        User currentUser = getCurrentUser();

        // Operators solo pueden actualizar sus propias órdenes
        if (currentUser.getRole() == User.Role.OPERATOR &&
                !order.getAssignedTo().getId().equals(currentUser.getId())) {
            throw new RuntimeException("No tienes permiso para actualizar esta orden");
        }

        Order.Status previousStatus = order.getStatus();
        Order.Status newStatus = Order.Status.valueOf(request.getNewStatus());

        // Crear log del cambio de estado
        StatusLog log = new StatusLog();
        log.setOrder(order);
        log.setPreviousStatus(previousStatus);
        log.setNewStatus(newStatus);
        log.setComment(request.getComment());
        log.setChangedBy(currentUser);

        statusLogRepository.save(log);

        // Actualizar estado de la orden
        order.setStatus(newStatus);

        // Si el nuevo estado es IN_PROGRESS y se proporciona una máquina, guardarla
        if (newStatus == Order.Status.IN_PROGRESS && request.getMachine() != null && !request.getMachine().isEmpty()) {
            order.setMachine(request.getMachine());
        }

        Order savedOrder = orderRepository.save(order);

        return mapToResponseWithLogs(savedOrder);
    }

    @Transactional
    public OrderResponse updateOrder(Long id, OrderRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

        User currentUser = getCurrentUser();

        // Solo Admin y Manager pueden editar órdenes
        if (currentUser.getRole() != User.Role.ADMIN && currentUser.getRole() != User.Role.MANAGER) {
            throw new RuntimeException("Solo los administradores y managers pueden editar órdenes");
        }

        User assignedUser = userRepository.findById(request.getAssignedToId())
                .orElseThrow(() -> new RuntimeException("Usuario asignado no encontrado"));

        order.setProduct(request.getProduct());
        order.setDescription(request.getDescription());
        order.setPriority(Order.Priority.valueOf(request.getPriority()));
        order.setAssignedTo(assignedUser);
        order.setDeadline(request.getDeadline());

        // Update customer if provided
        if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
            order.setCustomer(customer);
        } else {
            order.setCustomer(null);
        }

        // Update material if provided
        if (request.getMaterialId() != null) {
            Material material = materialRepository.findById(request.getMaterialId())
                    .orElseThrow(() -> new RuntimeException("Material no encontrado"));
            order.setMaterial(material);
        } else {
            order.setMaterial(null);
        }

        // Update quantity if provided
        order.setQuantity(request.getQuantity());

        Order savedOrder = orderRepository.save(order);
        return mapToResponse(savedOrder);
    }

    @Transactional
    public void deleteOrder(Long id) {
        User currentUser = getCurrentUser();

        // Solo Admin puede eliminar órdenes
        if (currentUser.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Solo los administradores pueden eliminar órdenes");
        }

        orderRepository.deleteById(id);
    }

    public List<OrderResponse> getOrdersByStatus(String status) {
        User currentUser = getCurrentUser();
        Order.Status orderStatus = Order.Status.valueOf(status);

        List<Order> orders = orderRepository.findByStatus(orderStatus);

        // Filtrar por usuario si es Operator
        if (currentUser.getRole() == User.Role.OPERATOR) {
            orders = orders.stream()
                    .filter(order -> order.getAssignedTo().getId().equals(currentUser.getId()))
                    .collect(Collectors.toList());
        }

        return orders.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    private OrderResponse mapToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setProduct(order.getProduct());
        response.setDescription(order.getDescription());
        response.setPriority(order.getPriority().name());
        response.setStatus(order.getStatus().name());
        response.setDeadline(order.getDeadline());
        response.setMachine(order.getMachine());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());

        if (order.getAssignedTo() != null) {
            response.setAssignedTo(new OrderResponse.UserBasicDTO(
                    order.getAssignedTo().getId(),
                    order.getAssignedTo().getName(),
                    order.getAssignedTo().getEmail()
            ));
        }

        if (order.getCreatedBy() != null) {
            response.setCreatedBy(new OrderResponse.UserBasicDTO(
                    order.getCreatedBy().getId(),
                    order.getCreatedBy().getName(),
                    order.getCreatedBy().getEmail()
            ));
        }

        if (order.getCustomer() != null) {
            response.setCustomer(new OrderResponse.CustomerBasicDTO(
                    order.getCustomer().getId(),
                    order.getCustomer().getName(),
                    order.getCustomer().getCompany()
            ));
        }

        if (order.getMaterial() != null) {
            response.setMaterial(new OrderResponse.MaterialBasicDTO(
                    order.getMaterial().getId(),
                    order.getMaterial().getName(),
                    order.getMaterial().getUnit()
            ));
        }

        response.setQuantity(order.getQuantity());

        return response;
    }

    private OrderResponse mapToResponseWithLogs(Order order) {
        OrderResponse response = mapToResponse(order);

        List<StatusLog> logs = statusLogRepository.findByOrderIdOrderByCreatedAtDesc(order.getId());
        response.setStatusLogs(logs.stream().map(log -> {
            OrderResponse.StatusLogDTO logDTO = new OrderResponse.StatusLogDTO();
            logDTO.setId(log.getId());
            logDTO.setPreviousStatus(log.getPreviousStatus().name());
            logDTO.setNewStatus(log.getNewStatus().name());
            logDTO.setComment(log.getComment());
            logDTO.setCreatedAt(log.getCreatedAt());

            if (log.getChangedBy() != null) {
                logDTO.setChangedBy(new OrderResponse.UserBasicDTO(
                        log.getChangedBy().getId(),
                        log.getChangedBy().getName(),
                        log.getChangedBy().getEmail()
                ));
            }

            return logDTO;
        }).collect(Collectors.toList()));

        return response;
    }
}
