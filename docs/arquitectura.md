# 🏗️ Arquitectura del Sistema

## Visión General

WorkTrack es una aplicación full-stack con arquitectura **cliente-servidor** basada en:

- **Backend**: API REST con Spring Boot (Java 17)
- **Frontend**: SPA con React 18 + TypeScript
- **Base de Datos**: H2 (desarrollo) / PostgreSQL (producción)
- **Infraestructura**: Docker + nginx-proxy + SSL automático

```
┌─────────────────────────────────────────────────────────┐
│                      Cliente                            │
│  React 18 + TypeScript + Tailwind + Vite               │
│  Puerto: 3000 (dev) / 80 (prod via Nginx)              │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS (Axios)
                     │ JWT Bearer Token
┌────────────────────▼────────────────────────────────────┐
│                   Servidor                              │
│  Spring Boot 3.2.0 + Spring Security + JPA             │
│  Puerto: 8080                                          │
└────────────────────┬────────────────────────────────────┘
                     │ JDBC
┌────────────────────▼────────────────────────────────────┐
│                 Base de Datos                           │
│  H2 (dev, en memoria) / PostgreSQL 16 (prod)           │
└─────────────────────────────────────────────────────────┘
```

## Stack Tecnológico

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Java | 17 | Lenguaje principal |
| Spring Boot | 3.2.0 | Framework web |
| Spring Security | 6.x | Autenticación y autorización |
| Spring Data JPA | 3.x | Persistencia de datos |
| JJWT | 0.12.3 | Generación y validación de tokens JWT |
| H2 Database | - | Base de datos en memoria (desarrollo) |
| PostgreSQL | 16 | Base de datos relacional (producción) |
| Maven | 3.6+ | Gestión de dependencias y build |
| Spring Actuator | 3.x | Health checks y monitoreo |

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18.2 | Librería de UI |
| TypeScript | 5.2 | Tipado estático |
| Vite | 5.0 | Build tool y dev server |
| Tailwind CSS | 3.4 | Framework CSS utility-first |
| React Router | 6.21 | Enrutamiento SPA |
| Axios | 1.6 | Cliente HTTP |
| Recharts | 3.3 | Gráficos y visualizaciones |
| Lucide React | 0.303 | Iconos |
| date-fns | 3.0 | Manipulación de fechas |
| @dnd-kit | 6.3 | Drag and Drop |

### Infraestructura

| Tecnología | Propósito |
|------------|-----------|
| Docker & Docker Compose | Contenedorización |
| nginx-proxy | Reverse proxy automático |
| acme-companion | Certificados SSL/Let's Encrypt |
| GitHub Actions | CI/CD |

## Estructura del Proyecto

```
Work-track/
├── backend/                          # Spring Boot Backend
│   ├── Dockerfile                    # Imagen Docker del backend
│   ├── pom.xml                       # Dependencias Maven
│   └── src/main/java/com/worktrack/backend/
│       ├── BackendApplication.java   # Clase principal + seed data
│       ├── config/
│       │   └── SecurityConfig.java   # Configuración de Spring Security
│       ├── controller/               # 9 REST Controllers
│       │   ├── AuthController.java
│       │   ├── OrderController.java
│       │   ├── UserController.java
│       │   ├── CustomerController.java
│       │   ├── MaterialController.java
│       │   ├── KpiController.java
│       │   ├── AssignmentController.java
│       │   ├── EvaluationController.java
│       │   └── WorkPlanController.java
│       ├── dto/                      # 24 Data Transfer Objects
│       ├── entity/                   # 11 Entidades JPA
│       │   ├── Order.java
│       │   ├── User.java
│       │   ├── Customer.java
│       │   ├── Material.java
│       │   ├── StatusLog.java
│       │   ├── Kpi.java
│       │   ├── Assignment.java
│       │   ├── Evaluation.java
│       │   ├── Evidence.java
│       │   ├── WorkPlan.java
│       │   └── WorkPlanTask.java
│       ├── enums/                    # Enumeraciones
│       │   ├── AggregationMethod.java
│       │   ├── EvaluationFrequency.java
│       │   ├── EvaluationStatus.java
│       │   ├── TargetType.java
│       │   └── ValueType.java
│       ├── repository/              # 11 Repositorios JPA
│       ├── security/                # JWT y autenticación
│       │   ├── AuthEntryPointJwt.java
│       │   ├── AuthTokenFilter.java
│       │   ├── JwtUtils.java
│       │   ├── UserDetailsImpl.java
│       │   └── UserDetailsServiceImpl.java
│       └── service/                 # 9 Servicios de negocio
│
├── frontend/                         # React Frontend
│   ├── Dockerfile                    # Imagen Docker del frontend
│   ├── nginx.conf                    # Configuración Nginx para SPA
│   ├── package.json                  # Dependencias npm
│   ├── vite.config.ts                # Configuración de Vite
│   ├── tailwind.config.js            # Configuración de Tailwind
│   ├── tsconfig.json                 # Configuración TypeScript
│   └── src/
│       ├── App.tsx                   # Componente raíz y rutas
│       ├── main.tsx                  # Punto de entrada
│       ├── index.css                 # Estilos globales
│       ├── components/              # 10 componentes reutilizables
│       ├── context/                 # 3 React Contexts
│       │   ├── AuthContext.tsx
│       │   ├── LanguageContext.tsx
│       │   └── ThemeContext.tsx
│       ├── hooks/                   # Custom hooks
│       │   └── useFilters.ts
│       ├── i18n/                    # Traducciones
│       │   └── translations.ts
│       ├── pages/                   # 12 páginas
│       ├── services/                # Cliente API
│       │   └── api.ts
│       ├── types/                   # Definiciones TypeScript
│       │   └── index.ts
│       └── utils/                   # Utilidades
│           ├── helpers.ts
│           └── translationHelpers.ts
│
├── .github/workflows/
│   └── deploy.yml                   # CI/CD con GitHub Actions
├── docker-compose.yml               # Orquestación producción
├── docker-compose.dev.yml           # Orquestación desarrollo
├── deploy.sh                        # Script de despliegue
└── .env.example                     # Template de variables de entorno
```

## Capas de la Arquitectura Backend

```
Controller (REST API)
    ↓ DTO (Request/Response)
Service (Lógica de Negocio)
    ↓ Entity
Repository (Acceso a Datos / JPA)
    ↓
Base de Datos
```

1. **Controller**: Recibe y responde peticiones HTTP. Valida entrada y mapea DTOs.
2. **Service**: Contiene la lógica de negocio. Realiza transformaciones y orquesta operaciones.
3. **Repository**: Interfaz con la base de datos vía Spring Data JPA.
4. **Entity**: Modelos que representan las tablas de la base de datos.
5. **DTO**: Objetos de transferencia que desacoplan la API del modelo interno.
6. **Security**: Filtros de autenticación JWT y configuración de Spring Security.

## Patrones de Diseño Utilizados

- **MVC (Model-View-Controller)**: Separación controller/service/repository
- **Repository Pattern**: Abstracción del acceso a datos con Spring Data
- **DTO Pattern**: Separación entre modelo de dominio y API pública
- **Interceptor Pattern**: Filtros JWT para autenticación automática
- **Context Pattern (React)**: Estado global para auth, idioma y tema
- **Provider Pattern**: ThemeProvider, LanguageProvider, AuthProvider
