# Desarrollo local con Docker y límites de seguridad

## Alcance

`docker-compose.yml`, Dockerfiles, `requirements.txt`, CORS en `main.py`, config Vite.

## Razón

El flujo oficial es `docker compose up --build`. El proxy Vite evita configurar URL en local. CORS `*` y debugpy permanente son OK en laboratorio, no como plantilla de producción.

## Regla

1. Preferir el proxy de Vite (`/api` → `http://backend:8000`) para desarrollo Compose; no hardcodear `localhost:8000` en el cliente.
2. Usar `VITE_API_BASE_URL` solo cuando el origen del API sea distinto del proxy (documentado en `frontend/.env.example`).
3. Al tocar dependencias Python: pin de versiones en `requirements.txt`.
4. No ampliar CORS ni exponer debugpy como “configuración de producción” en documentación; si se endurece, actualizar `memory-bank` estado actual.
5. Respetar el volumen anónimo de `node_modules` en Compose (evita conflictos de permisos OS/host).

## Ejemplo aplicable

Tarea: “el frontend no llega al API en Codespaces”.  
Guiado: verificar proxy y que `VITE_API_BASE_URL` esté vacío; no apuntar a `localhost` del contenedor equivocado.
