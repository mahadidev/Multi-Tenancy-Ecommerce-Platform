#!/bin/bash

# Cholo Gori System Monitoring Script
# Optimized for 8GB RAM, 2 vCPU server monitoring

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

print_good() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${INFO:-} $1"
}

# System Resource Monitoring
print_header "System Health Check"

echo -e "\n${BLUE}📊 System Resources${NC}"
echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')"
echo "Memory Usage: $(free -m | awk 'NR==2{printf "%.2f%%", $3*100/$2}')"
echo "Memory Used: $(free -m | awk 'NR==2{printf "%sMB/%sMB", $3,$2}')"
echo "Disk Usage: $(df -h / | awk 'NR==2{print $5}')"
echo "Disk Free: $(df -h / | awk 'NR==2{print $4}')"
echo "Load Average: $(uptime | awk -F'load average:' '{print $2}')"

echo -e "\n${BLUE}🐳 Docker Container Status${NC}"
if command -v docker-compose &> /dev/null; then
    if [ -f docker-compose.yml ]; then
        docker-compose ps
        echo ""
        echo "Resource Usage:"
        docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
    else
        print_warning "docker-compose.yml not found in current directory"
    fi
else
    print_error "Docker Compose is not installed"
fi

# Application Health Check
echo -e "\n${BLUE}🌐 Application Health${NC}"
APP_URL="http://localhost"
HEALTH_URL="$APP_URL/health"

if command -v curl &> /dev/null; then
    if curl -f -s "$HEALTH_URL" > /dev/null; then
        print_good "Application is responding"
        
        # Get detailed health status
        HEALTH_RESPONSE=$(curl -s "$HEALTH_URL" 2>/dev/null)
        
        if echo "$HEALTH_RESPONSE" | grep -q '"status":"ok"'; then
            print_good "All services are healthy"
            
            # Extract service information
            DB_STATUS=$(echo "$HEALTH_RESPONSE" | grep -o '"database":"[^"]*"' | cut -d'"' -f4)
            REDIS_STATUS=$(echo "$HEALTH_RESPONSE" | grep -o '"redis":"[^"]*"' | cut -d'"' -f4)
            QUEUE_SIZE=$(echo "$HEALTH_RESPONSE" | grep -o '"queue_size":[^,}]*' | cut -d':' -f2)
            MEMORY_USAGE=$(echo "$HEALTH_RESPONSE" | grep -o '"memory_usage":"[^"]*"' | cut -d'"' -f4)
            
            echo "  Database: $DB_STATUS"
            echo "  Redis: $REDIS_STATUS"
            echo "  Queue Jobs: $QUEUE_SIZE"
            echo "  Memory Usage: $MEMORY_USAGE"
        else
            print_error "Some services are unhealthy"
            echo "$HEALTH_RESPONSE" | jq . 2>/dev/null || echo "$HEALTH_RESPONSE"
        fi
    else
        print_error "Application is not responding on $HEALTH_URL"
    fi
else
    print_warning "curl is not installed - cannot check application health"
fi

# Database Health Check
echo -e "\n${BLUE}🗄️ Database Health${NC}"
if command -v docker-compose &> /dev/null && [ -f docker-compose.yml ]; then
    if docker-compose ps postgres | grep -q "Up"; then
        print_good "PostgreSQL container is running"
        
        # Check database connections
        DB_CONNECTIONS=$(docker-compose exec -T postgres psql -U cholo_user -d cholo_gori -t -c "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null | tr -d ' ')
        if [ -n "$DB_CONNECTIONS" ]; then
            echo "  Active Connections: $DB_CONNECTIONS"
        fi
        
        # Check database size
        DB_SIZE=$(docker-compose exec -T postgres psql -U cholo_user -d cholo_gori -t -c "SELECT pg_size_pretty(pg_database_size('cholo_gori'));" 2>/dev/null | tr -d ' ')
        if [ -n "$DB_SIZE" ]; then
            echo "  Database Size: $DB_SIZE"
        fi
        
        # Check slow queries
        SLOW_QUERIES=$(docker-compose exec -T postgres psql -U cholo_user -d cholo_gori -t -c "SELECT count(*) FROM pg_stat_statements WHERE mean_exec_time > 1000;" 2>/dev/null | tr -d ' ')
        if [ -n "$SLOW_QUERIES" ]; then
            if [ "$SLOW_QUERIES" -gt 0 ]; then
                print_warning "Slow queries detected: $SLOW_QUERIES"
            else
                print_good "No slow queries detected"
            fi
        fi
    else
        print_error "PostgreSQL container is not running"
    fi
fi

# Redis Health Check
echo -e "\n${BLUE}🔴 Redis Health${NC}"
if command -v docker-compose &> /dev/null && [ -f docker-compose.yml ]; then
    if docker-compose ps redis | grep -q "Up"; then
        print_good "Redis container is running"
        
        # Check Redis memory usage
        REDIS_INFO=$(docker-compose exec -T redis redis-cli info memory 2>/dev/null)
        if [ -n "$REDIS_INFO" ]; then
            REDIS_MEMORY=$(echo "$REDIS_INFO" | grep used_memory_human | cut -d: -f2 | tr -d '\r')
            REDIS_MAX_MEMORY=$(echo "$REDIS_INFO" | grep maxmemory_human | cut -d: -f2 | tr -d '\r')
            echo "  Memory Used: $REDIS_MEMORY"
            if [ -n "$REDIS_MAX_MEMORY" ] && [ "$REDIS_MAX_MEMORY" != "0" ]; then
                echo "  Max Memory: $REDIS_MAX_MEMORY"
            fi
        fi
        
        # Check Redis connections
        REDIS_CLIENTS=$(docker-compose exec -T redis redis-cli info clients 2>/dev/null | grep connected_clients | cut -d: -f2 | tr -d '\r')
        if [ -n "$REDIS_CLIENTS" ]; then
            echo "  Connected Clients: $REDIS_CLIENTS"
        fi
        
        # Check hit rate
        REDIS_STATS=$(docker-compose exec -T redis redis-cli info stats 2>/dev/null)
        if [ -n "$REDIS_STATS" ]; then
            HITS=$(echo "$REDIS_STATS" | grep keyspace_hits | cut -d: -f2 | tr -d '\r')
            MISSES=$(echo "$REDIS_STATS" | grep keyspace_misses | cut -d: -f2 | tr -d '\r')
            if [ -n "$HITS" ] && [ -n "$MISSES" ] && [ "$HITS" != "0" ]; then
                HIT_RATE=$(echo "scale=2; $HITS / ($HITS + $MISSES) * 100" | bc -l 2>/dev/null || echo "0")
                echo "  Cache Hit Rate: ${HIT_RATE}%"
            fi
        fi
    else
        print_error "Redis container is not running"
    fi
fi

# Queue Health Check
echo -e "\n${BLUE}⚡ Queue Health${NC}"
if command -v docker-compose &> /dev/null && [ -f docker-compose.yml ]; then
    if docker-compose ps queue-worker | grep -q "Up"; then
        print_good "Queue Worker container is running"
        
        # Check queue size
        QUEUE_SIZE=$(docker-compose exec -T php-app php artisan queue:size 2>/dev/null || echo "unknown")
        echo "  Pending Jobs: $QUEUE_SIZE"
        
        # Check failed jobs
        FAILED_JOBS=$(docker-compose exec -T php-app php artisan queue:failed:count 2>/dev/null || echo "unknown")
        echo "  Failed Jobs: $FAILED_JOBS"
        
        # Check Horizon status if available
        if docker-compose exec -T php-app php artisan horizon:status &>/dev/null; then
            print_good "Horizon is running"
        fi
    else
        print_error "Queue Worker container is not running"
    fi
fi

# WebSocket Health Check
echo -e "\n${BLUE}🔌 WebSocket Health${NC}"
if command -v docker-compose &> /dev/null && [ -f docker-compose.yml ]; then
    if docker-compose ps websocket-server | grep -q "Up"; then
        print_good "WebSocket server container is running"
        
        if command -v curl &> /dev/null; then
            if curl -f -s http://localhost:6001/health > /dev/null; then
                WS_RESPONSE=$(curl -s http://localhost:6001/health 2>/dev/null)
                if echo "$WS_RESPONSE" | grep -q '"status":"ok"'; then
                    CONNECTIONS=$(echo "$WS_RESPONSE" | grep -o '"connections":[^,}]*' | cut -d':' -f2)
                    print_good "WebSocket server is healthy"
                    echo "  Active Connections: $CONNECTIONS"
                else
                    print_warning "WebSocket server responding but not healthy"
                fi
            else
                print_warning "WebSocket server not responding on port 6001"
            fi
        fi
    else
        print_error "WebSocket server container is not running"
    fi
fi

# Performance Recommendations
echo -e "\n${BLUE}💡 Performance Recommendations${NC}"

CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
MEMORY_USAGE=$(free -m | awk 'NR==2{printf "%.0f", $3*100/$2}')

if (( $(echo "$CPU_USAGE > 80" | bc -l) )); then
    print_warning "High CPU usage (${CPU_USAGE}%). Consider scaling PHP-FPM workers."
fi

if (( $(echo "$MEMORY_USAGE > 80" | bc -l) )); then
    print_warning "High memory usage (${MEMORY_USAGE}%). Consider optimizing PostgreSQL memory settings."
fi

DISK_USAGE=$(df -h / | awk 'NR==2{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 80 ]; then
    print_warning "High disk usage (${DISK_USAGE}%). Consider cleaning up logs and temporary files."
fi

# Log Monitoring
echo -e "\n${BLUE}📋 Recent Errors (last 10 minutes)${NC}"
if command -v docker-compose &> /dev/null && [ -f docker-compose.yml ]; then
    echo "PHP Logs:"
    docker-compose logs --since=10m --tail=50 php-app 2>/dev/null | grep -i error | head -5 || echo "  No errors found"
    
    echo "Nginx Logs:"
    docker-compose logs --since=10m --tail=50 nginx 2>/dev/null | grep -i error | head -5 || echo "  No errors found"
    
    echo "PostgreSQL Logs:"
    docker-compose logs --since=10m --tail=50 postgres 2>/dev/null | grep -i error | head -5 || echo "  No errors found"
fi

echo -e "\n${GREEN}Monitoring completed at $(date)${NC}"