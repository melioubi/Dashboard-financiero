# Tests obligatorios para lógica financiera

## Alcance

Cambios en generación mock, filtros, agregaciones (`routes.py` / services) o `financial-utils.ts`.

## Razón

Las métricas (income, outcome, net, alerts) son el núcleo del producto. Ya hay base de tests (`backend/tests/test_routes.py`, `financial-utils.test.ts`); hay que preservarla.

## Regla

1. Todo cambio de fórmula o filtro debe incluir o actualizar un test automatizado.
2. Preservar `seed=42` (o documentar el nuevo seed) para determinismo.
3. Ejecutar al menos:
   - Backend: `pytest` en `backend/`
   - Frontend utils: `npm test` en `frontend/`
4. No degradar assertions de orden cronológico o filtros B2B/B2C sin justificación.

## Ejemplo aplicable

Tarea: “cambiar el umbral default de alerts”.  
Guiado: actualizar default en endpoint + test que aserte el nuevo comportamiento.
