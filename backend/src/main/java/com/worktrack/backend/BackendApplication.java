package com.worktrack.backend;

import com.worktrack.backend.entity.Customer;
import com.worktrack.backend.entity.Material;
import com.worktrack.backend.entity.Order;
import com.worktrack.backend.entity.User;
import com.worktrack.backend.repository.CustomerRepository;
import com.worktrack.backend.repository.MaterialRepository;
import com.worktrack.backend.repository.OrderRepository;
import com.worktrack.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    /**
     * Inicializa datos de prueba en la base de datos
     */
    @Bean
    CommandLineRunner initDatabase(
            UserRepository userRepository,
            CustomerRepository customerRepository,
            MaterialRepository materialRepository,
            OrderRepository orderRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            Random random = new Random();

            // =============================================
            // 1. CREAR USUARIOS (si no existen)
            // =============================================
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

                // Operator 1
                User operator1 = new User();
                operator1.setEmail("operator1@worktrack.com");
                operator1.setPassword(passwordEncoder.encode("operator123"));
                operator1.setName("Operador Uno");
                operator1.setRole(User.Role.OPERATOR);
                operator1.setActive(true);
                userRepository.save(operator1);

                // Operator 2
                User operator2 = new User();
                operator2.setEmail("operator2@worktrack.com");
                operator2.setPassword(passwordEncoder.encode("operator123"));
                operator2.setName("Operador Dos");
                operator2.setRole(User.Role.OPERATOR);
                operator2.setActive(true);
                userRepository.save(operator2);

                // Operator 3 (Juan Pérez)
                User operator3 = new User();
                operator3.setEmail("juan.perez@worktrack.com");
                operator3.setPassword(passwordEncoder.encode("password123"));
                operator3.setName("Juan Pérez");
                operator3.setRole(User.Role.OPERATOR);
                operator3.setActive(true);
                userRepository.save(operator3);

                // Operator 4 (María García)
                User operator4 = new User();
                operator4.setEmail("maria.garcia@worktrack.com");
                operator4.setPassword(passwordEncoder.encode("password123"));
                operator4.setName("María García");
                operator4.setRole(User.Role.OPERATOR);
                operator4.setActive(true);
                userRepository.save(operator4);

                // Manager 2 (Roberto Manager)
                User manager2 = new User();
                manager2.setEmail("roberto.manager@worktrack.com");
                manager2.setPassword(passwordEncoder.encode("password123"));
                manager2.setName("Roberto Manager");
                manager2.setRole(User.Role.MANAGER);
                manager2.setActive(true);
                userRepository.save(manager2);

                System.out.println("✓ Usuarios creados: 1 Admin, 2 Managers, 4 Operators");
            }

            // =============================================
            // 2. CREAR CLIENTES (10 clientes)
            // =============================================
            if (customerRepository.count() == 0) {
                List<Customer> customers = new ArrayList<>();

                customers.add(createCustomer("Toyota Motor Corporation", "Toyota", "orders@toyota.jp",
                        "+81-3-3817-7111", "1 Toyota-cho, Toyota City, Aichi 471-8571, Japan"));
                customers.add(createCustomer("Honda Motor Co.", "Honda", "procurement@honda.jp",
                        "+81-3-3423-1111", "2-1-1 Minami-Aoyama, Minato-ku, Tokyo 107-8556, Japan"));
                customers.add(createCustomer("Nissan Motor Co.", "Nissan", "suppliers@nissan.jp",
                        "+81-45-523-5523", "1-1-1 Takashima, Nishi-ku, Yokohama, Kanagawa 220-8686, Japan"));
                customers.add(createCustomer("Panasonic Corporation", "Panasonic", "parts@panasonic.jp",
                        "+81-6-6908-1121", "1006 Oaza Kadoma, Kadoma-shi, Osaka 571-8501, Japan"));
                customers.add(createCustomer("Sony Corporation", "Sony", "manufacturing@sony.jp",
                        "+81-3-6748-2111", "1-7-1 Konan, Minato-ku, Tokyo 108-0075, Japan"));
                customers.add(createCustomer("Mitsubishi Electric", "Mitsubishi", "orders@mitsubishi.jp",
                        "+81-3-3218-2111", "2-7-3 Marunouchi, Chiyoda-ku, Tokyo 100-8310, Japan"));
                customers.add(createCustomer("Canon Inc.", "Canon", "supply@canon.jp",
                        "+81-3-3758-2111", "30-2 Shimomaruko 3-chome, Ohta-ku, Tokyo 146-8501, Japan"));
                customers.add(createCustomer("Toshiba Corporation", "Toshiba", "procurement@toshiba.jp",
                        "+81-3-3457-4511", "1-1-1 Shibaura, Minato-ku, Tokyo 105-8001, Japan"));
                customers.add(createCustomer("Fuji Heavy Industries", "Subaru", "parts@subaru.jp",
                        "+81-3-6447-8000", "1-20-8 Ebisu, Shibuya-ku, Tokyo 150-8554, Japan"));
                customers.add(createCustomer("Yamaha Corporation", "Yamaha", "orders@yamaha.jp",
                        "+81-53-460-2211", "10-1 Nakazawa-cho, Naka-ku, Hamamatsu, Shizuoka 430-8650, Japan"));

                customerRepository.saveAll(customers);
                System.out.println("✓ 10 clientes creados (Toyota, Honda, Nissan, etc.)");
            }

            // =============================================
            // 3. CREAR MATERIALES (5 materiales)
            // =============================================
            if (materialRepository.count() == 0) {
                List<Material> materials = new ArrayList<>();

                materials.add(createMaterial("Steel Plate 304", "Stainless steel plate 304 grade, corrosion resistant", "kg", 5000.0));
                materials.add(createMaterial("Aluminum Alloy 6061", "Aluminum alloy 6061-T6, lightweight and strong", "kg", 3500.0));
                materials.add(createMaterial("Carbon Fiber Sheet", "High-strength carbon fiber composite sheet", "m²", 250.0));
                materials.add(createMaterial("Copper Wire 99.9%", "Pure copper wire for electrical applications", "kg", 1200.0));
                materials.add(createMaterial("Plastic Polymer ABS", "ABS plastic polymer for injection molding", "kg", 4500.0));

                materialRepository.saveAll(materials);
                System.out.println("✓ 5 materiales creados (Steel, Aluminum, Carbon Fiber, etc.)");
            }

            // =============================================
            // 4. CREAR ÓRDENES (100 órdenes)
            // =============================================
            if (orderRepository.count() == 0) {
                User admin = userRepository.findByRole(User.Role.ADMIN).stream().findFirst().orElse(null);
                List<User> operators = userRepository.findByRole(User.Role.OPERATOR);
                List<Customer> customers = customerRepository.findAll();
                List<Material> materials = materialRepository.findAll();

                String[] products = {
                        "Engine Block", "Transmission Gear", "Brake Disc", "Exhaust Manifold", "Cylinder Head",
                        "Crankshaft", "Camshaft", "Piston Set", "Valve Assembly", "Intake Manifold",
                        "Oil Pan", "Turbo Housing", "Differential Case", "Axle Shaft", "Control Arm",
                        "Suspension Spring", "Steering Knuckle", "Wheel Hub", "Battery Tray", "Radiator Support"
                };

                String[] machines = {
                        "CNC-001", "CNC-002", "CNC-003", "MILL-001", "MILL-002",
                        "LATHE-001", "LATHE-002", "PRESS-001"
                };

                Order.Priority[] priorities = Order.Priority.values();
                Order.Status[] statuses = Order.Status.values();

                List<Order> orders = new ArrayList<>();
                LocalDateTime now = LocalDateTime.now();

                for (int i = 1; i <= 100; i++) {
                    Order order = new Order();

                    // Fecha aleatoria en los últimos 6 meses
                    long daysAgo = random.nextInt(180);
                    LocalDateTime createdDate = now.minusDays(daysAgo);

                    // Deadline 7-30 días después de la creación
                    LocalDate deadline = createdDate.toLocalDate().plusDays(7 + random.nextInt(24));

                    // Status basado en antigüedad
                    Order.Status status;
                    if (daysAgo > 90) {
                        // Órdenes antiguas: más probabilidad de estar completadas/entregadas
                        status = random.nextBoolean() ? Order.Status.COMPLETED : Order.Status.DELIVERED;
                    } else if (daysAgo > 30) {
                        // Órdenes medianas: cualquier status excepto PENDING
                        int statusIndex = 1 + random.nextInt(3);
                        status = statuses[statusIndex];
                    } else {
                        // Órdenes recientes: cualquier status
                        status = statuses[random.nextInt(statuses.length)];
                    }

                    // Priority (30% HIGH, 50% MEDIUM, 20% LOW)
                    Order.Priority priority;
                    double rand = random.nextDouble();
                    if (rand < 0.3) {
                        priority = Order.Priority.HIGH;
                    } else if (rand < 0.8) {
                        priority = Order.Priority.MEDIUM;
                    } else {
                        priority = Order.Priority.LOW;
                    }

                    // Producto aleatorio
                    String product = products[random.nextInt(products.length)];

                    // Asignar datos
                    order.setProduct(product);
                    order.setDescription("Production order for " + product + " - Batch #" + String.format("%04d", i));
                    order.setPriority(priority);
                    order.setStatus(status);
                    order.setCreatedBy(admin);
                    order.setAssignedTo(operators.get(random.nextInt(operators.size())));
                    order.setCustomer(customers.get(random.nextInt(customers.size())));

                    // 80% de probabilidad de tener material
                    if (random.nextDouble() < 0.8) {
                        order.setMaterial(materials.get(random.nextInt(materials.size())));
                    }

                    order.setQuantity(1.0 + random.nextInt(100));
                    order.setDeadline(deadline);

                    // Solo asignar máquina si está en progreso o completada
                    if (status == Order.Status.IN_PROGRESS || status == Order.Status.COMPLETED || status == Order.Status.DELIVERED) {
                        order.setMachine(machines[random.nextInt(machines.length)]);
                    }

                    order.setCreatedAt(createdDate);
                    order.setUpdatedAt(createdDate);

                    orders.add(order);
                }

                orderRepository.saveAll(orders);
                System.out.println("✓ 100 órdenes creadas (distribuidas en los últimos 6 meses)");
            }

            // =============================================
            // RESUMEN
            // =============================================
            System.out.println("===================================");
            System.out.println("BASE DE DATOS INICIALIZADA");
            System.out.println("===================================");
            System.out.println("Usuarios: " + userRepository.count());
            System.out.println("Clientes: " + customerRepository.count());
            System.out.println("Materiales: " + materialRepository.count());
            System.out.println("Órdenes: " + orderRepository.count());
            System.out.println("===================================");
            System.out.println("CREDENCIALES DE ACCESO:");
            System.out.println("Admin: admin@worktrack.com / admin123");
            System.out.println("Manager: manager@worktrack.com / manager123");
            System.out.println("Operators: operator1@worktrack.com / operator123");
            System.out.println("           operator2@worktrack.com / operator123");
            System.out.println("           juan.perez@worktrack.com / password123");
            System.out.println("           maria.garcia@worktrack.com / password123");
            System.out.println("===================================");
        };
    }

    private Customer createCustomer(String name, String company, String email, String phone, String address) {
        Customer customer = new Customer();
        customer.setName(name);
        customer.setCompany(company);
        customer.setEmail(email);
        customer.setPhone(phone);
        customer.setAddress(address);
        return customer;
    }

    private Material createMaterial(String name, String description, String unit, Double stockQuantity) {
        Material material = new Material();
        material.setName(name);
        material.setDescription(description);
        material.setUnit(unit);
        material.setStockQuantity(stockQuantity);
        return material;
    }
}
