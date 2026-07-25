# Fase 1 — Resumen del proyecto (validado contra el código)

Documento de comprensión del traspaso. Toda afirmación se contrastó con archivos reales del repositorio.

## Propósito

**Financial Metrics Dashboard**: panel ejecutivo de métricas financieras (ingresos, egresos, beneficio y margen) alimentado por una API mock de movimientos.

Evidencia:

- `README.md` / `README.es.md`: dashboard React + TypeScript + FastAPI.
- UI: `frontend/src/components/dashboard/dashboard-header.tsx` — título “Financial Overview”.
- Dominio: `FinancialMovement` en `backend/app/routes.py` y `frontend/src/lib/financial-types.ts` (`income`/`outcome`, categorías, `B2B`/`B2C`).

## Estructura del repositorio

```text
Dashboard-financiero/
├── AGENTS.md                 # Punteros a .agents y memory-bank
├── README.md / README.es.md  # Cómo ejecutar con Docker
├── docker-compose.yml        # Servicios frontend + backend
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py           # Entrada FastAPI + CORS
│   │   └── routes.py         # Modelos, mock data y todos los endpoints
│   └── tests/
│       ├── conftest.py
│       └── test_routes.py
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.ts        # Proxy /api → backend:8000
    ├── .env.example
    └── src/
        ├── main.tsx
        ├── App.tsx             # Página única + fetch
        ├── components/dashboard/
        ├── components/ui/
        └── lib/                # tipos, utils, tests, mock-data
```

Al momento de este resumen **no existían** `.agents/rules` ni `memory-bank/` (esperados por `AGENTS.md`).

## Arquitectura

| Capa | Tecnología | Punto de entrada |
|------|------------|------------------|
| Frontend | React 19, TypeScript, Vite 8, Tailwind 4, Recharts, Lucide | `frontend/src/main.tsx` → `App.tsx` |
| Backend | FastAPI, Uvicorn, Pydantic, debugpy | `backend/app/main.py` |
| Orquestación | Docker Compose | `docker-compose.yml` |

- **Sin base de datos**: `generate_mock_movements(seed=42)` regenera ~360 movimientos por request.
- **Sin autenticación**.
- **Sin router de frontend**: una sola vista.
- CORS abierto (`allow_origins=["*"]`) en `backend/app/main.py`.

## Flujo de datos (evidencia)

1. El navegador carga `http://localhost:5173`.
2. `App.tsx` llama `fetch(\`${API_BASE_URL}/api/metrics\`)` (por defecto `VITE_API_BASE_URL` vacío → `/api/metrics`).
3. Vite (`frontend/vite.config.ts`) hace proxy de `/api` a `http://backend:8000`.
4. `get_metrics` en `routes.py` genera mock data, filtra opcionalmente y responde JSON.
5. El cliente agrega con `computeKPIs` / `computeMonthlyData` (`financial-utils.ts`) y renderiza KPIs + charts.

## Capacidad de la API vs uso real del UI

Endpoints en `backend/app/routes.py`:

| Endpoint | Usado por el frontend |
|----------|------------------------|
| `GET /health` | No |
| `GET /api/metrics` | **Sí** (único consumo) |
| `GET /api/metrics/facets` | No |
| `GET /api/metrics/summary` | No |
| `GET /api/metrics/categories/top` | No |
| `GET /api/metrics/comparison` | No |
| `GET /api/metrics/alerts` | No |
| `GET /api/metrics/b2b` | No |
| `GET /api/metrics/b2c` | No |

La UI muestra: header (periodo hardcodeado `"2024 - Full Year"`), fila de KPIs, gráfico ingresos/egresos y gráfico de margen %.

## Cómo ejecutar

```bash
docker compose up --build
```

- Frontend: http://localhost:5173  
- Backend: http://localhost:8000  
- Docs OpenAPI: http://localhost:8000/docs  

## Hallazgos de traspaso (gaps)

1. Documentación de producto casi ausente (README orientado a bootcamp/ejecución).
2. Artefactos de agentes y memoria pendientes (objetivo de fases 3–4).
3. Superficie API mayor que la UI (endpoints agregados sin consumidor).
4. Código muerto: `frontend/src/lib/mock-data.ts` no se importa.
5. Backend monolítico: modelos + generación + filtros + rutas en un solo archivo.
6. Periodo en UI fijo en “2024”; las fechas mock se calculan relativas a `date.today()`.

## Validación

Este resumen se elaboró inspeccionando `docker-compose.yml`, Dockerfiles, `package.json`, `requirements.txt`, `main.py`, `routes.py`, `App.tsx`, `vite.config.ts`, componentes de `dashboard/` y tests existentes. No se asumió comportamiento no presente en el código.
