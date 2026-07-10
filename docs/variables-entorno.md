# ⚙️ Variables de Entorno

## Archivo `.env` (Raíz del Proyecto)

Usado por Docker Compose para configurar los servicios en producción.

```bash
# Copiar template
cp .env.example .env
```

### Variables Disponibles

| Variable | Requerida | Default | Descripción |
|----------|:---------:|---------|-------------|
| `DB_NAME` | Sí | `worktrackdb` | Nombre de la base de datos PostgreSQL |
| `DB_USERNAME` | Sí | `worktrack` | Usuario de la base de datos |
| `DB_PASSWORD` | Sí | - | Contraseña de la base de datos |
| `JWT_SECRET` | Sí | - | Clave secreta para firmar tokens JWT (mínimo 64 caracteres) |
| `JWT_EXPIRATION` | No | `86400000` | Tiempo de vida del token JWT en milisegundos (24h por defecto) |
| `VIRTUAL_HOST` | Sí | `worktrack.example.com` | Subdominio para nginx-proxy |
| `LETSENCRYPT_HOST` | Sí | `worktrack.example.com` | Subdominio para certificado SSL |
| `LETSENCRYPT_EMAIL` | Sí | - | Email asociado al certificado SSL |

### Ejemplo Completo

```env
# Database Configuration
DB_NAME=worktrackdb
DB_USERNAME=worktrack
DB_PASSWORD=tu_password_seguro_aqui

# JWT Configuration
JWT_SECRET=tu_jwt_secret_muy_largo_y_seguro_aqui_minimo_64_caracteres
JWT_EXPIRATION=86400000

# Domain Configuration
VIRTUAL_HOST=worktrack.tenryuag.com
LETSENCRYPT_HOST=worktrack.tenryuag.com
LETSENCRYPT_EMAIL=tenryuabe@gmail.com
```

### Generar Valores Seguros

```bash
# JWT_SECRET (64+ caracteres)
openssl rand -base64 64 | tr -d '\n'

# DB_PASSWORD
openssl rand -base64 32 | tr -d '\n'
```

---

## Backend (`application.properties`)

Ubicación: `backend/src/main/resources/application.properties`

### Base de Datos

| Propiedad | Descripción |
|-----------|-------------|
| `spring.datasource.url` | URL JDBC de la base de datos |
| `spring.datasource.username` | Usuario de la BD |
| `spring.datasource.password` | Contraseña de la BD |
| `spring.jpa.database-platform` | Dialecto (H2 o PostgreSQL) |
| `spring.jpa.hibernate.ddl-auto` | Estrategia DDL (`create-drop`, `update`, etc.) |

**Desarrollo (H2):**
```properties
spring.datasource.url=jdbc:h2:mem:worktrackdb
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
```

**Producción (PostgreSQL):**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/worktrackdb
spring.datasource.username=worktrack
spring.datasource.password=tu_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
```

### JWT

| Propiedad | Descripción | Default |
|-----------|-------------|---------|
| `jwt.secret` | Clave secreta para firmar tokens | - |
| `jwt.expiration` | Tiempo de expiración (ms) | `86400000` (24h) |

### Servidor

| Propiedad | Descripción | Default |
|-----------|-------------|---------|
| `server.port` | Puerto del servidor | `8080` |
| `cors.allowed-origins` | Orígenes permitidos (CORS) | `http://localhost:3000` |

### H2 Console

| Propiedad | Descripción | Default |
|-----------|-------------|---------|
| `spring.h2.console.enabled` | Habilitar consola H2 | `true` (dev) |
| `spring.h2.console.path` | Ruta de la consola | `/h2-console` |

### Actuator

| Propiedad | Descripción |
|-----------|-------------|
| `management.endpoints.web.exposure.include` | Endpoints expuestos (ej: `health`) |

---

## Frontend

### Variables de Entorno Vite

Ubicación: `frontend/.env` (o variables de entorno del sistema)

| Variable | Descripción | Default |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API backend | `/api` (usa proxy del nginx en prod) |

**Desarrollo local:**
```env
VITE_API_URL=http://localhost:8080/api
```

**Producción (Docker):**
No se necesita configurar, el frontend Nginx hace proxy a `/api` automáticamente.

### Variables en Docker Compose

Las siguientes variables son usadas por el contenedor frontend en producción:

| Variable | Descripción |
|----------|-------------|
| `VIRTUAL_HOST` | Subdominio para nginx-proxy |
| `LETSENCRYPT_HOST` | Subdominio para SSL |
| `LETSENCRYPT_EMAIL` | Email para Let's Encrypt |

---

## Variables para CI/CD (GitHub Secrets)

Estas variables se configuran en **GitHub → Settings → Secrets and Variables → Actions**:

| Secret | Descripción |
|--------|-------------|
| `VPS_HOST` | IP o dominio del VPS |
| `VPS_USERNAME` | Usuario SSH (generalmente `root`) |
| `VPS_SSH_KEY` | Clave SSH privada completa |
| `VPS_PORT` | Puerto SSH (generalmente `22`) |
| `DEPLOY_PATH` | Ruta del proyecto en el VPS (ej: `/opt/work_track`) |
| `VIRTUAL_HOST` | Subdominio de producción |

---

## Resumen de Puertos

| Servicio | Puerto (Dev) | Puerto (Prod) |
|----------|:------------:|:--------------:|
| Frontend (Vite) | 3000 / 5173 | 80 (via Nginx) |
| Backend (Spring) | 8080 | 8080 (interno) |
| PostgreSQL | 5432 | 5432 (interno) |
| H2 Console | 8080 | N/A |
| nginx-proxy | N/A | 80, 443 |
