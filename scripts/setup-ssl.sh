#!/bin/bash
set -e

DOMAIN="karenyjorge.jorgeibarra.dev"
EMAIL="jorgeluisibarralucas@gmail.com"

PROJECT_DIR="/opt/boda"

echo "Instalando Certbot..."

if command -v apt &> /dev/null; then
  sudo apt update
  sudo apt install -y certbot
elif command -v dnf &> /dev/null; then
  sudo dnf install -y epel-release
  sudo dnf install -y certbot
elif command -v yum &> /dev/null; then
  sudo yum install -y epel-release
  sudo yum install -y certbot
else
  echo "No se encontró un gestor de paquetes compatible (apt, dnf o yum)"
  exit 1
fi

echo "Obteniendo certificado SSL para $DOMAIN..."
sudo certbot certonly --webroot -w /var/www/certbot -d "$DOMAIN" --agree-tos --no-eff-email -m "$EMAIL"

echo "Copiando configuración SSL de Nginx..."
cp "$PROJECT_DIR/nginx/nginx.ssl.conf" "$PROJECT_DIR/nginx/nginx.conf"

echo "Recargando Nginx..."
docker compose -f "$PROJECT_DIR/docker-compose.prod.yml" exec nginx nginx -s reload

echo "Certificado SSL configurado correctamente."
echo "Configurando renovación automática..."

# Agregar cronjob para renovación automática si no existe
CRON_JOB="0 3 * * * certbot renew --quiet && docker compose -f $PROJECT_DIR/docker-compose.prod.yml exec nginx nginx -s reload"
(crontab -l 2>/dev/null | grep -F "$CRON_JOB") || (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "Listo. Tu sitio debería estar disponible en https://$DOMAIN"
