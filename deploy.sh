#!/bin/bash

# Cholo Gori Docker Deployment Script
# Optimized for 8GB RAM, 2 vCPU server

set -e

echo "🚀 Starting Cholo Gori Docker Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root!"
   exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p docker/{nginx,postgres,redis,php,websocket,nginx/sites}
mkdir -p storage/app/public
mkdir -p docker/nginx/ssl

# Check if .env file exists
if [ ! -f .env ]; then
    print_status "Creating .env file from template..."
    cp .env.example .env
    
    print_warning "Please edit .env file with your configuration before continuing!"
    echo "Press Enter to continue or Ctrl+C to exit..."
    read
fi

# Create docker-compose.override.yml for development if not exists
if [ ! -f docker-compose.override.yml ]; then
    print_status "Creating docker-compose.override.yml for development..."
    cat > docker-compose.override.yml << EOF
version: '3.8'
services:
  php-app:
    volumes:
      - .:/var/www/html
    environment:
      - APP_ENV=local
      - APP_DEBUG=true
    
  nginx:
    volumes:
      - ./docker/nginx/sites:/etc/nginx/sites-available
EOF
fi

# Build containers
print_status "Building Docker containers..."
docker-compose build --no-cache

# Check if containers are running and stop them
if docker-compose ps | grep -q "Up"; then
    print_status "Stopping existing containers..."
    docker-compose down
fi

# Start database first
print_status "Starting PostgreSQL database..."
docker-compose up -d postgres

# Wait for database to be ready
print_status "Waiting for database to be ready..."
sleep 10

# Run database migrations
print_status "Running database migrations..."
docker-compose run --rm php-app php artisan migrate --force

# Seed database if needed
if [ "$1" == "--seed" ]; then
    print_status "Seeding database..."
    docker-compose run --rm php-app php artisan db:seed --force
fi

# Start all services
print_status "Starting all services..."
docker-compose up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 20

# Optimize Laravel
print_status "Optimizing Laravel application..."
docker-compose exec php-app php artisan config:cache
docker-compose exec php-app php artisan route:cache
docker-compose exec php-app php artisan view:cache
docker-compose exec php-app php artisan event:cache

# Install WebSocket dependencies
print_status "Installing WebSocket dependencies..."
docker-compose exec websocket-server npm install

# Create storage link
print_status "Creating storage link..."
docker-compose exec php-app php artisan storage:link

# Set proper permissions
print_status "Setting proper permissions..."
docker-compose exec php-app chown -R www-data:www-data storage bootstrap/cache
docker-compose exec php-app chmod -R 755 storage bootstrap/cache

# Check service health
print_status "Checking service health..."

# Check PHP-FPM
if docker-compose exec php-app php-fpm -t > /dev/null 2>&1; then
    print_status "✓ PHP-FPM is healthy"
else
    print_error "✗ PHP-FPM configuration error"
fi

# Check PostgreSQL
if docker-compose exec postgres pg_isready -U cholo_user > /dev/null 2>&1; then
    print_status "✓ PostgreSQL is healthy"
else
    print_error "✗ PostgreSQL is not ready"
fi

# Check Redis
if docker-compose exec redis redis-cli ping > /dev/null 2>&1; then
    print_status "✓ Redis is healthy"
else
    print_error "✗ Redis is not ready"
fi

# Check WebSocket server
if curl -f http://localhost:6001/health > /dev/null 2>&1; then
    print_status "✓ WebSocket server is healthy"
else
    print_warning "WebSocket server might still be starting..."
fi

# Display service status
print_status "Service Status:"
docker-compose ps

# Display resource usage
print_status "Resource Usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"

# Display URLs
print_status "Your application is now running!"
echo "🌐 HTTP: http://localhost"
echo "🔒 HTTPS: https://yourdomain.com (if SSL configured)"
echo "🔌 WebSocket: ws://localhost:6001"
echo "📊 Health Check: http://localhost/health"

# Display useful commands
echo ""
echo "📋 Useful Commands:"
echo "View logs: docker-compose logs -f [service-name]"
echo "Stop services: docker-compose down"
echo "Restart services: docker-compose restart"
echo "Run artisan: docker-compose exec php-app php artisan [command]"
echo "Access database: docker-compose exec postgres psql -U cholo_user -d cholo_gori"
echo "Access Redis: docker-compose exec redis redis-cli"

# Display monitoring information
echo ""
echo "📊 Monitoring:"
echo "Real-time stats: docker stats"
echo "Container logs: docker-compose logs -f"
echo "Database logs: docker-compose logs postgres"
echo "Queue status: docker-compose exec php-app php artisan horizon"

print_status "Deployment completed successfully! 🎉"

# Check for SSL setup
if [ ! -f docker/nginx/ssl/fullchain.pem ]; then
    print_warning "SSL certificates not found. Please set up SSL for production:"
    echo "1. Install certbot: sudo apt install certbot"
    echo "2. Generate certificate: sudo certbot certonly --standalone -d yourdomain.com"
    echo "3. Copy certificates to docker/nginx/ssl/"
    echo "4. Update nginx configuration with your domain"
fi

# Display performance tips
echo ""
echo "🚀 Performance Tips:"
echo "1. Monitor memory usage: docker stats"
echo "2. Check queue processing: docker-compose exec php-app php artisan horizon:status"
echo "3. Monitor slow queries: Check PostgreSQL logs"
echo "4. Regular maintenance: Run php artisan schedule:run"
echo "5. Backup database: docker-compose exec postgres pg_dump -U cholo_user cholo_gori > backup.sql"