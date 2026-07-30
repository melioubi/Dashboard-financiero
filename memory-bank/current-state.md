# Estado actual del proyecto

Última actualización de este documento: Sesión de Skills de Agente (feature/agent-skills).

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

## Skills de agente aplicadas

### 1. Accessibility (addyosmani/web-quality-skills@accessibility)
- Añadido `skip-to-content` link para navegación por teclado
- Añadida clase `.visually-hidden` para contenido accesible solo a lectores de pantalla
- Añadido `role="alert"` y `aria-live="assertive"` al mensaje de error
- Añadido `role="status"` a los estados vacíos de gráficos
- Añadido `aria-hidden="true"` a todos los iconos decorativos (dashboard header, KPI cards)
- Añadido `role="img"` con `aria-label` y `aria-labelledby` a los contenedores de gráficos
- Añadido `id` a los títulos de gráficos para referencias aria
- Añadido `<h2 class="visually-hidden">` a la sección de KPIs
- Añadida regla CSS `prefers-reduced-motion: reduce` para respetar preferencias de movimiento
- Añadido `:focus-visible` con outline para navegación por teclado
- Actualizado `<title>` y añadido `<meta name="description">` en `index.html`

### 2. Vercel React Best Practices (vercel-labs/agent-skills@vercel-react-best-practices)
- Envuelto `KPICard` con `React.memo` (regla `rerender-memo`)
- Envuelto `KPIRow` con `React.memo` (regla `rerender-memo`)
- Envuelto `IncomeOutcomeChart` con `React.memo` (regla `rerender-memo`)
- Envuelto `ProfitPercentChart` con `React.memo` (regla `rerender-memo`)
- Aplicado código splitting con `React.lazy` + `Suspense` para componentes de gráficos (regla `bundle-dynamic-imports`)

### 3. Performance (addyosmani/web-quality-skills@performance)
- Implementado lazy loading dinámico (`React.lazy`) para `IncomeOutcomeChart` y `ProfitPercentChart`
- Wrapped con `Suspense` con fallback animado
- recharts ahora vive en un chunk separado (342kB), reduciendo el bundle principal a 188kB

### 4. Habilidad propia - financial-dashboard-kpi-patterns
- Creada en `.skills/financial-dashboard-kpi-patterns.md`
- Cubre: formato de moneda/porcentaje, estructura de KPICard, estados loading/empty/error, accesibilidad en iconos, y memoización

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `frontend/index.html` | Meta description, title mejorado |
| `frontend/src/index.css` | `.visually-hidden`, `.skip-to-content`, `prefers-reduced-motion`, `:focus-visible` |
| `frontend/src/App.tsx` | Skip link, `role="alert"`, `visually-hidden` heading, lazy imports, Suspense |
| `frontend/src/components/dashboard/dashboard-header.tsx` | `aria-hidden` en icono |
| `frontend/src/components/dashboard/kpi-card.tsx` | `aria-hidden` en icono, `React.memo` |
| `frontend/src/components/dashboard/kpi-row.tsx` | `React.memo` |
| `frontend/src/components/dashboard/income-outcome-chart.tsx` | `React.memo`, `role="img"`, `aria-label`, `aria-labelledby`, `role="status"` |
| `frontend/src/components/dashboard/profit-percent-chart.tsx` | `React.memo`, `role="img"`, `aria-label`, `aria-labelledby`, `role="status"` |

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
- Skills: `.agents/skills/`
- Habilidad propia: `.skills/financial-dashboard-kpi-patterns.md`
