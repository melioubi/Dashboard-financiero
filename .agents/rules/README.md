# Agent rules — Financial Metrics Dashboard

Reglas de ingeniería para agentes y contribuidores. Derivadas del análisis en `docs/engineering-practices.md` y validadas contra el flujo real del repo.

| Archivo | Alcance |
|---------|---------|
| `00-read-project-context.md` | Siempre, antes de cambios |
| `backend-layering.md` | `backend/app/**` |
| `api-ui-alignment.md` | Endpoints y consumidores frontend |
| `domain-contract-sync.md` | Tipos Pydantic ↔ TypeScript |
| `frontend-data-and-dates.md` | `frontend/src/**` fetch, labels, mocks |
| `testing-financial-logic.md` | Cambios de métricas / mock data |
| `docker-local-dev.md` | Compose, proxy, deps, CORS/debug |

Validación cruzada: `docs/rules-validation.md`.
