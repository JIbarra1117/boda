# Guía de despliegue — Invitación de boda

Este documento describe cómo levantar el proyecto en local y cómo desplegarlo en producción.

## Stack

- **Frontend:** Vue 3 + Vite + TypeScript
- **Backend:** NestJS + Prisma + PostgreSQL
- **Infraestructura:** Docker + Docker Compose

> Regla importante del proyecto: **no ejecutar builds manuales**. Todo corre dentro de contenedores Docker.

---

## Desarrollo local

### Requisitos

- Docker Desktop o Docker Engine + Docker Compose
- Git
- (Opcional) Node.js y npm solo si querés correr comandos de Prisma fuera del contenedor

### 1. Clonar el repositorio

```bash
git clone git@github.com:JIbarra1117/boda.git
cd boda
```

> Si usás una llave SSH específica, agregala al agente:
> ```bash
> ssh-add ~/.ssh/id_ed25519_boda
> ```

### 2. Levantar los servicios

```bash
docker compose up --build -d
```

Esto levanta tres servicios:

| Servicio | Contenedor | URL local | Descripción |
|----------|------------|-----------|-------------|
| Base de datos | `boda_db` | `localhost:5432` | PostgreSQL 16 |
| Backend | `boda_backend` | `http://localhost:3000` | API NestJS |
| Frontend | `boda_frontend` | `http://localhost:5173` | Aplicación Vite |

El backend corre automáticamente:

```bash
npx prisma db push --accept-data-loss
npx prisma generate
npm run start:dev
```

### 3. Acceder al panel de administración

- URL: `http://localhost:5173/admin-login`
- Contraseña: `boda2026`

### 4. Detener los servicios

```bash
docker compose down
```

Para borrar también la base de datos local:

```bash
docker compose down -v
```

---

## Variables de entorno

El archivo `.env` en la raíz del proyecto contiene las configuraciones. Ejemplo:

```env
ADMIN_PASSWORD=boda2026
DATABASE_URL=postgresql://boda_user:boda_password@db:5432/boda_db?schema=public
```

En producción, al menos debés cambiar:

- `ADMIN_PASSWORD`
- Credenciales de PostgreSQL
- `DATABASE_URL` del backend
- `VITE_API_URL` del frontend para apuntar al dominio real

---

## Preparación para producción

### 1. Servidor

Necesitás un servidor con:

- Docker y Docker Compose instalados
- Un dominio apuntando al servidor (por ejemplo, con Cloudflare)
- Puerto 80/443 disponibles si exponés directamente, o un reverse proxy como Nginx Proxy Manager / Traefik

### 2. Configurar el dominio en el frontend

Editá `docker-compose.yml` (o usá un `.env` si lo referenciás) para que `VITE_API_URL` apunte al dominio real:

```yaml
frontend:
  environment:
    - VITE_API_URL=https://api.tuboda.com
```

> ⚠️ Los códigos QR generados en local apuntan a `localhost`. En producción hay que regenerarlos desde el panel de administración después de cambiar `VITE_API_URL`.

### 3. Cambiar contraseñas y secretos

No uses los valores por defecto en producción. Cambiá al menos:

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `ADMIN_PASSWORD`

### 4. Migrar datos de local a producción

Tenés dos opciones:

#### Opción A — Exportar e importar con `pg_dump` (recomendado si ya tenés invitados locales)

En la máquina local, con el contenedor de base de datos corriendo:

```bash
docker exec boda_db pg_dump -U boda_user -d boda_db > boda_db_backup.sql
```

En el servidor de producción, con la base de datos limpia corriendo:

```bash
# Copiar el backup al servidor
scp boda_db_backup.sql usuario@servidor:/ruta/

# Restaurar dentro del contenedor
docker exec -i boda_db psql -U boda_user -d boda_db < boda_db_backup.sql
```

#### Opción B — Recrear los datos en producción

Si preferís empezar de cero, simplemente levantás el proyecto en producción y usás el panel de administración para cargar los invitados manualmente o mediante el Excel de carga masiva.

### 5. Aplicar cambios del schema de Prisma

Si el schema tiene cambios (por ejemplo, el campo `code` agregado a `Guest`), el backend ya lo aplica automáticamente con:

```bash
npx prisma db push --accept-data-loss
```

Esto está en el `command` del servicio `backend` en `docker-compose.yml`.

> Si preferís correr migraciones formales (`prisma migrate deploy`), modificá el comando del contenedor del backend.

---

## Despliegue en producción

### 1. Subir el código a `main`

```bash
git checkout main
git pull origin main
git merge feature/rediseño-stitch
git push origin main
```

### 2. En el servidor de producción

```bash
git clone git@github.com:JIbarra1117/boda.git
cd boda
# (opcional) configurá variables de entorno y docker-compose.yml
docker compose -f docker-compose.yml up --build -d
```

### 3. Verificar que todo levantó

```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
```

### 4. Regenerar QRs con el dominio real

Una vez el frontend apunte al dominio correcto:

1. Entrá a `https://tudominio.com/admin-login`
2. Andá a la sección "Gestión de Invitados"
3. Descargá el ZIP con todos los QRs actualizados
4. Distribuilos por WhatsApp, correo o los medios que prefieras

---

## Flujo de trabajo recomendado con Git

1. Trabajá en una rama de feature:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
2. Hacé commits descriptivos.
3. Cuando esté lista, mergeala a `main`:
   ```bash
   git checkout main
   git merge feature/nueva-funcionalidad
   git push origin main
   ```
4. En producción, hacé `git pull` y `docker compose up --build -d`.

---

## Solución de problemas

### El backend no levanta por un error de Prisma

```bash
docker compose exec backend npx prisma db push --accept-data-loss
docker compose exec backend npx prisma generate
docker compose restart backend
```

### Los cambios en el frontend no se reflejan

Reiniciá el contenedor:

```bash
docker compose restart frontend
```

### La base de datos quedó inconsistente

Podés borrar el volumen y empezar de cero (solo en desarrollo):

```bash
docker compose down -v
docker compose up --build -d
```

---

## Checklist antes de publicar

- [ ] Cambiar `ADMIN_PASSWORD`
- [ ] Cambiar credenciales de PostgreSQL
- [ ] Configurar `VITE_API_URL` con el dominio real
- [ ] Asegurarse de que la base de datos esté expuesta solo si es necesario
- [ ] Configurar HTTPS (certificado SSL)
- [ ] Regenerar QRs con el dominio de producción
- [ ] Verificar que el panel de administración funcione
- [ ] Verificar que el RSVP funcione con un código de invitado real
