# Sincronizar contrato de dominio frontend ↔ backend

## Alcance

Cambios en `FinancialMovement` / catálogos en `backend/app/routes.py` (o futuros `models`) y `frontend/src/lib/financial-types.ts`.

## Razón

Ambos lados definen los mismos literales (`income`/`outcome`, categorías, `B2B`/`B2C`). Un desfase rompe charts y KPIs en silencio (TypeScript no valida el JSON en runtime).

## Regla

1. Si se añade un campo o valor de catálogo en Pydantic, actualizar `financial-types.ts` en el mismo cambio.
2. Mantener nombres de campos en snake_case en el wire format (`create_date`, `operation_type`, …) como hoy.
3. Tras cambiar el contrato, actualizar tests backend y, si afecta agregación, `financial-utils.test.ts`.

## Ejemplo aplicable

Tarea: “añadir categoría `marketing`”.  
Guiado: actualizar `Category` en backend + frontend + tests de filtro por categoría.
