# Descripción del producto

## Qué es

**Financial Metrics Dashboard** es un panel ejecutivo web que visualiza métricas financieras de movimientos mock (ingresos y egresos) a lo largo de un año.

Audiencia implícita: stakeholders que necesitan una vista rápida de:

- Ingreso total
- Egreso total
- Beneficio (profit)
- Margen % (profit / income)
- Evolución mensual de income vs outcome
- Evolución mensual del margen %

## Qué no es

Verificado en código:

- No es un ERP ni un sistema contable con persistencia.
- No incluye autenticación ni roles.
- No hay base de datos: los movimientos se regeneran en cada request con `generate_mock_movements(seed=42)` (`backend/app/routes.py`).
- No hay rutas SPA: una sola pantalla (`frontend/src/App.tsx`).

## Dominio

Cada movimiento (`FinancialMovement`) incluye:

| Campo | Valores |
|-------|---------|
| `create_date` | fecha |
| `amount` | float |
| `operation_type` | `income` \| `outcome` |
| `category` | `suppliers` \| `sales` \| `operational` \| `administrative` \| `others` |
| `business_type` | `B2B` \| `B2C` |

Volumen mock: 12 meses × 30 movimientos ≈ 360 registros, ordenados cronológicamente.

## Experiencia de usuario actual

1. Carga del dashboard con skeletons mientras llega la API.
2. Banner de error si falla el fetch.
3. Header “Financial Overview” + chip de periodo (hoy hardcodeado).
4. Fila de KPIs + dos gráficos Recharts.

## Capacidades de API disponibles (producto técnico)

Además del endpoint que usa la UI (`GET /api/metrics`), el backend expone facets, summary, top categories, comparison, alerts, B2B y B2C. Están implementadas y testeadas, pero **no cableadas** al dashboard.

## Contexto del repositorio

Proyecto de traspaso de [4Geeks Academy](https://4geeksacademy.com/) orientado a gobernanza con agentes (reglas + memory-bank), no a reescribir el producto.
