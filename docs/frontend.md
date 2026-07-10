# 🖥️ Frontend

## Visión General

El frontend está construido con **React 18 + TypeScript** usando **Vite** como build tool y **Tailwind CSS** para estilos. Soporta temas claro/oscuro, internacionalización (japonés/inglés), y autenticación mediante JWT.

## Rutas y Páginas

| Ruta | Componente | Acceso | Descripción |
|------|------------|--------|-------------|
| `/login` | `Login.tsx` | Público | Pantalla de inicio de sesión |
| `/` | `HomePage.tsx` | Todos | Lista de órdenes con filtros y cards |
| `/dashboard` | `DashboardPage.tsx` | Admin, Manager | Dashboard con gráficos y estadísticas |
| `/customers` | `CustomersPage.tsx` | Admin | Gestión CRUD de clientes |
| `/materials` | `MaterialsPage.tsx` | Admin | Gestión CRUD de materiales |
| `/users` | `UsersPage.tsx` | Admin | Gestión CRUD de usuarios |
| `/kpis` | `KpisPage.tsx` | Admin, Manager | Gestión de indicadores de rendimiento |
| `/assignments` | `AssignmentsPage.tsx` | Admin, Manager | Asignación de KPIs a trabajadores |
| `/evaluations` | `EvaluationsPage.tsx` | Todos | Evaluaciones de desempeño |
| `/work-plans` | `WorkPlansPage.tsx` | Todos | Planes de trabajo con Gantt |
| `*` | Redirect → `/` | - | Cualquier ruta no encontrada |

## Componentes

### Páginas (`src/pages/`)

| Componente | Descripción |
|------------|-------------|
| `Login.tsx` | Formulario de autenticación con selector de idioma |
| `HomePage.tsx` | Lista principal de órdenes con filtros por estado, búsqueda y cards |
| `DashboardPage.tsx` | Dashboard con estadísticas, gráficos de recharts y métricas |
| `CustomersPage.tsx` | CRUD completo de clientes con tabla y modal |
| `MaterialsPage.tsx` | CRUD completo de materiales con tabla y modal |
| `UsersPage.tsx` | Gestión de usuarios con activación/desactivación |
| `KpisPage.tsx` | Gestión de KPIs con formularios complejos |
| `AssignmentsPage.tsx` | Asignación de KPIs a trabajadores |
| `EvaluationsPage.tsx` | Registro y revisión de evaluaciones |
| `WorkPlansPage.tsx` | Planes de trabajo anuales con vista Gantt |
| `NewOrder.tsx` | Formulario de creación de nueva orden |
| `OrderDetail.tsx` | Detalle de orden con historial de estados |

### Componentes Reutilizables (`src/components/`)

| Componente | Descripción |
|------------|-------------|
| `Layout.tsx` | Layout principal con sidebar, header, selector de idioma/tema y navegación |
| `Modal.tsx` | Componente modal genérico |
| `NewOrderModal.tsx` | Modal para crear nueva orden de producción |
| `OrderDetailModal.tsx` | Modal con detalle completo de una orden |
| `QuickEditModal.tsx` | Modal para edición rápida de órdenes |
| `OrderCard.tsx` | Tarjeta visual de una orden con prioridad y estado |
| `FilterPanel.tsx` | Panel de filtros avanzados |
| `ErrorAlert.tsx` | Alerta de error reutilizable |
| `PrivateRoute.tsx` | HOC para proteger rutas según rol |
| `WorkPlanGantt.tsx` | Componente de diagrama Gantt para planes de trabajo |

## Contexts (Estado Global)

### AuthContext (`src/context/AuthContext.tsx`)
Gestiona el estado de autenticación del usuario.

```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

- Almacena el token JWT en `localStorage`
- Persiste la sesión del usuario entre recargas
- Proporciona funciones `login()` y `logout()`

### LanguageContext (`src/context/LanguageContext.tsx`)
Gestiona el idioma de la interfaz.

```typescript
interface LanguageContextType {
  language: 'ja' | 'en';
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
}
```

- Idiomas: Japonés (ja) y English (en)
- Función `t()` para traducciones con soporte de parámetros
- Persistencia vía `localStorage`

### ThemeContext (`src/context/ThemeContext.tsx`)
Gestiona el tema visual (claro/oscuro).

```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
```

## Servicio API (`src/services/api.ts`)

Configuración centralizada de Axios con interceptores:

- **Request Interceptor**: Adjunta automáticamente el token JWT a todas las peticiones
- **Response Interceptor**: Redirige a `/login` si recibe un 401 (token expirado)

### Módulos API disponibles:

| Módulo | Funciones |
|--------|-----------|
| `authAPI` | `login()` |
| `ordersAPI` | `getAll()`, `getById()`, `create()`, `update()`, `delete()`, `updateStatus()`, `getByStatus()` |
| `usersAPI` | `getAll()`, `getById()`, `create()`, `update()`, `delete()`, `getAllOperators()`, `getAllBasic()` |
| `customersAPI` | `getAll()`, `getById()`, `create()`, `update()`, `delete()` |
| `materialsAPI` | `getAll()`, `getById()`, `create()`, `update()`, `delete()` |
| `kpisAPI` | `getAll()`, `getActive()`, `getById()`, `create()`, `update()`, `delete()` |
| `assignmentsAPI` | `getByWorker()`, `getByKpi()`, `create()`, `update()`, `delete()` |
| `evaluationsAPI` | `getCurrentPeriod()`, `submit()`, `getScore()` |
| `workPlansAPI` | `getGlobal()`, `getUser()`, `upsert()`, `addTask()`, `updateTask()`, `deleteTask()` |

## Tipos TypeScript (`src/types/index.ts`)

Todas las interfaces están definidas centralmente. Los tipos principales incluyen:

- `User`, `UserBasic`, `UserDetail`, `UserRequest`
- `Order`, `OrderRequest`, `StatusChangeRequest`, `StatusLog`
- `Customer`, `CustomerRequest`
- `Material`, `MaterialRequest`
- `Kpi`, `KpiRequest`
- `Assignment`, `AssignmentRequest`
- `Evaluation`, `EvaluationRequest`, `EvaluationResponse`
- `Evidence`, `EvidenceRequest`
- `WorkPlan`, `WorkPlanRequest`, `WorkPlanTask`, `WorkPlanTaskRequest`
- `Period`, `Score`
- Enums: `UserRole`, `OrderStatus`, `OrderPriority`, `EvaluationFrequency`, `ValueType`, `TargetType`, `AggregationMethod`, `EvaluationStatus`

## Custom Hooks

### `useFilters` (`src/hooks/useFilters.ts`)
Hook para gestionar filtros en las listas de órdenes (búsqueda, estado, prioridad).

## Utilidades (`src/utils/`)

| Archivo | Descripción |
|---------|-------------|
| `helpers.ts` | Funciones helper para formatear fechas, prioridades, estados y colores |
| `translationHelpers.ts` | Funciones para traducir valores dinámicos (prioridades, estados) |

## Estructura de Archivos de Configuración

| Archivo | Propósito |
|---------|-----------|
| `vite.config.ts` | Configuración de Vite (dev server, plugins) |
| `tailwind.config.js` | Configuración de Tailwind CSS |
| `tsconfig.json` | Opciones del compilador TypeScript |
| `postcss.config.js` | Configuración de PostCSS (plugin Tailwind) |
| `index.html` | HTML base de la SPA |
