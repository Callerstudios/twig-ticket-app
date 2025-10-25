# Use Apache with PHP 8.2
FROM php:8.2-apache

# Install required packages
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev && \
    docker-php-ext-install pdo pdo_mysql

# Enable Apache mod_rewrite for clean URLs
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy composer files and install dependencies
COPY composer.json composer.lock ./
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer && \
    composer install --no-dev --optimize-autoloader && \
    rm composer-setup.php

# Copy the rest of the app into the image
COPY . .

# Set correct file permissions
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html

# Configure Apache to serve from the 'public' directory
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html/public\n\
    <Directory /var/www/html/public>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Expose port 80
EXPOSE 80

# Start Apache in the foreground
CMD ["apache2-foreground"]
