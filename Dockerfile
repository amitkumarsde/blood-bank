# PHP + Apache image (Apache respects your .htaccess routing)
FROM php:8.2-apache

# MySQL driver for PDO
RUN docker-php-ext-install pdo_mysql

# Enable mod_rewrite so .htaccess "send everything to index.php" works
RUN a2enmod rewrite

# Let .htaccess files take effect
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

# Copy the backend code into Apache's web root
COPY backend/ /var/www/html/

# Render provides the listening port via the PORT env var — make Apache use it
RUN sed -i 's/Listen 80/Listen ${PORT}/' /etc/apache2/ports.conf \
 && sed -i 's/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/' /etc/apache2/sites-available/000-default.conf

ENV PORT=10000
EXPOSE 10000

CMD ["apache2-foreground"]
