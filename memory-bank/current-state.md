# Estado actual del proyecto

Última actualización de este documento: tras Fase 4 del traspaso (reglas + memory-bank).

## Implementado y operativo

- [x] Dashboard de una página con KPIs y dos gráficos.
- [x] API FastAPI con health check y suite de endpoints de métricas.
- [x] Datos mock deterministas (`seed=42`).
- [x] Docker Compose para levantar frontend + backend.
- [x] Proxy Vite `/api` para desarrollo local/Codespaces.
- [x] Tests backend de rutas/filtros/agregaciones.
- [x] Tests frontend de utilidades financieras.
- [x] Documentación de ejecución EN/ES (`README.md`, `README.es.md`).
- [x] Guía de agentes (`AGENTS.md`).
- [x] Reglas de ingeniería en `.agents/rules/` (Fase 3).
- [x] Memory bank (este directorio) + resumen/análisis en `docs/`.

## Lagunas conocidas

| Gap | Impacto | Evidencia |
|-----|---------|-----------|
| UI no consume la mayoría de endpoints | Producto subutiliza la API | Solo `fetch` a `/api/metrics` en `App.tsx` |
| Periodo hardcodeado “2024” | Label puede no coincidir con fechas mock | `DashboardHeader period="2024 - Full Year"` |
| `mock-data.ts` sin uso | Confusión sobre fuente de verdad | Sin imports |
| Backend monolítico en `routes.py` | Mantenimiento más costoso | Un solo módulo grande |
| Sin auth / sin DB | No apto para datos reales de producción | Diseño actual |
| CORS `*` + debugpy siempre on | Riesgo si se despliega tal cual | `main.py`, Dockerfile |
| Python deps sin pin | Builds no reproducibles | `requirements.txt` |
| Sin CI visible / sin tests de componentes | Regresiones UI manuales | Estructura del repo |
| Skills de agente ausentes | Solo rules + memory-bank | `.agents/skills/` no creado (opcional) |

## Prioridades sugeridas (sin implementar aquí)

Orden orientativo para mantenimiento futuro; **no** son parte del alcance del traspaso de gobernanza:

1. Cablear o documentar endpoints huérfanos (p. ej. top categories, alerts) según `api-ui-alignment`.
2. Derivar el label de periodo desde facets/datos (`frontend-data-and-dates`).
3. Extraer services/models del monolito `routes.py` al crecer features (`backend-layering`).
4. Pin de versiones Python y endurecer CORS/debug fuera de local (`docker-local-dev`).
5. Eliminar o aislar `mock-data.ts`.
6. Añadir CI que ejecute `pytest` + `npm test`.

## Cómo arrancar (recordatorio)

```bash
docker compose up --build
```

- UI: http://localhost:5173  
- API: http://localhost:8000  
- OpenAPI: http://localhost:8000/docs  

## Referencias internas

- Resumen validado: `docs/project-summary.md`
- Prácticas: `docs/engineering-practices.md`
- Validación de reglas: `docs/rules-validation.md`
- Reglas: `.agents/rules/`
