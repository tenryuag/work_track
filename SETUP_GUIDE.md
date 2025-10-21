# WorkTrack - Guía de Instalación y Configuración

## Resumen de Cambios Recientes

Se han resuelto los errores de compilación del backend eliminando la dependencia de Lombok y agregando getters/setters manuales en todas las clases Java (entidades, DTOs y clases de seguridad).

### Archivos Modificados:
- **Entidades**: User, Order, StatusLog
- **DTOs**: LoginRequest, LoginResponse, OrderRequest, OrderResponse, StatusChangeRequest
- **Seguridad**: UserDetailsImpl

## Requisitos Previos

### Backend
- Java 17 o superior
- Maven 3.6 o superior

### Frontend
- Node.js 18 o superior
- npm o yarn

## Instalación y Ejecución

### 1. Backend (Spring Boot)

```bash
# Navegar al directorio del backend
cd backend

# Compilar el proyecto (primera vez)
mvn clean install

# Ejecutar la aplicación
mvn spring-boot:run
```

El backend estará disponible en: **http://localhost:8080**

#### Endpoints Principales:
- API REST: `http://localhost:8080/api`
- H2 Console: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:worktrackdb`
  - Username: `sa`
  - Password: (dejar en blanco)

### 2. Frontend (React + TypeScript)

```bash
# Navegar al directorio del frontend
cd frontend

# Instalar dependencias
npm install

# Ejecutar el servidor de desarrollo
npm run dev
```

El frontend estará disponible en: **http://localhost:3000**

## Usuarios de Prueba

Al iniciar la aplicación por primera vez, se crean automáticamente los siguientes usuarios:

| Rol | Email | Password | Permisos |
|-----|-------|----------|----------|
| **Admin** | admin@worktrack.com | admin123 | Crear, editar, eliminar todas las órdenes |
| **Manager** | manager@worktrack.com | manager123 | Ver todas las órdenes y cambiar estados |
| **Operator** | operator1@worktrack.com | operator123 | Ver y actualizar solo sus órdenes |
| **Operator** | operator2@worktrack.com | operator123 | Ver y actualizar solo sus órdenes |

## Estructura del Proyecto

```
Work-track/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/worktrack/backend/
│   │   ├── config/                   # Configuración de seguridad
│   │   ├── controller/               # REST Controllers
│   │   ├── dto/                      # Data Transfer Objects
│   │   ├── entity/                   # JPA Entities
│   │   ├── repository/               # Data Access Layer
│   │   ├── security/                 # JWT & Authentication
│   │   ├── service/                  # Business Logic
│   │   └── BackendApplication.java  # Main Application
│   ├── src/main/resources/
│   │   └── application.properties   # Configuración
│   └── pom.xml                       # Maven Dependencies
│
└── frontend/                         # React Frontend
    ├── src/
    │   ├── components/               # Componentes reutilizables
    │   ├── context/                  # React Context (Auth)
    │   ├── pages/                    # Páginas principales
    │   ├── services/                 # API Services
    │   ├── types/                    # TypeScript Types
    │   ├── utils/                    # Utilidades
    │   ├── App.tsx                   # App Principal
    │   └── main.tsx                  # Entry Point
    ├── package.json
    ├── vite.config.ts
    └── tailwind.config.js
```

## Características Principales

### Sistema de Roles
- **Admin**: Control total del sistema
- **Manager**: Supervisión y gestión de estados
- **Operator**: Gestión de órdenes asignadas

### Funcionalidades
- ✅ Autenticación JWT
- ✅ CRUD completo de órdenes de producción
- ✅ Sistema de estados (Pendiente, En Proceso, Completado)
- ✅ Historial de cambios de estado con comentarios
- ✅ Filtros por estado
- ✅ Indicadores visuales de prioridad y fechas vencidas
- ✅ Diseño responsivo (Desktop y Tablet)
- ✅ Interfaz en japonés

## API Endpoints

### Autenticación
```
POST /api/auth/login
```

### Órdenes
```
GET    /api/orders              # Obtener todas las órdenes
GET    /api/orders/{id}         # Obtener orden por ID
POST   /api/orders              # Crear nueva orden (Admin)
PUT    /api/orders/{id}         # Actualizar orden (Admin)
DELETE /api/orders/{id}         # Eliminar orden (Admin)
PATCH  /api/orders/{id}/status  # Cambiar estado de orden
GET    /api/orders/status/{status} # Filtrar por estado
```

### Usuarios
```
GET /api/users/operators  # Obtener lista de operadores
GET /api/users            # Obtener todos los usuarios
```

## Configuración de Base de Datos

### Desarrollo (H2 - por defecto)
La configuración actual usa H2 en memoria, ideal para desarrollo. Los datos se reinician al reiniciar la aplicación.

### Producción (PostgreSQL)
Para usar PostgreSQL en producción, modifica `backend/src/main/resources/application.properties`:

```properties
# PostgreSQL Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/worktrackdb
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
```

## Compilación para Producción

### Backend
```bash
cd backend
mvn clean package
java -jar target/backend-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
# Los archivos estáticos se generan en: frontend/dist
```

## Solución de Problemas

### Error: Puerto ya en uso
**Backend (8080):**
Modifica el puerto en `application.properties`:
```properties
server.port=8081
```

**Frontend (3000):**
Modifica el puerto en `vite.config.ts`:
```typescript
server: {
  port: 3001
}
```

### Error de CORS
Verifica que el origen del frontend esté incluido en `application.properties`:
```properties
cors.allowed-origins=http://localhost:3000,http://localhost:5173
```

### Error de compilación Maven
Asegúrate de tener Java 17 o superior:
```bash
java -version
```

### Error de dependencias npm
Elimina node_modules y reinstala:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Tecnologías Utilizadas

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security + JWT**
- **Spring Data JPA**
- **H2 Database** (desarrollo)
- **PostgreSQL** (producción)
- **Maven**

### Frontend
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **React Router**
- **Axios**
- **Vite**
- **date-fns**
- **lucide-react** (iconos)

## Próximos Pasos

1. **Prueba la aplicación**:
   - Inicia sesión con diferentes roles
   - Crea órdenes de producción
   - Cambia estados y agrega comentarios
   - Verifica los filtros

2. **Personaliza según tus necesidades**:
   - Ajusta los colores en `tailwind.config.js`
   - Modifica las traducciones en los componentes
   - Agrega campos personalizados a las órdenes

3. **Despliega en producción**:
   - Configura PostgreSQL
   - Ajusta las variables de entorno
   - Configura un servidor web (Nginx, Apache)
   - Considera usar Docker para el despliegue

## Soporte

Para reportar problemas o sugerencias, consulta el README principal del proyecto.

---

**Versión**: 1.0.0
**Última actualización**: Octubre 2025
