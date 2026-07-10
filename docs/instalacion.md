# 🛠️ Guía de Instalación

## Requisitos Previos

### Backend
- **Java 17** o superior → [Descargar](https://adoptium.net/)
- **Maven 3.6** o superior → [Descargar](https://maven.apache.org/)

### Frontend
- **Node.js 18** o superior → [Descargar](https://nodejs.org/)
- **npm** (incluido con Node.js)

### Verificar instalaciones

```bash
java -version       # Debería mostrar 17+
mvn -version        # Debería mostrar 3.6+
node -v             # Debería mostrar 18+
npm -v              # Debería mostrar 9+
```

## Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tenryuag/work_track.git
cd work_track
```

### 2. Iniciar el Backend

```bash
cd backend

# Compilar el proyecto
mvn clean install

# Ejecutar la aplicación
mvn spring-boot:run
```

El backend estará disponible en: **http://localhost:8080**

#### Verificar que funciona:
- API: http://localhost:8080/api
- Health: http://localhost:8080/actuator/health
- H2 Console: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:worktrackdb`
  - Username: `sa`
  - Password: *(dejar en blanco)*

### 3. Iniciar el Frontend

En una terminal nueva:

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

El frontend estará disponible en: **http://localhost:3000**

### 4. Probar la Aplicación

1. Abre http://localhost:3000 en tu navegador
2. Inicia sesión con las credenciales de prueba:

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@worktrack.com | admin123 |
| Manager | manager@worktrack.com | manager123 |
| Operator 1 | operator1@worktrack.com | operator123 |
| Operator 2 | operator2@worktrack.com | operator123 |

## Base de Datos

### Desarrollo (H2 - por defecto)

En modo desarrollo se usa H2, una base de datos en memoria. Los datos se reinician al reiniciar la aplicación. Los usuarios de prueba se crean automáticamente al iniciar.

### Producción (PostgreSQL)

Para usar PostgreSQL, modifica `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/worktrackdb
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
```

## Compilar para Producción

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
# Los archivos se generan en: frontend/dist/
```

## Desarrollo con Docker

También puedes usar Docker Compose para desarrollo:

```bash
docker-compose -f docker-compose.dev.yml up
```

Esto levanta PostgreSQL, Backend y Frontend con hot-reload:
- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- PostgreSQL: localhost:5432

## Solución de Problemas

### Puerto ya en uso

**Backend (8080):**
```properties
# En application.properties
server.port=8081
```

**Frontend (3000):**
```typescript
// En vite.config.ts
server: { port: 3001 }
```

### Error de CORS

Verificar que el origen del frontend esté en `application.properties`:
```properties
cors.allowed-origins=http://localhost:3000,http://localhost:5173
```

### Error de compilación Maven

```bash
java -version  # Verificar que sea Java 17+
mvn -version   # Verificar Maven 3.6+
```

### Error de dependencias npm

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Error de conexión al backend

Verificar que `VITE_API_URL` apunte al backend correcto:
```bash
# En frontend/.env (o variable de entorno)
VITE_API_URL=http://localhost:8080/api
```
