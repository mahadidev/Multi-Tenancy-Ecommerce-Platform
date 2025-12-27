# 🚀 Quick Start Guide

## Prerequisites
- Docker and Docker Compose installed
- Server with 8GB RAM, 2 vCPU, 100GB SSD, 8TB bandwidth
- Domain name (for production)

## ⚡ Quick Deployment

### 1. Environment Setup
```bash
# Clone your repository
git clone your-repo-url
cd cholo-gori

# Make deployment script executable
chmod +x deploy.sh

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

### 2. Run Deployment
```bash
# Deploy with seeding (for fresh setup)
./deploy.sh --seed

# Or deploy without seeding
./deploy.sh
```

### 3. Verify Deployment
```bash
# Check service status
docker-compose ps

# Check health
curl http://localhost/health

# View logs
docker-compose logs -f
```

## 🔧 SSL Setup (Production)

### 1. Install Certbot
```bash
sudo apt update
sudo apt install certbot
```

### 2. Generate SSL Certificate
```bash
sudo certbot certonly --standalone -d yourdomain.com
```

### 3. Copy Certificates
```bash
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem docker/nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem docker/nginx/ssl/
sudo chown $USER:$USER docker/nginx/ssl/*
```

### 4. Update Nginx Configuration
```bash
# Edit docker/nginx/sites/default.conf
# Replace yourdomain.com with your actual domain
```

### 5. Restart Services
```bash
docker-compose restart nginx
```

## 📊 Monitoring

### System Resources
```bash
# Real-time resource usage
docker stats

# Container status
docker-compose ps

# Memory usage
free -h

# CPU usage
top
```

### Application Health
```bash
# Laravel health
curl http://localhost/health

# Queue status
docker-compose exec php-app php artisan horizon:status

# Database connections
docker-compose exec php-app php artisan db:show
```

## 🔍 Troubleshooting

### Common Issues

#### Container won't start
```bash
# Check logs
docker-compose logs [service-name]

# Check configuration
docker-compose config

# Restart services
docker-compose down && docker-compose up -d
```

#### Database connection issues
```bash
# Check database status
docker-compose exec postgres pg_isready

# Access database
docker-compose exec postgres psql -U [username] -d [database]

# Check database logs
docker-compose logs postgres
```

#### Queue not processing
```bash
# Restart queue worker
docker-compose restart queue-worker

# Check Horizon status
docker-compose exec php-app php artisan horizon:status

# Clear stuck jobs
docker-compose exec php-app php artisan queue:clear
```

#### WebSocket not working
```bash
# Check WebSocket server
curl http://localhost:6001/health

# Restart WebSocket server
docker-compose restart websocket-server

# Check WebSocket logs
docker-compose logs websocket-server
```

### Performance Issues

#### High memory usage
```bash
# Check memory usage by container
docker stats --no-stream

# Optimize PHP-FPM
# Edit docker/php/php-fpm.conf
# Reduce pm.max_children

# Optimize PostgreSQL
# Edit docker/postgres/postgresql.conf
# Reduce shared_buffers
```

#### Slow queries
```bash
# Enable slow query logging
# Edit docker/postgres/postgresql.conf
# Set log_min_duration_statement = 1000

# Check running queries
docker-compose exec postgres psql -U [username] -d [database] -c "SELECT * FROM pg_stat_activity;"

# Analyze query performance
docker-compose exec postgres psql -U [username] -d [database] -c "EXPLAIN ANALYZE [your_query];"
```

## 📈 Performance Optimization

### Database Optimization
```bash
# Run VACUUM ANALYZE
docker-compose exec postgres psql -U [username] -d [database] -c "VACUUM ANALYZE;"

# Rebuild indexes
docker-compose exec postgres psql -U [username] -d [database] -c "REINDEX DATABASE cholo_gori;"

# Check database size
docker-compose exec postgres psql -U [username] -d [database] -c "SELECT pg_size_pretty(pg_database_size('cholo_gori'));"
```

### Cache Optimization
```bash
# Clear Laravel cache
docker-compose exec php-app php artisan cache:clear

# Clear Redis cache
docker-compose exec redis redis-cli FLUSHDB

# Warm up cache
docker-compose exec php-app php artisan config:cache
docker-compose exec php-app php artisan route:cache
```

### Application Optimization
```bash
# Optimize autoloader
docker-compose exec php-app composer dump-autoload --optimize

# Precompile views
docker-compose exec php-app php artisan view:cache

# Clear compiled files
docker-compose exec php-app php artisan clear-compiled
```

## 🔒 Security Checklist

### 1. Update Passwords
- Change database passwords in .env
- Set Redis password in redis.conf
- Update JWT_SECRET in .env

### 2. SSL Configuration
- Install valid SSL certificate
- Enable HSTS headers
- Configure secure cookies

### 3. Firewall Setup
```bash
# Allow only necessary ports
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 4. Regular Updates
```bash
# Update Docker images
docker-compose pull
docker-compose up -d

# Update system packages
sudo apt update && sudo apt upgrade
```

## 📞 Support

If you encounter issues:

1. Check the logs: `docker-compose logs [service-name]`
2. Review the optimization guide: `DOCKER_SCALING_OPTIMIZATION.md`
3. Check system resources: `docker stats`
4. Verify configuration files

## 🎯 Next Steps

After deployment:

1. Configure your domain name
2. Set up SSL certificate
3. Configure monitoring
4. Set up backups
5. Configure email services
6. Set up payment gateways
7. Add stores and products
8. Test real-time features

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Docker Documentation](https://docs.docker.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [Nginx Documentation](https://nginx.org/en/docs/)