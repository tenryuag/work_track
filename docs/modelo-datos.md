# 🗃️ Modelo de Datos

## Diagrama de Entidades

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    User      │       │   Customer   │       │   Material   │
│──────────────│       │──────────────│       │──────────────│
│ id (PK)      │       │ id (PK)      │       │ id (PK)      │
│ name         │       │ name         │       │ name         │
│ email (UQ)   │       │ company      │       │ description  │
│ password     │       │ email        │       │ unit         │
│ role         │       │ phone        │       │ stockQuantity│
│ active       │       │ address      │       │ createdAt    │
│ createdAt    │       │ createdAt    │       │ updatedAt    │
│ updatedAt    │       │ updatedAt    │       └──────┬───────┘
└──────┬───────┘       └──────┬───────┘              │
       │                      │                      │
       │ assignedTo/createdBy │ customer              │ material
       ▼                      ▼                      ▼
┌──────────────────────────────────────────────────────────────┐
│                          Order                               │
│──────────────────────────────────────────────────────────────│
│ id (PK)         │ product          │ description             │
│ priority        │ status           │ quantity                │
│ deadline        │ machine          │ createdAt / updatedAt   │
│ assigned_to_id (FK → User)                                   │
│ created_by_id  (FK → User)                                   │
│ customer_id    (FK → Customer)                               │
│ material_id    (FK → Material)                               │
└──────────────────────┬───────────────────────────────────────┘
                       │ 1:N
                       ▼
              ┌──────────────────┐
              │    StatusLog     │
              │──────────────────│
              │ id (PK)          │
              │ previousStatus   │
              │ newStatus        │
              │ comment          │
              │ order_id (FK)    │
              │ changed_by (FK)  │
              │ createdAt        │
              └──────────────────┘


┌──────────────┐     1:N     ┌──────────────┐     N:1     ┌──────────────┐
│     Kpi      │◄────────────│  Assignment  │────────────►│    User      │
│──────────────│             │──────────────│             │  (worker)    │
│ id (PK/UUID) │             │ id (PK)      │             └──────────────┘
│ name         │             │ worker_id(FK)│
│ competence   │             │ kpi_id (FK)  │
│ frequency    │             │ startDate    │
│ valueType    │             │ endDate      │
│ targetType   │             │ weight       │
│ targetValue1 │             │ targetOverride│
│ targetValue2 │             │ createdAt    │
│ aggregation  │             │ updatedAt    │
│ unit         │             └──────┬───────┘
│ evidenceReq  │                    │ 1:N
│ description  │                    ▼
│ active       │            ┌──────────────┐
│ createdAt    │            │  Evaluation  │
│ updatedAt    │            │──────────────│
└──────────────┘            │ id (PK)      │
                            │ assignment_id│
                            │ periodStart  │
                            │ periodEnd    │
                            │ valueBoolean │
                            │ valueNumber  │
                            │ valueText    │
                            │ status       │
                            │ createdBy(FK)│
                            │ createdAt    │
                            │ updatedAt    │
                            └──────┬───────┘
                                   │ 1:N
                                   ▼
                           ┌──────────────┐
                           │   Evidence   │
                           │──────────────│
                           │ id (PK)      │
                           │ evaluation_id│
                           │ fileUrl      │
                           │ note         │
                           │ createdAt    │
                           └──────────────┘


┌──────────────┐     1:N     ┌────────────────┐
│   WorkPlan   │◄────────────│  WorkPlanTask  │
│──────────────│             │────────────────│
│ id (PK)      │             │ id (PK)        │
│ year         │             │ workPlan_id(FK)│
│ user_id (FK) │             │ name           │
│ description  │             │ startDate      │
│ createdAt    │             │ endDate        │
│ updatedAt    │             │ progress       │
└──────────────┘             │ status         │
                             └────────────────┘
```

## Descripción de Entidades

### User (Usuario)

Representa los usuarios del sistema con distintos roles.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | PK, auto-generated | Identificador único |
| name | String | NOT NULL | Nombre completo |
| email | String | NOT NULL, UNIQUE | Correo electrónico (login) |
| password | String | NOT NULL | Contraseña cifrada (BCrypt) |
| role | Enum | NOT NULL | `ADMIN`, `MANAGER`, `OPERATOR` |
| active | Boolean | default: true | Si el usuario está activo |
| createdAt | LocalDateTime | auto | Fecha de creación |
| updatedAt | LocalDateTime | auto | Última actualización |

### Order (Orden de Producción)

Representa una orden de producción dentro de la fábrica.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | PK | Identificador |
| product | String | NOT NULL | Nombre del producto |
| description | String (TEXT) | opcional | Descripción detallada |
| priority | Enum | NOT NULL | `HIGH`, `MEDIUM`, `LOW` |
| status | Enum | NOT NULL, default: PENDING | `PENDING`, `IN_PROGRESS`, `COMPLETED`, `DELIVERED` |
| assignedTo | User (FK) | opcional | Operador asignado |
| createdBy | User (FK) | NOT NULL | Quien creó la orden |
| customer | Customer (FK) | opcional | Cliente asociado |
| material | Material (FK) | opcional | Material principal |
| quantity | Double | opcional | Cantidad a producir |
| deadline | LocalDate | NOT NULL | Fecha límite |
| machine | String | opcional | Máquina asignada |
| statusLogs | List\<StatusLog\> | cascade | Historial de cambios de estado |
| createdAt | LocalDateTime | auto | Creación |
| updatedAt | LocalDateTime | auto | Actualización |

### StatusLog (Historial de Estado)

Registra cada cambio de estado de una orden.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | PK | Identificador |
| previousStatus | Enum | NOT NULL | Estado anterior |
| newStatus | Enum | NOT NULL | Nuevo estado |
| comment | String | opcional | Comentario del cambio |
| order | Order (FK) | NOT NULL | Orden asociada |
| changedBy | User (FK) | NOT NULL | Quien hizo el cambio |
| createdAt | LocalDateTime | auto | Fecha del cambio |

### Customer (Cliente)

Clientes que solicitan producción.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | PK | Identificador |
| name | String | NOT NULL | Nombre del cliente |
| company | String | opcional | Empresa |
| email | String | opcional | Correo |
| phone | String | opcional | Teléfono |
| address | String | opcional | Dirección |
| createdAt / updatedAt | LocalDateTime | auto | Timestamps |

### Material

Materiales usados en la producción.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | PK | Identificador |
| name | String | NOT NULL | Nombre del material |
| description | String | opcional | Descripción |
| unit | String | opcional | Unidad de medida (kg, m, etc.) |
| stockQuantity | Double | opcional | Cantidad en stock |
| createdAt / updatedAt | LocalDateTime | auto | Timestamps |

### Kpi (Indicador de Rendimiento)

Definiciones de KPIs para evaluar el desempeño.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PK | Identificador UUID |
| name | String | NOT NULL | Nombre del KPI |
| competence | String | opcional | Competencia asociada |
| specificRoleApplication | String | opcional | Aplicación del rol |
| controlMeasure | String | opcional | Medida de control |
| frequency | Enum | NOT NULL | Frecuencia de evaluación |
| valueType | Enum | NOT NULL | `BOOLEAN`, `NUMERIC`, `PERCENT`, `SCORE` |
| targetType | Enum | NOT NULL | `MIN`, `MAX`, `RANGE`, `EQUAL` |
| targetValue1 | Double | opcional | Valor objetivo 1 |
| targetValue2 | Double | opcional | Valor objetivo 2 (para RANGE) |
| aggregationMethod | Enum | NOT NULL | Método de agregación |
| unit | String | opcional | Unidad de medida del KPI |
| evidenceRequired | Boolean | NOT NULL | Si requiere evidencia |
| description | String | opcional | Descripción |
| active | Boolean | default: true | Si está activo |
| createdAt / updatedAt | LocalDateTime | auto | Timestamps |

### Assignment (Asignación de KPI)

Vincula un KPI con un trabajador.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | PK | Identificador |
| worker | User (FK) | NOT NULL | Trabajador asignado |
| kpi | Kpi (FK) | NOT NULL | KPI asignado |
| startDate | LocalDate | NOT NULL | Inicio de asignación |
| endDate | LocalDate | opcional | Fin de asignación |
| weight | Double | opcional | Peso en la evaluación |
| targetOverride | Double | opcional | Objetivo personalizado |
| createdAt / updatedAt | LocalDateTime | auto | Timestamps |

### Evaluation (Evaluación)

Registro de una evaluación de desempeño.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | PK | Identificador |
| assignment | Assignment (FK) | NOT NULL | Asignación evaluada |
| periodStart | LocalDate | NOT NULL | Inicio del periodo |
| periodEnd | LocalDate | NOT NULL | Fin del periodo |
| valueBoolean | Boolean | opcional | Valor booleano |
| valueNumber | Double | opcional | Valor numérico |
| valueText | String | opcional | Valor texto |
| status | Enum | NOT NULL | `DRAFT`, `SUBMITTED`, `APPROVED` |
| createdBy | User (FK) | NOT NULL | Quien evalúa |
| evidence | List\<Evidence\> | cascade | Evidencias adjuntas |
| createdAt / updatedAt | LocalDateTime | auto | Timestamps |

### Evidence (Evidencia)

Archivos y notas adjuntos a una evaluación.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | PK | Identificador |
| evaluation | Evaluation (FK) | NOT NULL | Evaluación asociada |
| fileUrl | String | opcional | URL del archivo |
| note | String | opcional | Nota de la evidencia |
| createdAt | LocalDateTime | auto | Timestamp |

### WorkPlan (Plan de Trabajo)

Plan anual de trabajo (global o por usuario).

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | PK | Identificador |
| year | Integer | NOT NULL | Año del plan |
| user | User (FK) | opcional | NULL = plan global |
| description | String | NOT NULL | Descripción |
| tasks | List\<WorkPlanTask\> | cascade | Tareas del plan |
| createdAt / updatedAt | LocalDateTime | auto | Timestamps |

### WorkPlanTask (Tarea del Plan)

Tareas individuales dentro de un plan de trabajo.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | PK | Identificador |
| workPlan | WorkPlan (FK) | NOT NULL | Plan padre |
| name | String | NOT NULL | Nombre de la tarea |
| startDate | LocalDate | NOT NULL | Inicio |
| endDate | LocalDate | NOT NULL | Fin |
| progress | Integer | NOT NULL | Progreso (0-100) |
| status | String | NOT NULL | `TODO`, `IN_PROGRESS`, `DONE` |
