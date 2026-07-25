# Alineación API ↔ UI

## Alcance

Nuevos o cambios en endpoints bajo `/api/**` y consumidores en `frontend/src/`.

## Razón

Existen endpoints (`facets`, `summary`, `categories/top`, `comparison`, `alerts`, `b2b`, `b2c`) sin uso en `App.tsx`, que solo llama `GET /api/metrics`. Ampliar la API sin consumidor aumenta deuda y confunde el alcance del producto.

## Regla

1. Antes de añadir un endpoint, definir el consumidor (componente UI o cliente documentado).
2. Si un endpoint queda solo para exploración/OpenAPI, documentarlo explícitamente como “API disponible, no cableada al dashboard” en `memory-bank` o README de API.
3. Preferir reutilizar endpoints existentes (p. ej. `summary`) antes de duplicar agregación en el cliente.
4. No eliminar endpoints huérfanos sin revisar `backend/tests/test_routes.py` (hoy los cubren).

## Ejemplo aplicable

Tarea: “mostrar top categorías en el dashboard”.  
Guiado: consumir `GET /api/metrics/categories/top` desde el frontend; no recalcular en un mock local.
