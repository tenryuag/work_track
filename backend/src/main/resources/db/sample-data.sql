-- WorkTrack Sample Data Script
-- This script adds sample data for development and testing
-- Run this after the initial setup to populate the database with realistic test data

-- =============================================
-- 1. INSERT USERS (4 operators + keep existing admin)
-- =============================================
-- Password for all test users: "password123"
-- BCrypt hash for "password123": $2a$10$3euPcmQFCiblsZeEu5s7p.z4txCMCBFZrRZxKmJnkJJBu/oWzXjZe

INSERT INTO users (name, email, password, role, active, created_at, updated_at) VALUES
('田中 ヒロシ', 'tanaka.hiroshi@worktrack.com', '$2a$10$3euPcmQFCiblsZeEu5s7p.z4txCMCBFZrRZxKmJnkJJBu/oWzXjZe', 'OPERATOR', true, NOW(), NOW()),
('鈴木 ユキ', 'suzuki.yuki@worktrack.com', '$2a$10$3euPcmQFCiblsZeEu5s7p.z4txCMCBFZrRZxKmJnkJJBu/oWzXjZe', 'OPERATOR', true, NOW(), NOW()),
('佐藤 タケシ', 'sato.takeshi@worktrack.com', '$2a$10$3euPcmQFCiblsZeEu5s7p.z4txCMCBFZrRZxKmJnkJJBu/oWzXjZe', 'OPERATOR', true, NOW(), NOW()),
('伊藤 アイコ', 'ito.aiko@worktrack.com', '$2a$10$3euPcmQFCiblsZeEu5s7p.z4txCMCBFZrRZxKmJnkJJBu/oWzXjZe', 'OPERATOR', true, NOW(), NOW()),
('中村 ケンジ', 'nakamura.kenji@worktrack.com', '$2a$10$3euPcmQFCiblsZeEu5s7p.z4txCMCBFZrRZxKmJnkJJBu/oWzXjZe', 'MANAGER', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- =============================================
-- 2. INSERT CUSTOMERS (10 customers)
-- =============================================
INSERT INTO customers (name, company, email, phone, address, created_at, updated_at) VALUES
('Toyota Motor Corporation', 'Toyota', 'orders@toyota.jp', '+81-3-3817-7111', '1 Toyota-cho, Toyota City, Aichi 471-8571, Japan', NOW(), NOW()),
('Honda Motor Co.', 'Honda', 'procurement@honda.jp', '+81-3-3423-1111', '2-1-1 Minami-Aoyama, Minato-ku, Tokyo 107-8556, Japan', NOW(), NOW()),
('Nissan Motor Co.', 'Nissan', 'suppliers@nissan.jp', '+81-45-523-5523', '1-1-1 Takashima, Nishi-ku, Yokohama, Kanagawa 220-8686, Japan', NOW(), NOW()),
('Panasonic Corporation', 'Panasonic', 'parts@panasonic.jp', '+81-6-6908-1121', '1006 Oaza Kadoma, Kadoma-shi, Osaka 571-8501, Japan', NOW(), NOW()),
('Sony Corporation', 'Sony', 'manufacturing@sony.jp', '+81-3-6748-2111', '1-7-1 Konan, Minato-ku, Tokyo 108-0075, Japan', NOW(), NOW()),
('Mitsubishi Electric', 'Mitsubishi', 'orders@mitsubishi.jp', '+81-3-3218-2111', '2-7-3 Marunouchi, Chiyoda-ku, Tokyo 100-8310, Japan', NOW(), NOW()),
('Canon Inc.', 'Canon', 'supply@canon.jp', '+81-3-3758-2111', '30-2 Shimomaruko 3-chome, Ohta-ku, Tokyo 146-8501, Japan', NOW(), NOW()),
('Toshiba Corporation', 'Toshiba', 'procurement@toshiba.jp', '+81-3-3457-4511', '1-1-1 Shibaura, Minato-ku, Tokyo 105-8001, Japan', NOW(), NOW()),
('Fuji Heavy Industries', 'Subaru', 'parts@subaru.jp', '+81-3-6447-8000', '1-20-8 Ebisu, Shibuya-ku, Tokyo 150-8554, Japan', NOW(), NOW()),
('Yamaha Corporation', 'Yamaha', 'orders@yamaha.jp', '+81-53-460-2211', '10-1 Nakazawa-cho, Naka-ku, Hamamatsu, Shizuoka 430-8650, Japan', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- =============================================
-- 3. INSERT MATERIALS (5 materials)
-- =============================================
INSERT INTO materials (name, description, unit, stock_quantity, created_at, updated_at) VALUES
('Steel Plate 304', 'Stainless steel plate 304 grade, corrosion resistant', 'kg', 5000.00, NOW(), NOW()),
('Aluminum Alloy 6061', 'Aluminum alloy 6061-T6, lightweight and strong', 'kg', 3500.00, NOW(), NOW()),
('Carbon Fiber Sheet', 'High-strength carbon fiber composite sheet', 'm²', 250.00, NOW(), NOW()),
('Copper Wire 99.9%', 'Pure copper wire for electrical applications', 'kg', 1200.00, NOW(), NOW()),
('Plastic Polymer ABS', 'ABS plastic polymer for injection molding', 'kg', 4500.00, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- =============================================
-- 4. INSERT ORDERS (100 orders with varied data)
-- =============================================
-- Orders will be distributed across the last 6 months
-- with different statuses, priorities, customers, materials, and operators

DO $$
DECLARE
    admin_id INT;
    operator_ids INT[] := ARRAY(SELECT id FROM users WHERE role = 'OPERATOR' ORDER BY id LIMIT 4);
    customer_ids INT[] := ARRAY(SELECT id FROM customers ORDER BY id LIMIT 10);
    material_ids INT[] := ARRAY(SELECT id FROM materials ORDER BY id LIMIT 5);
    statuses TEXT[] := ARRAY['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED'];
    priorities TEXT[] := ARRAY['HIGH', 'MEDIUM', 'LOW'];
    machines TEXT[] := ARRAY['CNC-001', 'CNC-002', 'CNC-003', 'MILL-001', 'MILL-002', 'LATHE-001', 'LATHE-002', 'PRESS-001'];
    products TEXT[] := ARRAY[
        'Engine Block', 'Transmission Gear', 'Brake Disc', 'Exhaust Manifold', 'Cylinder Head',
        'Crankshaft', 'Camshaft', 'Piston Set', 'Valve Assembly', 'Intake Manifold',
        'Oil Pan', 'Turbo Housing', 'Differential Case', 'Axle Shaft', 'Control Arm',
        'Suspension Spring', 'Steering Knuckle', 'Wheel Hub', 'Battery Tray', 'Radiator Support'
    ];
    i INT;
    random_date TIMESTAMP;
    random_deadline TIMESTAMP;
    random_status TEXT;
    random_priority TEXT;
    random_product TEXT;
    random_customer INT;
    random_material INT;
    random_operator INT;
    random_machine TEXT;
    random_quantity NUMERIC;
BEGIN
    -- Get admin user ID
    SELECT id INTO admin_id FROM users WHERE role = 'ADMIN' LIMIT 1;

    -- Generate 100 orders
    FOR i IN 1..100 LOOP
        -- Random date in last 6 months
        random_date := NOW() - (RANDOM() * INTERVAL '180 days');

        -- Deadline 7-30 days after creation
        random_deadline := random_date + (7 + RANDOM() * 23) * INTERVAL '1 day';

        -- Random status (more completed/delivered as orders get older)
        IF random_date < NOW() - INTERVAL '90 days' THEN
            random_status := statuses[3 + FLOOR(RANDOM() * 2)]; -- COMPLETED or DELIVERED
        ELSIF random_date < NOW() - INTERVAL '30 days' THEN
            random_status := statuses[2 + FLOOR(RANDOM() * 3)]; -- IN_PROGRESS, COMPLETED, or DELIVERED
        ELSE
            random_status := statuses[1 + FLOOR(RANDOM() * 4)]; -- Any status
        END IF;

        -- Random priority (30% HIGH, 50% MEDIUM, 20% LOW)
        IF RANDOM() < 0.3 THEN
            random_priority := 'HIGH';
        ELSIF RANDOM() < 0.8 THEN
            random_priority := 'MEDIUM';
        ELSE
            random_priority := 'LOW';
        END IF;

        -- Random product
        random_product := products[1 + FLOOR(RANDOM() * array_length(products, 1))];

        -- Random customer
        random_customer := customer_ids[1 + FLOOR(RANDOM() * array_length(customer_ids, 1))];

        -- Random material (80% chance to have a material)
        IF RANDOM() < 0.8 THEN
            random_material := material_ids[1 + FLOOR(RANDOM() * array_length(material_ids, 1))];
        ELSE
            random_material := NULL;
        END IF;

        -- Random operator
        random_operator := operator_ids[1 + FLOOR(RANDOM() * array_length(operator_ids, 1))];

        -- Random machine (only if IN_PROGRESS or COMPLETED)
        IF random_status IN ('IN_PROGRESS', 'COMPLETED', 'DELIVERED') THEN
            random_machine := machines[1 + FLOOR(RANDOM() * array_length(machines, 1))];
        ELSE
            random_machine := NULL;
        END IF;

        -- Random quantity (between 1 and 100)
        random_quantity := 1 + FLOOR(RANDOM() * 100);

        -- Insert order
        INSERT INTO orders (
            product,
            description,
            priority,
            status,
            assigned_to_id,
            created_by_id,
            customer_id,
            material_id,
            quantity,
            deadline,
            machine,
            created_at,
            updated_at
        ) VALUES (
            random_product,
            'Production order for ' || random_product || ' - Batch #' || LPAD(i::TEXT, 4, '0'),
            random_priority,
            random_status,
            random_operator,
            admin_id,
            random_customer,
            random_material,
            random_quantity,
            random_deadline,
            random_machine,
            random_date,
            random_date
        );
    END LOOP;

    RAISE NOTICE 'Successfully inserted 100 sample orders!';
END $$;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- Run these to verify the data was inserted correctly

-- Count users by role
SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY role;

-- Count customers
SELECT COUNT(*) as total_customers FROM customers;

-- Count materials
SELECT COUNT(*) as total_materials FROM materials;

-- Count orders by status
SELECT status, COUNT(*) as count FROM orders GROUP BY status ORDER BY status;

-- Count orders by priority
SELECT priority, COUNT(*) as count FROM orders GROUP BY priority ORDER BY priority;

-- Orders created in last 6 months grouped by month
SELECT
    TO_CHAR(created_at, 'YYYY-MM') as month,
    COUNT(*) as orders_count
FROM orders
WHERE created_at >= NOW() - INTERVAL '6 months'
GROUP BY TO_CHAR(created_at, 'YYYY-MM')
ORDER BY month;
