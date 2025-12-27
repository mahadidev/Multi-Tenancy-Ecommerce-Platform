# Multi-stage Dockerfile for PHP Laravel Application

# Base stage
FROM php:8.2-fpm-alpine as base

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    jpeg-dev \
    libwebp-dev \
    freetype-dev \
    postgresql-dev \
    supervisor \
    nginx

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install PostgreSQL extension
RUN docker-php-ext-install pdo_pgsql

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Development stage
FROM base as development

# Install development dependencies
RUN composer install --no-interaction --prefer-source

# Copy application code
COPY . .

# Set permissions
RUN chown -R www-data:www-data /var/www/html

# Production stage
FROM base as production

# Install production dependencies
COPY composer.json composer.lock ./

# Install and optimize autoloader
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Copy application code
COPY . .

# Create necessary directories and set permissions
RUN mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache && \
    chown -R www-data:www-data /var/www/html && \
    chmod -R 755 storage bootstrap/cache

# Clear and cache Laravel configurations
RUN php artisan config:clear && \
    php artisan route:clear && \
    php artisan view:clear && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

# Expose port
EXPOSE 9000

# Set default command
CMD ["php-fpm"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD php-fpm -t || exit 1