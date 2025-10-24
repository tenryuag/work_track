# WorkTrack - Guía de Despliegue en VPS

Esta guía te llevará paso a paso para desplegar WorkTrack en tu VPS de Hostinger con Docker.

## 📋 Requisitos Previos

- VPS con Ubuntu (ya lo tienes ✅)
- Docker y Docker Compose instalados (ya lo tienes ✅)
- nginx-proxy o Traefik para gestionar subdominios
- Acceso SSH a tu VPS
- Un subdominio configurado (ejemplo: `worktrack.tudominio.com`)

## 🚀 Configuración Inicial en el VPS

### 1. Verificar nginx-proxy

Primero, verifica si ya tienes nginx-proxy corriendo:

```bash
docker ps | grep nginx-proxy
```

Si NO tienes nginx-proxy, instálalo:

```bash
# Crear red para nginx-proxy
docker network create nginx-proxy

# Iniciar nginx-proxy
docker run -d -p 80:80 -p 443:443 \
  --name nginx-proxy \
  --net nginx-proxy \
  -v /var/run/docker.sock:/tmp/docker.sock:ro \
  -v nginx-certs:/etc/nginx/certs \
  -v nginx-vhost:/etc/nginx/vhost.d \
  -v nginx-html:/usr/share/nginx/html \
  --restart unless-stopped \
  jwilder/nginx-proxy

# Iniciar letsencrypt companion para SSL
docker run -d \
  --name nginx-proxy-letsencrypt \
  --net nginx-proxy \
  --volumes-from nginx-proxy \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -v nginx-acme:/etc/acme.sh \
  --restart unless-stopped \
  jrcs/letsencrypt-nginx-proxy-companion
```

### 2. Clonar el repositorio en el VPS

```bash
# Navega al directorio donde quieres alojar el proyecto
cd /opt  # O cualquier directorio de tu preferencia

# Clona el repositorio
git clone https://github.com/tenryuag/work_track.git
cd work_track
```

### 3. Configurar variables de entorno

Crea el archivo `.env` basado en el ejemplo:

```bash
cp .env.example .env
nano .env
```

Actualiza los siguientes valores:

```env
# Database Configuration
DB_NAME=worktrackdb
DB_USERNAME=worktrack
DB_PASSWORD=TU_PASSWORD_SEGURO_AQUI  # ⚠️ CAMBIAR!

# JWT Configuration (genera uno único)
JWT_SECRET=TU_JWT_SECRET_MUY_LARGO_Y_SEGURO_AQUI  # ⚠️ CAMBIAR!
JWT_EXPIRATION=86400000

# Domain Configuration
VIRTUAL_HOST=worktrack.tudominio.com  # ⚠️ CAMBIAR!
LETSENCRYPT_HOST=worktrack.tudominio.com  # ⚠️ CAMBIAR!
LETSENCRYPT_EMAIL=tu-email@ejemplo.com  # ⚠️ CAMBIAR!
```

**Generar JWT_SECRET seguro:**
```bash
openssl rand -base64 64 | tr -d '\n'
```

### 4. Configurar DNS

En tu panel de control de Hostinger, agrega un registro DNS tipo A:

- **Tipo**: A
- **Nombre**: worktrack (o el subdominio que quieras)
- **Apunta a**: IP de tu VPS
- **TTL**: 300

Espera unos minutos a que se propague el DNS.

## 🏗️ Primer Despliegue

### Opción 1: Usando el script de deployment

```bash
./deploy.sh
```

### Opción 2: Manual con docker-compose

```bash
# Construir y levantar los contenedores
docker-compose up -d --build

# Ver el estado de los contenedores
docker-compose ps

# Ver los logs
docker-compose logs -f
```

## 🔍 Verificación

Después del despliegue, verifica que todo funciona:

1. **Ver logs de los contenedores:**
   ```bash
   docker-compose logs -f
   ```

2. **Verificar salud de los servicios:**
   ```bash
   docker-compose ps
   ```

   Todos los servicios deben mostrar "healthy" en el estado.

3. **Acceder a la aplicación:**
   - Abre tu navegador en `https://worktrack.tudominio.com`
   - Deberías ver la pantalla de login

## 🔄 Despliegue Automático (CI/CD)

### Configurar GitHub Secrets

Para que el despliegue automático funcione, necesitas configurar los siguientes secrets en GitHub:

1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Clic en "New repository secret"
4. Agrega los siguientes secrets:

| Secret Name | Valor | Descripción |
|------------|-------|-------------|
| `VPS_HOST` | IP o dominio de tu VPS | Ejemplo: `123.456.789.0` |
| `VPS_USERNAME` | Usuario SSH | Generalmente `root` u otro usuario |
| `VPS_SSH_KEY` | Tu clave SSH privada | El contenido completo de `~/.ssh/id_rsa` |
| `VPS_PORT` | Puerto SSH | Generalmente `22` |
| `DEPLOY_PATH` | Ruta del proyecto | Ejemplo: `/opt/work_track` |
| `VIRTUAL_HOST` | Tu subdominio | Ejemplo: `worktrack.tudominio.com` |

### Generar SSH Key (si no tienes)

En tu computadora local:

```bash
# Generar nueva SSH key
ssh-keygen -t rsa -b 4096 -C "github-actions"

# Copiar la clave pública al VPS
ssh-copy-id -i ~/.ssh/id_rsa.pub usuario@tu-vps-ip

# Copiar la clave privada para GitHub Secrets
cat ~/.ssh/id_rsa
# Copia TODO el contenido (incluyendo BEGIN y END)
```

### Cómo funciona el CI/CD

Ahora, cada vez que hagas `git push` a la rama `main`:

1. ✅ GitHub Actions detecta el push
2. 📥 Se conecta a tu VPS por SSH
3. 🔄 Hace `git pull` del código más reciente
4. 🛑 Detiene los contenedores actuales
5. 🔨 Reconstruye las imágenes Docker
6. 🚀 Levanta los nuevos contenedores
7. 🧹 Limpia imágenes viejas
8. ✅ Verifica que la aplicación esté funcionando

## 📝 Comandos Útiles

### Ver logs en tiempo real
```bash
docker-compose logs -f
```

### Ver logs de un servicio específico
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Reiniciar servicios
```bash
# Reiniciar todos
docker-compose restart

# Reiniciar uno específico
docker-compose restart backend
```

### Detener la aplicación
```bash
docker-compose down
```

### Actualizar manualmente
```bash
git pull origin main
docker-compose up -d --build
```

### Acceder al contenedor
```bash
# Backend
docker exec -it worktrack-backend sh

# Frontend
docker exec -it worktrack-frontend sh

# Database
docker exec -it worktrack-db psql -U worktrack -d worktrackdb
```

### Backup de la base de datos
```bash
# Crear backup
docker exec worktrack-db pg_dump -U worktrack worktrackdb > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker exec -i worktrack-db psql -U worktrack worktrackdb < backup_20250124_123456.sql
```

### Limpiar Docker
```bash
# Limpiar contenedores detenidos, imágenes sin usar, etc.
docker system prune -a
```

## 🐛 Troubleshooting

### La aplicación no carga

1. **Verificar logs:**
   ```bash
   docker-compose logs -f
   ```

2. **Verificar estado de contenedores:**
   ```bash
   docker-compose ps
   ```

3. **Verificar DNS:**
   ```bash
   nslookup worktrack.tudominio.com
   ```

### Error de conexión a la base de datos

```bash
# Verificar que el contenedor de DB esté corriendo
docker-compose ps db

# Ver logs de la base de datos
docker-compose logs db

# Verificar variables de entorno
docker-compose config
```

### SSL no funciona

```bash
# Ver logs de letsencrypt
docker logs nginx-proxy-letsencrypt

# Verificar que el dominio esté accesible
curl -I http://worktrack.tudominio.com
```

### Contenedor se reinicia constantemente

```bash
# Ver por qué falla
docker-compose logs --tail=100 nombre-del-servicio

# Verificar health checks
docker inspect worktrack-backend | grep -A 10 Health
```

## 🔐 Seguridad

### Recomendaciones importantes:

1. **Nunca subir .env al repositorio** - Ya está en .gitignore ✅
2. **Cambiar passwords default** - Especialmente DB_PASSWORD ⚠️
3. **Usar JWT_SECRET único y largo** - Mínimo 64 caracteres ⚠️
4. **Firewall** - Asegúrate de que solo los puertos 80, 443 y SSH estén abiertos
5. **Backups regulares** - Programa backups automáticos de la base de datos
6. **Actualizaciones** - Mantén Docker y las imágenes actualizadas

### Configurar firewall (UFW)

```bash
# Habilitar UFW
sudo ufw enable

# Permitir SSH
sudo ufw allow 22/tcp

# Permitir HTTP y HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Ver estado
sudo ufw status
```

## 📊 Monitoreo

### Ver uso de recursos

```bash
# Uso de CPU/Memoria por contenedor
docker stats

# Espacio en disco
docker system df
```

### Logs de acceso

```bash
# Ver logs de nginx-proxy
docker logs nginx-proxy --tail=100 -f
```

## 🎯 Próximos Pasos

Después del primer despliegue exitoso:

1. ✅ Configurar backups automáticos
2. ✅ Configurar monitoreo (opcional: Portainer, Grafana)
3. ✅ Probar el flujo de CI/CD completo
4. ✅ Documentar cualquier customización específica

## 📞 Soporte

Si encuentras algún problema:

1. Revisa los logs: `docker-compose logs -f`
2. Verifica la sección de Troubleshooting arriba
3. Revisa los issues en GitHub

---

**¡Feliz despliegue! 🚀**
