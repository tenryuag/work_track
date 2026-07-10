# 📚 WorkTrack - Documentación

Bienvenido a la documentación completa del proyecto **WorkTrack**, un sistema de gestión de producción y desempeño para fábricas pequeñas y medianas en Japón.

## Índice de Documentación

| Documento | Descripción |
|-----------|-------------|
| [Arquitectura](./arquitectura.md) | Visión general de la arquitectura del sistema, stack tecnológico y estructura del proyecto |
| [API Reference](./api-reference.md) | Documentación completa de todos los endpoints de la API REST |
| [Modelo de Datos](./modelo-datos.md) | Diagrama y descripción de todas las entidades y sus relaciones |
| [Frontend](./frontend.md) | Estructura del frontend, páginas, componentes, rutas y contexts |
| [Autenticación y Seguridad](./autenticacion.md) | Sistema de autenticación JWT, roles, permisos y configuración de seguridad |
| [Internacionalización (i18n)](./i18n.md) | Sistema de traducciones, idiomas soportados y guía para agregar nuevos idiomas |
| [Despliegue](./despliegue.md) | Guía completa de despliegue con Docker, CI/CD con GitHub Actions y configuración de VPS |
| [Guía de Instalación](./instalacion.md) | Instrucciones paso a paso para configurar el entorno de desarrollo local |
| [Variables de Entorno](./variables-entorno.md) | Referencia completa de todas las variables de entorno y configuración |

## Inicio Rápido

```bash
# Backend
cd backend && mvn clean install && mvn spring-boot:run

# Frontend
cd frontend && npm install && npm run dev
```

**Backend:** http://localhost:8080 · **Frontend:** http://localhost:3000

## Cuentas de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@worktrack.com | admin123 |
| Manager | manager@worktrack.com | manager123 |
| Operator | operator1@worktrack.com | operator123 |

---

**Versión**: 1.0.0 · **Licencia**: MIT · **Equipo**: WorkTrack Development Team
