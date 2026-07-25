# Validación de reglas `.agents/rules` (Fase 3)

Cada regla se contrastó con una tarea realista de este repositorio. Si la regla no puede guiar el “cómo” del cambio, se consideró demasiado genérica y se refinó.

| Regla | Tarea de prueba | ¿Guía acción concreta? | Evidencia en repo |
|-------|-----------------|------------------------|-------------------|
| `00-read-project-context` | Explicar si hay base de datos | Sí → mirar memory-bank + `routes.py` mock | Sin DB; seed 42 |
| `backend-layering` | Añadir endpoint de mediana | Sí → service + route + test | Hoy todo en `routes.py` |
| `api-ui-alignment` | Mostrar top categorías | Sí → usar `/api/metrics/categories/top` | Endpoint existe; UI no lo usa |
| `domain-contract-sync` | Nueva categoría `marketing` | Sí → Pydantic + `financial-types.ts` | Literales duplicados ambos lados |
| `frontend-data-and-dates` | Arreglar label del periodo | Sí → derivar de datos/facets | `App.tsx` hardcodea 2024 |
| `testing-financial-logic` | Cambiar fórmula de margen | Sí → test en utils + pytest | Tests ya existen |
| `docker-local-dev` | Fallo de fetch en Compose | Sí → proxy Vite, no localhost ciego | `vite.config.ts` proxy |

## Refinamientos aplicados

- Se evitó una regla genérica “escribe código limpio”; se acotó a capas backend y contratos.
- Se evitó “asegura seguridad siempre”; se limitó a CORS/debugpy/deps en el contexto Docker de este proyecto.
- Se documentó que endpoints huérfanos **no se borran** a la ligera porque `test_routes.py` depende de ellos.

## Conclusión

Las reglas son aplicables al flujo real (Compose → Vite proxy → FastAPI mock → agregación cliente) y preservan lo útil (tipos, seed, tests, proxy) mientras mitigan riesgos observados en Fase 2.
