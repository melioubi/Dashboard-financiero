# Fase 2 — Análisis de prácticas de ingeniería

Hallazgos basados en inspección de `backend/app/`, `frontend/src/`, Docker y tests. Cada ítem cita evidencia concreta.

## Buenas prácticas (≥5)

### Arquitectura / separación de capas (frontend)

1. **Componentes de dashboard desacoplados de la lógica de agregación**  
   `App.tsx` orquesta fetch/estado; KPIs y charts viven en `components/dashboard/`; cálculos en `lib/financial-utils.ts`. Facilita probar y reutilizar UI.

2. **Tipos de dominio explícitos compartidos en el cliente**  
   `frontend/src/lib/financial-types.ts` define `FinancialMovement`, `KPIMetrics`, `MonthlyDataPoint` alineados con el contrato del backend.

### Tipado y contratos (backend)

3. **Modelos Pydantic + `response_model` en endpoints**  
   En `routes.py`, modelos (`FinancialMovement`, `MetricsSummaryItem`, etc.) y `response_model=` documentan y validan la API (OpenAPI en `/docs`).

4. **Literales tipados para catálogos cerrados**  
   `OperationType`, `Category`, `BusinessType`, `GroupBy` como `Literal[...]` reducen valores inválidos en queries y payloads.

### Testing

5. **Cobertura de API y utilidades de dominio**  
   - Backend: `backend/tests/test_routes.py` (health, filtros, B2B/B2C, summary, alerts, etc.).  
   - Frontend: `frontend/src/lib/financial-utils.test.ts` + scripts `test`/`test:coverage` en `package.json`.

### DX / tooling

6. **Entorno local reproducible con Docker Compose**  
   `docker-compose.yml` + Dockerfiles; proxy Vite `/api` → `backend:8000`; `.env.example` documenta `VITE_API_BASE_URL`.

7. **Seed fijo para datos mock deterministas**  
   `generate_mock_movements(seed=42)` hace respuestas predecibles y tests estables.

---

## Malas prácticas / riesgos (≥5)

### Arquitectura

1. **Monolito en `routes.py`**  
   Modelos, generación mock, filtros, agregaciones y todos los endpoints en un solo archivo (~390 líneas). Dificulta ownership y cambios seguros.

2. **API más amplia que el consumidor**  
   El UI solo usa `GET /api/metrics`; facets, summary, top, comparison, alerts, b2b/b2c no tienen UI. Riesgo de “API huérfana” y documentación engañosa sobre capacidades del producto.

### Naming / consistencia de producto

3. **Periodo hardcodeado vs fechas dinámicas**  
   `App.tsx` pasa `period="2024 - Full Year"`; el mock usa `date.today()` en `_year_for_month`. La etiqueta UI puede mentir sobre el rango real.

### Mantenibilidad / dead code

4. **Código muerto en frontend**  
   `frontend/src/lib/mock-data.ts` no es referenciado (grep sin imports). Confunde la fuente de verdad de datos.

### Seguridad / ops

5. **CORS permisivo y debugpy siempre activo**  
   `allow_origins=["*"]` + `allow_credentials=True` en `main.py`; backend Docker arranca siempre con `debugpy` en `5678`. Aceptable en laboratorio, riesgoso si se despliega así.

6. **Dependencias Python sin pin de versión**  
   `requirements.txt` lista paquetes sin versiones → builds no reproducibles.

### Documentación / gobernanza

7. **Sin reglas de agente ni memory-bank**  
   `AGENTS.md` apunta a `.agents/rules` y `memory-bank`, pero no existían al inicio del traspaso. Futuros contribuidores/agentes carecen de contexto operativo.

### Testing / DX

8. **Sin tests de componentes ni E2E; sin CI visible**  
   No hay tests de React components ni pipeline CI en el repo. Regresiones de UI dependen de inspección manual.

---

## Reglas propuestas (borrador → Fase 3)

| ID | Regla | Mitiga / preserva |
|----|--------|-------------------|
| R1 | Separar capas backend: `models` / `services` (mock+agregación) / `routes` al tocar endpoints nuevos | Monolito `routes.py` |
| R2 | Todo endpoint público debe tener consumidor (UI o cliente documentado) o marcarse como experimental en docs | API huérfana |
| R3 | Mantener tipos de dominio alineados frontend↔backend (`financial-types` ↔ Pydantic) | Buena práctica de contratos |
| R4 | No hardcodear periodos/fechas en UI; derivarlos de datos o facets | Label “2024” inconsistente |
| R5 | No añadir datos mock locales si la fuente de verdad es la API; eliminar o aislar dead code | `mock-data.ts` |
| R6 | Preservar seed determinista y tests de dominio al cambiar generación mock | Buena práctica de tests |
| R7 | Pin de dependencias Python y CORS/debug restringidos fuera de local | Reproducibilidad y seguridad |
| R8 | Antes de cambios: leer `AGENTS.md`, `.agents/rules` y `memory-bank` | Gobernanza del traspaso |
| R9 | Cambios de agregación financiera requieren test (backend y/o `financial-utils`) | Regresiones de métricas |
| R10 | Preferir proxy Vite `/api` en local; documentar `VITE_API_BASE_URL` solo para orígenes externos | DX Docker actual |

Estas reglas se materializan en `.agents/rules` en la Fase 3, refinadas para ser accionables en este repo concreto.
