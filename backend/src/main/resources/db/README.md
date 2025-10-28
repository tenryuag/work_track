# Database Sample Data

This directory contains SQL scripts to populate the database with sample data for development and testing.

## 📋 What's Included

**sample-data.sql** generates:
- 4 Operators + 1 Manager (in addition to existing admin)
- 10 Customers (major Japanese companies)
- 5 Materials (steel, aluminum, carbon fiber, copper, plastic)
- 100 Orders distributed across the last 6 months with:
  - Various statuses (PENDING, IN_PROGRESS, COMPLETED, DELIVERED)
  - Different priorities (HIGH, MEDIUM, LOW)
  - Random assignments to operators
  - Linked to customers and materials
  - Realistic dates for dashboard analytics

## 🔐 Test User Credentials

All test users have the same password: `password123`

**Operators:**
- juan.perez@worktrack.com / password123
- maria.garcia@worktrack.com / password123
- carlos.rodriguez@worktrack.com / password123
- ana.lopez@worktrack.com / password123

**Manager:**
- roberto.manager@worktrack.com / password123

## 🚀 How to Run

### For Development (Local)

```bash
# Using Docker Compose
docker compose exec db psql -U worktrack -d worktrackdb -f /docker-entrypoint-initdb.d/sample-data.sql

# Or copy the file and execute
docker cp backend/src/main/resources/db/sample-data.sql worktrack-db:/tmp/sample-data.sql
docker compose exec db psql -U worktrack -d worktrackdb -f /tmp/sample-data.sql
```

### For Production (VPS)

```bash
# Copy file to VPS
scp backend/src/main/resources/db/sample-data.sql user@your-vps:/tmp/

# SSH into VPS
ssh user@your-vps

# Copy to Docker container and execute
docker cp /tmp/sample-data.sql worktrack-db:/tmp/sample-data.sql
docker exec -it worktrack-db psql -U worktrack -d worktrackdb -f /tmp/sample-data.sql

# Verify
docker exec -it worktrack-db psql -U worktrack -d worktrackdb -c "SELECT COUNT(*) FROM orders;"
```

### Alternative: Using psql directly

If you have psql installed locally and can connect to the database:

```bash
# Local
psql -h localhost -p 5432 -U worktrack -d worktrackdb -f backend/src/main/resources/db/sample-data.sql

# Remote
psql -h your-vps-ip -p 5432 -U worktrack -d worktrackdb -f backend/src/main/resources/db/sample-data.sql
```

## ✅ Verification

After running the script, you can verify the data was inserted:

```sql
-- Count users by role
SELECT role, COUNT(*) FROM users GROUP BY role;

-- Count orders by status
SELECT status, COUNT(*) FROM orders GROUP BY status;

-- Count orders by month
SELECT TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*)
FROM orders
WHERE created_at >= NOW() - INTERVAL '6 months'
GROUP BY month
ORDER BY month;
```

## 🧹 Clean Up (Optional)

To remove sample data and start fresh:

```sql
-- WARNING: This will delete ALL data except the admin user
DELETE FROM orders;
DELETE FROM materials;
DELETE FROM customers;
DELETE FROM users WHERE role != 'ADMIN';

-- Reset sequences
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE customers_id_seq RESTART WITH 1;
ALTER SEQUENCE materials_id_seq RESTART WITH 1;
```

## 📊 Expected Results

After running the script, your dashboard should show:
- **~100 orders** distributed across different statuses
- **Trend graph** with data from the last 6 months
- **Top customers** with multiple orders
- **Top materials** usage statistics
- **Operator performance** metrics with realistic completion rates

The data is designed to make all dashboard charts look meaningful and realistic!
