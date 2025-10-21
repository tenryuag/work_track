package com.worktrack.backend;

import com.worktrack.backend.entity.User;
import com.worktrack.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    /**
     * Inicializa usuarios de prueba en la base de datos
     */
    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                // Admin
                User admin = new User();
                admin.setEmail("admin@worktrack.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setName("Administrador");
                admin.setRole(User.Role.ADMIN);
                admin.setActive(true);
                userRepository.save(admin);

                // Manager
                User manager = new User();
                manager.setEmail("manager@worktrack.com");
                manager.setPassword(passwordEncoder.encode("manager123"));
                manager.setName("Manager Principal");
                manager.setRole(User.Role.MANAGER);
                manager.setActive(true);
                userRepository.save(manager);

                // Operators
                User operator1 = new User();
                operator1.setEmail("operator1@worktrack.com");
                operator1.setPassword(passwordEncoder.encode("operator123"));
                operator1.setName("Operador Uno");
                operator1.setRole(User.Role.OPERATOR);
                operator1.setActive(true);
                userRepository.save(operator1);

                User operator2 = new User();
                operator2.setEmail("operator2@worktrack.com");
                operator2.setPassword(passwordEncoder.encode("operator123"));
                operator2.setName("Operador Dos");
                operator2.setRole(User.Role.OPERATOR);
                operator2.setActive(true);
                userRepository.save(operator2);

                System.out.println("===================================");
                System.out.println("Usuarios de prueba creados:");
                System.out.println("Admin: admin@worktrack.com / admin123");
                System.out.println("Manager: manager@worktrack.com / manager123");
                System.out.println("Operator 1: operator1@worktrack.com / operator123");
                System.out.println("Operator 2: operator2@worktrack.com / operator123");
                System.out.println("===================================");
            }
        };
    }
}
