@echo off
chcp 65001 > nul

echo ==============================================
echo 🚀 Iniciando despliegue en producción...
echo ==============================================

echo [1/4] Descargando últimos cambios del repositorio...
git pull origin main

echo.
echo [2/4] Reconstruyendo y levantando los contenedores...
docker compose -f docker-compose.prod.yml up -d --build

echo.
echo [3/4] Estado actual de los contenedores:
docker compose -f docker-compose.prod.yml ps

echo.
echo [4/4] Limpiando imágenes antiguas para liberar espacio...
docker image prune -f

echo.
echo ==============================================
echo ✅ ¡Despliegue finalizado exitosamente!
echo ==============================================
pause
