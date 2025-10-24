# WorkTrack - Docker Quick Reference

## 🚀 Quick Start

### Development (Local)
```bash
# Using H2 in-memory database
docker-compose -f docker-compose.dev.yml up

# Access:
# - Frontend: http://localhost:5173
# - Backend: http://localhost:8080
# - API Docs: http://localhost:8080/actuator/health
```

### Production (VPS)
```bash
# First time setup
cp .env.example .env
nano .env  # Configure your environment variables

# Deploy
./deploy.sh

# Or manually:
docker-compose up -d --build
```

## 📁 Files Structure

```
work_track/
├── backend/
│   ├── Dockerfile              # Backend container
│   └── .dockerignore
├── frontend/
│   ├── Dockerfile              # Frontend container
│   ├── nginx.conf              # Nginx config for SPA
│   └── .dockerignore
├── docker-compose.yml          # Production orchestration
├── docker-compose.dev.yml      # Development orchestration
├── deploy.sh                   # Deployment script
├── .env.example                # Environment template
└── DEPLOYMENT.md               # Full deployment guide
```

## 🔧 Common Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild
docker-compose up -d --build

# Execute in container
docker exec -it worktrack-backend sh
docker exec -it worktrack-db psql -U worktrack -d worktrackdb

# Database backup
docker exec worktrack-db pg_dump -U worktrack worktrackdb > backup.sql

# Clean up
docker system prune -af
```

## 🌍 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_NAME` | Database name | `worktrackdb` |
| `DB_USERNAME` | Database user | `worktrack` |
| `DB_PASSWORD` | Database password | `secure_password` |
| `JWT_SECRET` | JWT secret key | `long_random_string` |
| `VIRTUAL_HOST` | Your subdomain | `worktrack.domain.com` |
| `LETSENCRYPT_EMAIL` | Email for SSL | `admin@domain.com` |

## 📚 Full Documentation

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

## 🔐 Security Checklist

- [ ] Changed `DB_PASSWORD` from default
- [ ] Generated unique `JWT_SECRET` (64+ chars)
- [ ] Configured correct `VIRTUAL_HOST`
- [ ] Set valid `LETSENCRYPT_EMAIL`
- [ ] Firewall configured (ports 80, 443, 22)
- [ ] `.env` file NOT committed to git

## 🆘 Troubleshooting

**Containers won't start:**
```bash
docker-compose logs
docker-compose ps
```

**Database connection error:**
```bash
docker-compose logs db
docker-compose exec db psql -U worktrack -d worktrackdb
```

**SSL not working:**
```bash
docker logs nginx-proxy-letsencrypt
curl -I http://your-domain.com
```

For more help, see [DEPLOYMENT.md](./DEPLOYMENT.md#-troubleshooting)
