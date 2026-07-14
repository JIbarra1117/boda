#!/bin/bash

# Script de despliegue para producción
echo "=============================================="
echo "🚀 Iniciando despliegue en producción..."
echo "=============================================="

# 1. Obtener los últimos cambios de Git
echo "[1/4] Descargando últimos cambios del repositorio..."
git pull origin main

# 2. Reconstruir las imágenes para tomar en cuenta los cambios nuevos y levantar contenedores
echo "[2/4] Reconstruyendo y levantando los contenedores..."
docker compose up -d --build

# 3. Mostrar el estado de los contenedores
echo "[3/4] Estado actual de los contenedores:"
docker compose ps

# 4. Limpiar imágenes colgadas ("dangling") que ya no se usan tras construir las nuevas
echo "[4/4] Limpiando imágenes antiguas para liberar espacio..."
docker image prune -f

echo "=============================================="
echo "✅ ¡Despliegue finalizado exitosamente!"
echo "=============================================="
