# AGENTS.md

Este archivo contiene directrices para trabajar en este proyecto de invitación de boda.

## Entorno de desarrollo

- El proyecto usa **Docker Compose** para orquestar el entorno completo: PostgreSQL, backend NestJS y frontend Vue 3.
- El frontend se sirve con hot reload configurado con polling para funcionar dentro de Docker.
- **No ejecutar `npm run build` ni builds manuales** salvo que el usuario lo solicite explícitamente. Docker se encarga de la construcción cuando corresponde.

## Estructura del proyecto

```
├── backend/     # NestJS + Prisma
├── frontend/    # Vue 3 + Vite + TypeScript
├── uploads/     # Archivos subidos por el admin
└── docker-compose.yml
```

## Convenciones

- Estilos con **CSS puro**, sin librerías de UI ni animación externas.
- Tipografía y paleta definidas en `frontend/src/styles/variables.css`.
- Componentes de secciones en `frontend/src/components/sections/`.
- Imágenes estáticas en `frontend/public/imgs/` y `frontend/public/music/`.

## Preferencias del usuario

- Diseño elegante, clásico y romántico.
- Animaciones suaves y sincronizadas.
- Secciones responsive, especialmente en móvil.
- Cualquier cambio de estilo o estructura debe mantener la coherencia visual del sitio.
