# Use a PHP image with Composer
FROM php:8.2-apache

# Install dependencies for Composer and PHP extensions
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev zip && \
    docker-php-ext-install pdo pdo_mysql

# Enable Apache rewrite (if you use routes)
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy composer files first
COPY composer.json composer.lock ./

# Install dependencies (important!)
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer && \
    composer install --no-dev --optimize-autoloader && \
    rm composer-setup.php

# Copy the rest of the app
COPY . .

# Expose port 80
EXPOSE 80
