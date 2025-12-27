#!/bin/bash

# Cholo Gori Local Development Runner
set -e

echo "🚀 Starting Cholo Gori Local Development..."

# Create development override (remove obsolete version)
cat > docker-compose.override.yml << 'OVERRIDE'
services:
  nginx:
    ports:
      - "80:80"
  php-app:
    environment:
      - APP_ENV=local
      - APP_DEBUG=true
      - APP_URL=http://cholo.localhost
    volumes:
      - .:/var/www/html
  postgres:
    environment:
      - POSTGRES_PASSWORD=local_password
OVERRIDE

# Setup or update local environment
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.docker..."
    cp .env.docker .env.local 2>/dev/null || cp .env.example .env.local 2>/dev/null || {
        echo "❌ No .env.docker or .env.example found. Creating basic .env.local..."
        cat > .env.local << 'ENVLOCAL'
APP_NAME='Cholo Gori'
APP_ENV=local
APP_DEBUG=true
APP_URL=http://cholo.localhost
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=cholo_gori
DB_USERNAME=cholo_user
DB_PASSWORD=local_password
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
REDIS_HOST=redis
REDIS_PORT=6379
WEBSOCKET_PORT=6001
JWT_SECRET=dev_jwt_secret_key_change_this_in_production_minimum_32_chars
ENVLOCAL
    }
fi

# Update environment variables for local development
echo "🔧 Updating environment variables..."
sed -i '' 's|https://[^[:space:]]*|http://cholo.localhost|g' .env.local
sed -i '' 's/APP_ENV=production/APP_ENV=local/g' .env.local
sed -i '' 's/APP_DEBUG=false/APP_DEBUG=true/g' .env.local
sed -i '' 's/DB_PASSWORD=.*/DB_PASSWORD=local_password/g' .env.local
sed -i '' 's|APP_URL=http://localhost[^[:space:]]*|APP_URL=http://cholo.localhost|g' .env.local

# Ensure essential variables exist
grep -q "^JWT_SECRET=" .env.local || echo "JWT_SECRET=dev_jwt_secret_key_change_this_in_production_minimum_32_chars" >> .env.local
grep -q "^WEBSOCKET_PORT=" .env.local || echo "WEBSOCKET_PORT=6001" >> .env.local

# Add WebSocket allowed origins
grep -q "^ALLOWED_ORIGINS=" .env.local || echo "ALLOWED_ORIGINS=http://cholo.localhost,http://localhost:3000,http://localhost:8000" >> .env.local

# Update nginx for custom domain if needed
if [ -f docker/nginx/sites/default.conf ]; then
    sed -i '' 's/yourdomain\.com/cholo.localhost/g' docker/nginx/sites/default.conf 2>/dev/null || true
fi

# Create WebSocket server directory if it doesn't exist
if [ ! -d docker/websocket ]; then
    echo "📁 Creating WebSocket server directory..."
    mkdir -p docker/websocket/src
fi

# Build and start
echo "🐳 Building and starting Docker containers..."
export COMPOSE_DOCKER_CLI_BUILD=1
export DOCKER_BUILDKIT=1

# Build with better error handling
if ! docker-compose -f docker-compose.yml -f docker-compose.override.yml build --no-cache; then
    echo "❌ Build failed. Check the error messages above."
    exit 1
fi

# Start containers
if ! docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d; then
    echo "❌ Failed to start containers."
    exit 1
fi

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Run database migrations
echo "🗄️ Running database migrations..."
if ! docker-compose -f docker-compose.yml -f docker-compose.override.yml exec -T php-app php artisan migrate --force; then
    echo "⚠️ Migration failed, but continuing..."
fi

# Check if all services are running
echo "🔍 Checking service health..."
for service in nginx php-app postgres redis websocket-server; do
    if docker-compose -f docker-compose.yml -f docker-compose.override.yml ps | grep -q "$service.*Up"; then
        echo "✅ $service is running"
    else
        echo "❌ $service is not running"
    fi
done

echo ""
echo "🎉 Cholo Gori is ready!"
echo "🌐 Frontend: http://cholo.localhost"
echo "🔌 WebSocket: ws://cholo.localhost:6001"
echo "💚 Health Check: http://cholo.localhost:6001/health"
echo ""
echo "📊 Monitor services: ./monitor.sh"
echo "🛑 Stop services: docker-compose -f docker-compose.yml -f docker-compose.override.yml down"
echo "📝 View logs: docker-compose -f docker-compose.yml -f docker-compose.override.yml logs -f"
echo ""
echo "🔧 Useful commands:"
echo "  artisan: docker-compose -f docker-compose.yml -f docker-compose.override.yml exec php-app php artisan"
echo "  npm: docker-compose -f docker-compose.yml -f docker-compose.override.yml exec php-app npm"
echo "  composer: docker-compose -f docker-compose.yml -f docker-compose.override.yml exec php-app composer"