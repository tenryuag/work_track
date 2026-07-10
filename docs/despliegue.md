# 🚀 Guía de Despliegue

## Visión General de la Infraestructura

```
Internet
    │
    ▼
┌──────────────────────┐
│    nginx-proxy       │ ← Reverse proxy automático
│    (puerto 80/443)   │    SSL/Let's Encrypt
└──────────┬───────────┘
           │
           ▼
┌─────────────────────────────────────────────┐
│               Docker Compose                │
│                                             │
│  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Frontend   │  │     Backend         │  │
│  │  (Nginx)    │→ │  (Spring Boot)      │  │
│  │  puerto 80  │  │  puerto 8080        │  │
│  └─────────────┘  └──────────┬──────────┘  │
│                              │              │
│                   ┌──────────▼──────────┐   │
│                   │   PostgreSQL 16     │   │
│                   │   puerto 5432       │   │
│                   └─────────────────────┘   │
└─────────────────────────────────────────────┘
```

## Prerrequisitos

- VPS con Ubuntu (ej: Hostinger)
- Docker y Docker Compose instalados
- nginx-proxy + acme-companion corriendo
- Subdominio configurado (ej: `worktrack.tenryuag.com`)

## Despliegue con Docker

### Producción (`docker-compose.yml`)

Tres servicios: `db` (PostgreSQL 16), `backend` (Spring Boot), `frontend` (Nginx + React build).

```bash
# Configurar variables de entorno
cp .env.example .env
nano .env

# Desplegar
docker-compose up -d --build

# Verificar
docker-compose ps
docker-compose logs -f
```

### Desarrollo (`docker-compose.dev.yml`)

```bash
docker-compose -f docker-compose.dev.yml up
# Frontend: http://localhost:5173
# Backend: http://localhost:8080
```

## Script de Despliegue (`deploy.sh`)

```bash
./deploy.sh
```

Automatiza: build → deploy → verificación.

## CI/CD con GitHub Actions

### Workflow (`.github/workflows/deploy.yml`)

Se ejecuta automáticamente al hacer `git push` a la rama `main`:

1. Checkout del código
2. Conexión SSH al VPS
3. `git pull` del código más reciente
4. `docker-compose down` para detener contenedores
5. `docker-compose up -d --build` para reconstruir
6. Limpieza de imágenes antiguas
7. Health check a la URL de producción

### GitHub Secrets Necesarios

| Secret | Descripción | Ejemplo |
|--------|-------------|---------|
| `VPS_HOST` | IP del VPS | `123.456.789.0` |
| `VPS_USERNAME` | Usuario SSH | `root` |
| `VPS_SSH_KEY` | Clave SSH privada completa | `-----BEGIN...` |
| `VPS_PORT` | Puerto SSH | `22` |
| `DEPLOY_PATH` | Ruta del proyecto en el VPS | `/opt/work_track` |
| `VIRTUAL_HOST` | Subdominio | `worktrack.tenryuag.com` |

### Generar SSH Key

```bash
ssh-keygen -t rsa -b 4096 -C "github-actions"
ssh-copy-id -i ~/.ssh/id_rsa.pub usuario@ip-vps
cat ~/.ssh/id_rsa  # Copiar para GitHub Secret
```

## Configuración DNS

En el panel de control del dominio:

```
Tipo: A
Nombre: worktrack
Valor: [IP del VPS]
TTL: 300
```

## Comandos Útiles

```bash
# Ver logs
docker-compose logs -f [servicio]

# Reiniciar servicios
docker-compose restart [servicio]

# Acceder a un contenedor
docker exec -it worktrack-backend sh
docker exec -it worktrack-db psql -U worktrack -d worktrackdb

# Backup de la base de datos
docker exec worktrack-db pg_dump -U worktrack worktrackdb > backup_$(date +%Y%m%d).sql

# Restaurar backup
docker exec -i worktrack-db psql -U worktrack worktrackdb < backup.sql

# Actualizar manualmente
git pull origin main && docker-compose up -d --build

# Limpiar Docker
docker system prune -af
```

## SSL/HTTPS

Los certificados SSL se generan automáticamente con **Let's Encrypt** a través de `acme-companion`. Solo se necesita:

1. Que el subdominio apunte correctamente al VPS (DNS tipo A)
2. Que `VIRTUAL_HOST` y `LETSENCRYPT_HOST` estén configurados en `.env`
3. Que nginx-proxy y acme-companion estén corriendo

## Firewall (UFW)

```bash
sudo ufw enable
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw status
```

## Troubleshooting

| Problema | Solución |
|----------|----------|
| Contenedores no inician | `docker-compose logs` para ver errores |
| 502 Bad Gateway | Verificar que backend esté healthy: `docker-compose ps` |
| SSL no funciona | Verificar DNS + revisar logs: `docker logs nginx-proxy-acme` |
| Error de BD | `docker-compose logs db` + verificar `.env` |
| Red no encontrada | `docker network create nginx-proxy` |
| GitHub Actions falla | Verificar secrets + conectividad SSH |

## Check de Seguridad

- [ ] `DB_PASSWORD` cambiado del valor por defecto
- [ ] `JWT_SECRET` único y largo (64+ caracteres)
- [ ] `.env` no está en el repositorio
- [ ] Firewall configurado (solo 80, 443, SSH)
- [ ] SSL/HTTPS funcionando
- [ ] Backup reciente de la BD
