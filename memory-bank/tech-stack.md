# Stack tecnológico

## Frontend

| Pieza | Detalle | Evidencia |
|-------|---------|-----------|
| Runtime UI | React 19 | `frontend/package.json` |
| Lenguaje | TypeScript | `tsconfig*.json` |
| Bundler / dev server | Vite 8 | `vite`, script `dev` |
| Estilos | Tailwind CSS 4 + plugin Vite | `@tailwindcss/vite` |
| Charts | Recharts 3 | dependencia + charts en `components/dashboard/` |
| Iconos | Lucide React | `dashboard-header.tsx` |
| UI primitives | shadcn-style (`components.json`, `card`, `skeleton`) | `frontend/components.json` |
| Utils de clase | `clsx`, `tailwind-merge`, `class-variance-authority` | `package.json` |
| Tests | Vitest + coverage v8 | scripts `test`, `test:coverage` |
| Lint | ESLint 9 + typescript-eslint | `eslint` scripts |

Alias de imports: `@` → `frontend/src` (`vite.config.ts`).

Variable opcional: `VITE_API_BASE_URL` (`frontend/.env.example`). Por defecto vacío → requests relativos `/api/...` vía proxy.

## Backend

| Pieza | Detalle | Evidencia |
|-------|---------|-----------|
| Framework | FastAPI | `backend/app/main.py` |
| Servidor | Uvicorn (`uvicorn[standard]`) | `requirements.txt`, Dockerfile |
| Validación | Pydantic (vía FastAPI) | modelos en `routes.py` |
| Debug remoto | debugpy (puerto 5678) | Dockerfile backend |
| Tests | pytest, pytest-cov, httpx / TestClient | `backend/tests/` |
| Persistencia | Ninguna (mock in-memory) | `generate_mock_movements` |

Python base image: `python:3.13-slim`.

## Infraestructura y tooling

| Pieza | Detalle |
|-------|---------|
| Orquestación | Docker Compose (`frontend` + `backend`) |
| Frontend image | `node:24-alpine`, `npm run dev -- --host 0.0.0.0 --port 5173` |
| Backend image | Uvicorn con reload + debugpy |
| Proxy local | Vite `server.proxy["/api"]` → `http://backend:8000` |
| Puertos host | 5173 (UI), 8000 (API), 5678 (debugpy) |
| Docs API | OpenAPI automática en `/docs` |

## Dependencias clave (resumen)

**Frontend runtime:** `react`, `react-dom`, `recharts`, `lucide-react`, utilidades de clase.  
**Backend:** `fastapi`, `uvicorn[standard]`, `debugpy` (+ pytest stack en el mismo requirements).

**Nota:** `requirements.txt` no fija versiones; el frontend sí usa rangos semver en `package.json`/`package-lock.json`.
