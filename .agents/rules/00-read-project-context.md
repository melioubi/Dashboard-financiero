# Leer contexto del proyecto antes de actuar

## Alcance

Siempre. Aplica a cualquier tarea de análisis, documentación o código.

## Razón

`AGENTS.md` exige revisar reglas y memory-bank. El traspaso llegó sin producto documentado; sin este paso se inventa comportamiento (p. ej. asumir DB o auth).

## Regla

1. Leer `AGENTS.md`.
2. Leer reglas en `.agents/rules/`.
3. Si existe, leer `memory-bank/` (producto, stack, estado).
4. Contrastar con código en `frontend/src/` y `backend/app/` antes de afirmar capacidades.
5. No asumir persistencia, auth, router SPA ni uso de endpoints no consumidos por `App.tsx`.

## Ejemplo aplicable

Pregunta: “¿Dónde se guardan los movimientos?”  
Respuesta correcta guiada por esta regla: no hay DB; `generate_mock_movements(seed=42)` en `backend/app/routes.py`.
