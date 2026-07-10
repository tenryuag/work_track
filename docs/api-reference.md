# 📡 API Reference

## Información General

- **Base URL**: `http://localhost:8080/api` (desarrollo) / `https://worktrack.tenryuag.com/api` (producción)
- **Formato**: JSON
- **Autenticación**: Bearer Token (JWT)
- **Content-Type**: `application/json`

## Autenticación

Todas las peticiones (excepto login) requieren el header:
```
Authorization: Bearer <jwt_token>
```

---

## 🔐 Auth

### POST `/api/auth/login`

Autentica un usuario y devuelve un token JWT.

**Acceso**: Público

**Request Body**:
```json
{
  "email": "admin@worktrack.com",
  "password": "admin123"
}
```

**Response** `200 OK`:
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "admin@worktrack.com",
  "name": "Admin User",
  "role": "ADMIN"
}
```

---

## 📦 Orders (Órdenes de Producción)

### GET `/api/orders`
Obtiene todas las órdenes de producción.

**Acceso**: Todos los roles (Operators solo ven las suyas)

**Response** `200 OK`: `Order[]`

### GET `/api/orders/{id}`
Obtiene una orden por ID, incluyendo su historial de cambios de estado.

**Acceso**: Todos los roles

**Response** `200 OK`: `Order`

### POST `/api/orders`
Crea una nueva orden de producción.

**Acceso**: Solo ADMIN

**Request Body**:
```json
{
  "product": "Pieza A-100",
  "description": "Pieza de aluminio para motor",
  "priority": "HIGH",
  "assignedToId": 3,
  "customerId": 1,
  "materialId": 2,
  "quantity": 500,
  "deadline": "2025-02-15"
}
```

**Response** `200 OK`: `Order`

### PUT `/api/orders/{id}`
Actualiza una orden existente.

**Acceso**: Solo ADMIN

**Request Body**: Mismo formato que el POST

### DELETE `/api/orders/{id}`
Elimina una orden.

**Acceso**: Solo ADMIN

**Response** `200 OK`

### PATCH `/api/orders/{id}/status`
Cambia el estado de una orden.

**Acceso**: ADMIN, MANAGER y OPERATOR (solo sus órdenes)

**Request Body**:
```json
{
  "newStatus": "IN_PROGRESS",
  "comment": "Iniciando producción",
  "machine": "CNC-01"
}
```

**Response** `200 OK`: `Order`

### GET `/api/orders/status/{status}`
Filtra órdenes por estado.

**Acceso**: Todos los roles

**Parámetro**: `status` = `PENDING` | `IN_PROGRESS` | `COMPLETED` | `DELIVERED`

---

## 👥 Users (Usuarios)

### GET `/api/users`
Obtiene todos los usuarios con información detallada.

**Acceso**: Solo ADMIN

**Response** `200 OK`: `UserDetail[]`

### GET `/api/users/{id}`
Obtiene un usuario por ID.

**Acceso**: Solo ADMIN

### GET `/api/users/operators`
Obtiene la lista de operadores (para asignar órdenes).

**Acceso**: ADMIN, MANAGER

**Response** `200 OK`: `UserBasic[]`

### GET `/api/users/basic`
Obtiene todos los usuarios con información básica.

**Acceso**: ADMIN, MANAGER

### POST `/api/users`
Crea un nuevo usuario.

**Acceso**: Solo ADMIN

**Request Body**:
```json
{
  "name": "Nuevo Operador",
  "email": "nuevo@worktrack.com",
  "password": "password123",
  "role": "OPERATOR"
}
```

### PUT `/api/users/{id}`
Actualiza un usuario existente.

**Acceso**: Solo ADMIN

### DELETE `/api/users/{id}`
Elimina un usuario.

**Acceso**: Solo ADMIN

---

## 🏢 Customers (Clientes)

### GET `/api/customers`
Lista todos los clientes.

**Acceso**: Solo ADMIN

### GET `/api/customers/{id}`
Obtiene un cliente por ID.

### POST `/api/customers`
Crea un nuevo cliente.

**Request Body**:
```json
{
  "name": "Toyota Motors",
  "company": "Toyota",
  "email": "contact@toyota.com",
  "phone": "+81-xxx-xxx-xxxx",
  "address": "Aichi, Japan"
}
```

### PUT `/api/customers/{id}`
Actualiza un cliente.

### DELETE `/api/customers/{id}`
Elimina un cliente.

---

## 🧱 Materials (Materiales)

### GET `/api/materials`
Lista todos los materiales.

**Acceso**: Solo ADMIN

### GET `/api/materials/{id}`
Obtiene un material por ID.

### POST `/api/materials`
Crea un nuevo material.

**Request Body**:
```json
{
  "name": "Aluminio A6061",
  "description": "Aleación de aluminio para mecanizado",
  "unit": "kg",
  "stockQuantity": 1500.0
}
```

### PUT `/api/materials/{id}`
Actualiza un material.

### DELETE `/api/materials/{id}`
Elimina un material.

---

## 📊 KPIs (Indicadores de Rendimiento)

### GET `/api/kpis`
Lista todos los KPIs.

**Acceso**: ADMIN, MANAGER

### GET `/api/kpis/active`
Lista solo los KPIs activos.

### GET `/api/kpis/{id}`
Obtiene un KPI por ID (UUID).

### POST `/api/kpis`
Crea un nuevo KPI.

**Request Body**:
```json
{
  "name": "Producción por hora",
  "competence": "Eficiencia",
  "specificRoleApplication": "Operador CNC",
  "controlMeasure": "Piezas terminadas / hora",
  "frequency": "DAILY",
  "valueType": "NUMERIC",
  "targetType": "MIN",
  "targetValue1": 50,
  "aggregationMethod": "AVG",
  "unit": "piezas/hora",
  "evidenceRequired": false,
  "description": "Mide la productividad por hora del operador",
  "active": true
}
```

### PUT `/api/kpis/{id}`
Actualiza un KPI.

### DELETE `/api/kpis/{id}`
Elimina un KPI.

---

## 📋 Assignments (Asignaciones de KPI)

### GET `/api/assignments/worker/{workerId}`
Lista las asignaciones de KPI de un trabajador.

**Acceso**: ADMIN, MANAGER

### GET `/api/assignments/kpi/{kpiId}`
Lista las asignaciones de un KPI específico.

### POST `/api/assignments`
Crea una nueva asignación KPI.

**Request Body**:
```json
{
  "workerId": 3,
  "kpiId": "uuid-del-kpi",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "weight": 0.3,
  "targetOverride": 60
}
```

### PUT `/api/assignments/{id}`
Actualiza una asignación.

### DELETE `/api/assignments/{id}`
Elimina una asignación.

---

## 📝 Evaluations (Evaluaciones)

### GET `/api/evaluations/period?frequency={frequency}`
Obtiene el periodo actual para una frecuencia de evaluación.

**Parámetro**: `frequency` = `DAILY` | `WEEKLY` | `BIWEEKLY` | `MONTHLY` | `QUARTERLY` | `SEMIANNUAL`

**Response**:
```json
{
  "startDate": "2025-01-01",
  "endDate": "2025-01-31",
  "label": "Enero 2025"
}
```

### POST `/api/evaluations`
Envía una evaluación.

**Request Body**:
```json
{
  "assignmentId": 1,
  "periodStart": "2025-01-01",
  "periodEnd": "2025-01-31",
  "valueNumber": 55.5,
  "status": "SUBMITTED",
  "evidence": [
    {
      "fileUrl": "https://...",
      "note": "Reporte de producción"
    }
  ]
}
```

### GET `/api/evaluations/{id}/score`
Obtiene el puntaje de una evaluación.

**Response**:
```json
{
  "assignmentId": 1,
  "periodStart": "2025-01-01",
  "score": 55.5,
  "normalizedScore": 0.92
}
```

---

## 📅 Work Plans (Planes de Trabajo)

### GET `/api/work-plans/global?year={year}`
Obtiene el plan de trabajo global del año.

### GET `/api/work-plans/user/{userId}?year={year}`
Obtiene el plan de trabajo de un usuario específico.

### POST `/api/work-plans`
Crea o actualiza (upsert) un plan de trabajo.

**Request Body**:
```json
{
  "year": 2025,
  "userId": null,
  "description": "Plan anual de producción"
}
```

### POST `/api/work-plans/{workPlanId}/tasks`
Agrega una tarea a un plan de trabajo.

**Request Body**:
```json
{
  "name": "Configurar línea CNC",
  "startDate": "2025-02-01",
  "endDate": "2025-02-15",
  "progress": 0,
  "status": "TODO"
}
```

### PUT `/api/work-plans/tasks/{taskId}`
Actualiza una tarea.

### DELETE `/api/work-plans/tasks/{taskId}`
Elimina una tarea.

---

## Enumeraciones de Referencia

### OrderStatus
| Valor | Descripción |
|-------|-------------|
| `PENDING` | Pendiente |
| `IN_PROGRESS` | En proceso |
| `COMPLETED` | Completado |
| `DELIVERED` | Entregado |

### OrderPriority
| Valor | Descripción |
|-------|-------------|
| `HIGH` | Alta |
| `MEDIUM` | Media |
| `LOW` | Baja |

### UserRole
| Valor | Descripción |
|-------|-------------|
| `ADMIN` | Administrador |
| `MANAGER` | Gerente |
| `OPERATOR` | Operador |

### EvaluationFrequency
| Valor | Descripción |
|-------|-------------|
| `DAILY` | Diaria |
| `WEEKLY` | Semanal |
| `BIWEEKLY` | Quincenal |
| `MONTHLY` | Mensual |
| `QUARTERLY` | Trimestral |
| `SEMIANNUAL` | Semestral |

### ValueType
`BOOLEAN` | `NUMERIC` | `PERCENT` | `SCORE`

### TargetType
`MIN` | `MAX` | `RANGE` | `EQUAL`

### AggregationMethod
`LAST` | `AVG` | `SUM` | `COUNT_TRUE` | `COUNT_FALSE` | `PERCENT_TRUE` | `MANUAL_FORMULA`

### EvaluationStatus
`DRAFT` | `SUBMITTED` | `APPROVED`

### WorkPlanTask Status
`TODO` | `IN_PROGRESS` | `DONE`

---

## Códigos de Respuesta HTTP

| Código | Significado |
|--------|-------------|
| `200 OK` | Operación exitosa |
| `201 Created` | Recurso creado |
| `400 Bad Request` | Datos inválidos en la petición |
| `401 Unauthorized` | Token JWT inválido o expirado |
| `403 Forbidden` | Sin permisos para la operación |
| `404 Not Found` | Recurso no encontrado |
| `500 Internal Server Error` | Error del servidor |
