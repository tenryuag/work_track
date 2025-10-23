package com.worktrack.backend.service;

import com.worktrack.backend.dto.CustomerRequest;
import com.worktrack.backend.dto.CustomerResponse;
import com.worktrack.backend.entity.Customer;
import com.worktrack.backend.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Transactional(readOnly = true)
    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAllByOrderByNameAsc()
                .stream()
                .map(CustomerResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        return new CustomerResponse(customer);
    }

    @Transactional
    public CustomerResponse createCustomer(CustomerRequest request) {
        // Check if email already exists
        if (request.getEmail() != null && !request.getEmail().isEmpty()
                && customerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Customer with this email already exists");
        }

        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setCompany(request.getCompany());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());

        Customer saved = customerRepository.save(customer);
        return new CustomerResponse(saved);
    }

    @Transactional
    public CustomerResponse updateCustomer(Long id, CustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        // Check if email is being changed and if new email already exists
        if (request.getEmail() != null && !request.getEmail().isEmpty()
                && !request.getEmail().equals(customer.getEmail())
                && customerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Customer with this email already exists");
        }

        customer.setName(request.getName());
        customer.setCompany(request.getCompany());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());

        Customer updated = customerRepository.save(customer);
        return new CustomerResponse(updated);
    }

    @Transactional
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }
}
