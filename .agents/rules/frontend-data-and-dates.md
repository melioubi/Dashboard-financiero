# Datos del frontend: API como fuente de verdad y fechas honestas

## Alcance

`frontend/src/App.tsx`, `frontend/src/lib/**`, componentes de dashboard.

## Razón

1. `mock-data.ts` no se importa; mantiene una segunda “verdad” obsoleta.  
2. El header muestra `period="2024 - Full Year"` mientras el mock del backend usa fechas relativas a `date.today()`.

## Regla

1. La fuente de verdad de movimientos en runtime es la API (`/api/metrics` u otros endpoints). No introducir arrays mock paralelos salvo tests o Storybook aislados.
2. No ampliar `mock-data.ts`; preferir eliminarlo o dejar claro que es legacy no usado.
3. Labels de periodo deben derivarse de los datos recibidos (min/max date) o de `GET /api/metrics/facets`, no de strings fijos de año.
4. Mantener el fetch con manejo de error visible (patrón actual en `App.tsx`).

## Ejemplo aplicable

Tarea: “corregir el periodo del header”.  
Guiado: calcular rango desde `movements` o facets; dejar de hardcodear `"2024 - Full Year"`.
