#!/bin/bash
set -e

DOMAIN="karenyjorge.jorgeibarra.dev"
EMAIL="jorgeluisibarralucas@gmail.com"

echo "Instalando Certbot..."
sudo apt update
sudo apt install -y certbot

echo "Obteniendo certificado SSL para $DOMAIN..."
sudo certbot certonly --standalone -d "$DOMAIN" --agree-tos --no-eff-email -m "$EMAIL"

echo "Copiando configuración SSL de Nginx..."
cp nginx/nginx.ssl.conf nginx/nginx.conf

echo "Recargando Nginx..."
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload

echo "Certificado SSL configurado correctamente."
echo "Configurando renovación automática..."

# Agregar cronjob para renovación automática si no existe
CRON_JOB="0 3 * * * certbot renew --quiet && docker compose -f /root/boda/docker-compose.prod.yml exec nginx nginx -s reload"
(crontab -l 2>/dev/null | grep -F "$CRON_JOB") || (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "Listo. Tu sitio debería estar disponible en https://$DOMAIN"
