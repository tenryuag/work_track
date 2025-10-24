# WorkTrack - Guía de Despliegue para worktrack.tenryuag.com

## 🎯 Resumen
Esta guía te llevará paso a paso para desplegar WorkTrack en tu VPS de Hostinger usando:
- Subdominio: `worktrack.tenryuag.com`
- nginx-proxy + acme-companion (ya configurado ✅)
- Docker Compose
- GitHub Actions para CI/CD

---

## 📝 Paso 1: Configurar DNS en Hostinger

1. Inicia sesión en tu panel de Hostinger
2. Ve a la sección de DNS para tu dominio `tenryuag.com`
3. Agrega un nuevo registro DNS tipo A:

```
Tipo: A
Nombre: worktrack
Valor: [IP de tu VPS]
TTL: 300 (o el default)
```

4. Guarda los cambios
5. **Espera 5-10 minutos** para que se propague el DNS

**Verificar DNS:**
```bash
# En tu computadora local
nslookup worktrack.tenryuag.com

# Debería mostrar la IP de tu VPS
```

---

## 🔐 Paso 2: Configurar GitHub Secrets para CI/CD

Para que el despliegue automático funcione, necesitas configurar estos secrets en GitHub:

### 2.1. Ir a GitHub Settings

1. Ve a tu repositorio: https://github.com/tenryuag/work_track
2. Click en **Settings** → **Secrets and variables** → **Actions**
3. Click en **New repository secret**

### 2.2. Agregar estos secrets:

| Secret Name | Valor | Descripción |
|------------|-------|-------------|
| `VPS_HOST` | `[IP de tu VPS]` | La dirección IP de tu VPS de Hostinger |
| `VPS_USERNAME` | `root` | Usuario SSH (probablemente `root`) |
| `VPS_SSH_KEY` | `[Tu SSH private key]` | Ver instrucciones abajo ⬇️ |
| `VPS_PORT` | `22` | Puerto SSH (generalmente `22`) |
| `DEPLOY_PATH` | `/opt/work_track` | Donde estará el proyecto |
| `VIRTUAL_HOST` | `worktrack.tenryuag.com` | Tu subdominio |

### 2.3. Obtener tu SSH Private Key

**Opción A: Si ya tienes SSH key configurada**
```bash
# En tu computadora local
cat ~/.ssh/id_rsa
```

**Opción B: Si necesitas crear una nueva SSH key**
```bash
# En tu computadora local
ssh-keygen -t rsa -b 4096 -C "github-actions-worktrack"
# Presiona Enter 3 veces (sin passphrase)

# Ver la clave privada
cat ~/.ssh/id_rsa

# Copiar la clave pública al VPS
ssh-copy-id -i ~/.ssh/id_rsa.pub root@[IP-de-tu-VPS]
```

**⚠️ IMPORTANTE**: Copia TODO el contenido de la clave privada, incluyendo:
```
-----BEGIN OPENSSH PRIVATE KEY-----
... todo el contenido ...
-----END OPENSSH PRIVATE KEY-----
```

---

## 🖥️ Paso 3: Configurar el VPS

### 3.1. Conectarse al VPS

```bash
ssh root@[IP-de-tu-VPS]
```

### 3.2. Verificar que nginx-proxy esté corriendo

```bash
docker ps | grep nginx-proxy
```

Deberías ver dos contenedores:
- `nginx-proxy`
- `acme-companion` (o `nginx-proxy-acme`)

### 3.3. Verificar la red de nginx-proxy

```bash
docker network ls | grep nginx-proxy
```

Si NO existe, créala:
```bash
docker network create nginx-proxy
```

### 3.4. Clonar el repositorio

```bash
# Ir al directorio donde quieres alojar el proyecto
cd /opt

# Clonar el repositorio
git clone https://github.com/tenryuag/work_track.git

# Entrar al directorio
cd work_track
```

### 3.5. Crear y configurar el archivo .env

```bash
# Copiar el template
cp .env.example .env

# Editar el archivo
nano .env
```

Actualiza estos valores en el archivo `.env`:

```env
# Database Configuration
DB_NAME=worktrackdb
DB_USERNAME=worktrack
DB_PASSWORD=TU_PASSWORD_SUPER_SEGURO_AQUI  # ⚠️ ¡CÁMBIALO!

# JWT Configuration
JWT_SECRET=TU_JWT_SECRET_LARGO_Y_ALEATORIO_AQUI  # ⚠️ ¡CÁMBIALO!
JWT_EXPIRATION=86400000

# Domain Configuration
VIRTUAL_HOST=worktrack.tenryuag.com
LETSENCRYPT_HOST=worktrack.tenryuag.com
LETSENCRYPT_EMAIL=tenryuabe@gmail.com
```

**Generar un JWT_SECRET seguro:**
```bash
openssl rand -base64 64 | tr -d '\n'
# Copia el resultado y úsalo en JWT_SECRET
```

**Generar un DB_PASSWORD seguro:**
```bash
openssl rand -base64 32 | tr -d '\n'
# Copia el resultado y úsalo en DB_PASSWORD
```

Guarda el archivo: `Ctrl + X`, luego `Y`, luego `Enter`

---

## 🚀 Paso 4: Primer Despliegue

### 4.1. Desplegar usando el script

```bash
./deploy.sh
```

### 4.2. O manualmente con docker-compose

```bash
# Construir y levantar los contenedores
docker-compose up -d --build

# Ver el progreso
docker-compose logs -f
```

### 4.3. Monitorear el despliegue

```bash
# Ver el estado de los contenedores
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Ver solo logs del backend
docker-compose logs -f backend

# Ver solo logs del frontend
docker-compose logs -f frontend
```

**Espera 2-3 minutos** para que:
1. Los contenedores se construyan
2. La base de datos se inicialice
3. El backend inicie
4. acme-companion genere el certificado SSL

---

## ✅ Paso 5: Verificación

### 5.1. Verificar que los contenedores estén corriendo

```bash
docker-compose ps
```

Deberías ver algo como:
```
NAME                    STATUS              PORTS
worktrack-backend       Up (healthy)
worktrack-db            Up (healthy)        5432/tcp
worktrack-frontend      Up (healthy)        80/tcp
```

### 5.2. Verificar certificado SSL

```bash
# Ver logs de acme-companion
docker logs nginx-proxy-acme --tail=50 | grep worktrack

# Verificar certificado
ls -la /var/lib/docker/volumes/nginx-certs/_data/ | grep worktrack
```

### 5.3. Probar la aplicación

1. Abre tu navegador
2. Ve a: **https://worktrack.tenryuag.com**
3. Deberías ver la pantalla de login de WorkTrack! 🎉

**Credenciales de prueba** (si tienes los datos de seed):
- Admin: `admin@worktrack.com` / `admin123`
- Manager: `manager@worktrack.com` / `manager123`
- Operator: `operator@worktrack.com` / `operator123`

---

## 🔄 Paso 6: Probar CI/CD Automático

Ahora que todo está configurado, prueba el despliegue automático:

### 6.1. Hacer un cambio pequeño

En tu computadora local:

```bash
# Asegúrate de estar en la rama main
git checkout main

# Hacer un cambio pequeño (ejemplo)
echo "# WorkTrack v1.0" >> README.md

# Commit y push
git add README.md
git commit -m "test: Probar CI/CD automático"
git push origin main
```

### 6.2. Ver el despliegue en GitHub

1. Ve a tu repositorio en GitHub
2. Click en la pestaña **Actions**
3. Verás el workflow "Deploy to VPS" ejecutándose
4. Click en él para ver los detalles

### 6.3. Verificar en el VPS

```bash
# En tu VPS
cd /opt/work_track

# Ver que se hizo git pull
git log -1

# Ver que los contenedores se reiniciaron
docker-compose ps
```

¡Si todo funciona, tu CI/CD está activo! 🚀

---

## 📋 Comandos Útiles

### Ver logs
```bash
# Todos los servicios
docker-compose logs -f

# Un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Últimas 100 líneas
docker-compose logs --tail=100
```

### Gestionar contenedores
```bash
# Reiniciar todos
docker-compose restart

# Reiniciar uno específico
docker-compose restart backend

# Detener todos
docker-compose down

# Detener y eliminar volúmenes (⚠️ BORRA LA BD)
docker-compose down -v

# Ver estado
docker-compose ps

# Ver uso de recursos
docker stats
```

### Backup de base de datos
```bash
# Crear backup
docker exec worktrack-db pg_dump -U worktrack worktrackdb > backup_$(date +%Y%m%d_%H%M%S).sql

# Ver backups
ls -lh backup_*.sql

# Restaurar backup (⚠️ cuidado!)
docker exec -i worktrack-db psql -U worktrack worktrackdb < backup_20250124_120000.sql
```

### Actualizar manualmente
```bash
cd /opt/work_track
git pull origin main
docker-compose up -d --build
docker-compose logs -f
```

### Acceder a contenedores
```bash
# Backend
docker exec -it worktrack-backend sh

# Frontend
docker exec -it worktrack-frontend sh

# Database
docker exec -it worktrack-db psql -U worktrack -d worktrackdb
```

### Limpiar Docker
```bash
# Limpiar imágenes no usadas
docker image prune -af

# Limpiar todo (contenedores detenidos, redes, imágenes)
docker system prune -a

# Ver espacio usado
docker system df
```

---

## 🐛 Troubleshooting

### ❌ "Cannot connect to the Docker daemon"
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### ❌ Los contenedores no inician
```bash
# Ver por qué falló
docker-compose logs

# Ver estado detallado
docker-compose ps
docker inspect worktrack-backend
```

### ❌ Error "network nginx-proxy not found"
```bash
# Crear la red
docker network create nginx-proxy

# Reiniciar
docker-compose down
docker-compose up -d
```

### ❌ "502 Bad Gateway" al acceder
```bash
# Verificar que el backend esté corriendo
docker-compose ps

# Ver logs del backend
docker-compose logs backend

# Verificar health check
docker inspect worktrack-backend | grep -A 10 Health
```

### ❌ SSL no funciona / "Connection not secure"
```bash
# Ver logs de acme-companion
docker logs nginx-proxy-acme --tail=100 | grep worktrack

# Verificar que el dominio apunte al VPS
nslookup worktrack.tenryuag.com

# Forzar renovación de certificado
docker restart nginx-proxy-acme

# Esperar 2-3 minutos y recargar la página
```

### ❌ Base de datos no inicia
```bash
# Ver logs
docker-compose logs db

# Verificar volumen
docker volume ls | grep postgres

# Si necesitas empezar de cero (⚠️ BORRA DATOS!)
docker-compose down -v
docker-compose up -d
```

### ❌ GitHub Actions falla en despliegue
```bash
# Verificar que puedes conectarte por SSH
ssh -i ~/.ssh/id_rsa root@[IP-VPS]

# Verificar secrets en GitHub
# Settings → Secrets → Actions

# Ver logs detallados en GitHub Actions
```

---

## 🔐 Checklist de Seguridad

Antes de considerar el deployment completo, verifica:

- [ ] Cambiaste `DB_PASSWORD` del valor por defecto
- [ ] Generaste un `JWT_SECRET` único y largo (64+ caracteres)
- [ ] El archivo `.env` está en `.gitignore` (no se sube a GitHub)
- [ ] Solo los puertos 80, 443 y SSH están abiertos en el firewall
- [ ] SSL/HTTPS funciona correctamente (candado verde en el navegador)
- [ ] Probaste el CI/CD y funciona
- [ ] Tienes un backup reciente de la base de datos

### Configurar firewall (UFW)
```bash
# Si no está configurado
sudo ufw enable
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw status
```

---

## 📊 Monitoreo

### Ver métricas en tiempo real
```bash
# CPU, memoria, red por contenedor
docker stats

# Espacio en disco
df -h
docker system df
```

### Logs de acceso
```bash
# Ver quién accede a tu aplicación
docker logs nginx-proxy --tail=100 -f | grep worktrack
```

### Configurar alertas (opcional)
Considera instalar Portainer para una interfaz web:
```bash
docker volume create portainer_data

docker run -d -p 9000:9000 -p 9443:9443 \
  --name=portainer --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```

Accede a: `https://[IP-VPS]:9443`

---

## 🎉 ¡Listo!

Tu aplicación WorkTrack ahora está:
- ✅ Desplegada en `https://worktrack.tenryuag.com`
- ✅ Con SSL/HTTPS automático
- ✅ Con CI/CD automático desde GitHub
- ✅ Con base de datos PostgreSQL persistente
- ✅ Con auto-restart si algo falla
- ✅ Lista para usar en producción

### Próximos pasos sugeridos:
1. Crear un usuario administrador real (no usar los de prueba)
2. Configurar backups automáticos de la BD
3. Monitorear logs regularmente
4. Mantener Docker actualizado: `docker system prune -a` mensualmente

---

**¿Problemas?** Revisa la sección de Troubleshooting o verifica los logs:
```bash
docker-compose logs -f
```

¡Feliz despliegue! 🚀
