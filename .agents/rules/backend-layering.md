# Separación de capas en el backend

## Alcance

`backend/app/**` al añadir o refactorizar modelos, lógica o endpoints.

## Razón

Hoy `routes.py` concentra modelos Pydantic, generación mock, filtros, agregaciones y rutas. Eso eleva el riesgo de regresiones al tocar un solo endpoint.

## Regla

Al modificar el backend de forma no trivial:

1. **Models**: schemas Pydantic y literales de dominio.
2. **Services**: `generate_mock_movements`, filtros, summary, alerts, top categories.
3. **Routes**: solo HTTP (query params, llamadas a services, `response_model`).

No es obligatorio refactorizar todo el archivo en un solo cambio. Si el cambio es pequeño (un filtro), puede permanecer en `routes.py`, pero código nuevo de dominio no debe crecer ahí sin límite: preferir extraer a módulos cuando se añada un endpoint o lógica de agregación.

## Ejemplo aplicable

Tarea: “añadir endpoint de mediana de outcome”.  
Guiado: implementar cálculo en un service/módulo de métricas; la ruta solo orquesta. Cubrir con test en `backend/tests/`.
