#!/bin/bash

# Cholo Gori Production Deployment
set -e

echo "🚀 Deploying Cholo Gori to Production..."

# Remove any development overrides
rm -f docker-compose.override.yml

# Setup production environment
cp .env.docker .env
echo "⚠️  Please edit .env with your production settings!"
echo "   - Set your domain URL"
echo "   - Set database password" 
echo "   - Set JWT_SECRET"
echo ""
read -p "Press Enter when .env is configured..."

# Update nginx for production
sed -i '' 's/cholo.localhost/yourdomain.com/g' docker/nginx/sites/default.conf

# Build and deploy
docker-compose build --no-cache
docker-compose up -d

# Wait and run migrations
sleep 15
docker-compose exec php-app php artisan migrate --force
docker-compose exec php-app php artisan config:cache
docker-compose exec php-app php artisan route:cache
docker-compose exec php-app php artisan view:cache

echo "✅ Production deployment complete!"
echo "🌐 Configure SSL: See DOCKER_SETUP_COMPLETE.md"
echo "📊 Monitor: ./monitor.sh"