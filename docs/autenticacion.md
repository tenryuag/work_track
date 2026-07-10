# 🔐 Autenticación y Seguridad

## Visión General

WorkTrack utiliza **Spring Security** con autenticación basada en **JWT (JSON Web Tokens)** y un sistema de **roles** para controlar el acceso a las distintas funcionalidades.

## Flujo de Autenticación

```
1. Usuario envía POST /api/auth/login con email + password
2. Backend valida credenciales contra la BD (BCrypt)
3. Si son válidas, genera un JWT con el email del usuario
4. Frontend almacena el JWT en localStorage
5. Todas las peticiones subsiguientes incluyen el header:
   Authorization: Bearer <token>
6. El filtro AuthTokenFilter intercepta cada request y valida el JWT
7. Si el token expiró o es inválido → 401 Unauthorized
```

## Componentes de Seguridad

### SecurityConfig (`config/SecurityConfig.java`)

Configuración principal de Spring Security:

- **CORS**: Orígenes permitidos configurables vía `cors.allowed-origins`
- **CSRF**: Deshabilitado (se usa JWT)
- **Sesión**: Stateless (sin sesiones del servidor)
- **Endpoints públicos**: `/api/auth/**`, `/h2-console/**`, `/actuator/**`
- **Todos los demás endpoints**: Requieren autenticación

### AuthTokenFilter (`security/AuthTokenFilter.java`)

Filtro que intercepta cada request HTTP:

1. Extrae el token del header `Authorization: Bearer <token>`
2. Valida el token usando `JwtUtils`
3. Carga el `UserDetails` del usuario
4. Establece el `SecurityContext` para el request actual

### JwtUtils (`security/JwtUtils.java`)

Utilidades para manejo de JWT:

- **Generación**: Crea tokens firmados con HS512
- **Validación**: Verifica firma, expiración y formato
- **Extracción**: Obtiene el email del usuario del token
- **Configuración**:
  - `JWT_SECRET`: Clave secreta (mínimo 64 caracteres para HS512)
  - `JWT_EXPIRATION`: Tiempo de vida del token (default: 86400000ms = 24h)

### AuthEntryPointJwt (`security/AuthEntryPointJwt.java`)

Maneja los errores de autenticación, devolviendo un `401 Unauthorized` con un mensaje descriptivo.

### UserDetailsImpl (`security/UserDetailsImpl.java`)

Implementación de `UserDetails` de Spring Security que mapea la entidad `User` al modelo de seguridad.

### UserDetailsServiceImpl (`security/UserDetailsServiceImpl.java`)

Carga los datos del usuario desde la base de datos usando el email como identificador.

## Sistema de Roles

### Roles Disponibles

| Rol | Descripción |
|-----|-------------|
| `ADMIN` | Control total del sistema |
| `MANAGER` | Supervisión y gestión intermedia |
| `OPERATOR` | Operaciones básicas sobre sus propias asignaciones |

### Matriz de Permisos

| Funcionalidad | Admin | Manager | Operator |
|---------------|:-----:|:-------:|:--------:|
| **Órdenes** |||
| Ver todas las órdenes | ✅ | ✅ | Solo asignadas |
| Crear órdenes | ✅ | ❌ | ❌ |
| Editar órdenes | ✅ | ❌ | ❌ |
| Eliminar órdenes | ✅ | ❌ | ❌ |
| Cambiar estado | ✅ | ✅ | Solo sus órdenes |
| **Usuarios** |||
| Ver usuarios | ✅ | ❌ | ❌ |
| Crear/editar/eliminar | ✅ | ❌ | ❌ |
| **Clientes** |||
| CRUD clientes | ✅ | ❌ | ❌ |
| **Materiales** |||
| CRUD materiales | ✅ | ❌ | ❌ |
| **KPIs** |||
| Gestionar KPIs | ✅ | ✅ | ❌ |
| **Asignaciones** |||
| Gestionar asignaciones | ✅ | ✅ | ❌ |
| **Evaluaciones** |||
| Registrar evaluaciones | ✅ | ✅ | ✅ |
| **Dashboard** |||
| Ver dashboard | ✅ | ✅ | ❌ |
| **Planes de Trabajo** |||
| Ver y gestionar | ✅ | ✅ | ✅ |

## Protección de Rutas (Frontend)

El componente `PrivateRoute` protege las rutas según el rol:

```tsx
// Ruta para cualquier usuario autenticado
<PrivateRoute><HomePage /></PrivateRoute>

// Solo Admin
<PrivateRoute requireAdmin><CustomersPage /></PrivateRoute>

// Admin o Manager
<PrivateRoute requireAdminOrManager><DashboardPage /></PrivateRoute>
```

## Interceptores API (Frontend)

El servicio API en `api.ts` incluye dos interceptores:

1. **Request Interceptor**: Adjunta automáticamente el JWT a cada petición
2. **Response Interceptor**: Si recibe un 401, limpia el `localStorage` y redirige al login

## Cifrado de Contraseñas

Las contraseñas se almacenan cifradas con **BCrypt** (algoritmo de hashing adaptativo). Nunca se almacenan en texto plano.

## Cuentas Predeterminadas

Al iniciar la aplicación por primera vez, se crean automáticamente:

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@worktrack.com | admin123 |
| Manager | manager@worktrack.com | manager123 |
| Operator 1 | operator1@worktrack.com | operator123 |
| Operator 2 | operator2@worktrack.com | operator123 |

> ⚠️ **Importante**: Cambiar estas credenciales en producción.

## Buenas Prácticas de Seguridad

1. **JWT_SECRET**: Usar una clave de al menos 64 caracteres generada aleatoriamente
2. **HTTPS**: Siempre usar SSL/TLS en producción (automático con acme-companion)
3. **Contraseñas**: No reutilizar las credenciales de prueba en producción
4. **Firewall**: Solo permitir puertos 80, 443 y SSH
5. **.env**: Nunca subir el archivo `.env` al repositorio (está en `.gitignore`)
6. **Token Expiration**: El JWT expira a las 24 horas por defecto
