---
name: financial-dashboard-kpi-patterns
description: >
  Enforce consistent patterns for financial KPI data rendering across the
  Dashboard-financiero project. Use when adding, modifying, or reviewing KPI
  cards, financial data tables, or metric displays.
license: MIT
metadata:
  author: dashboard-financiero
  version: "1.0.0"
---

# Financial Dashboard KPI Patterns

Specific conventions for rendering financial KPIs in the Dashboard-financiero project.

## Goal

Ensure all financial metrics are displayed consistently, accessibly, and with
proper formatting across the entire dashboard.

## Inputs

- A React component that renders or consumes `KPIMetrics` or `MonthlyDataPoint`
- A monetary value (`number`) to display
- A percentage value (`number`) to display
- A `loading` or `error` state

## Rules

### 1. Always use utility formatters, never inline formatting

```tsx
// ❌ Inline formatting
<p className="text-3xl font-semibold">${value.toLocaleString()}</p>
<p>{value.toFixed(1)}%</p>

// ✅ Use project formatters
import { formatCurrency, formatPercent } from "@/lib/financial-utils";
<p className="text-3xl font-semibold">{formatCurrency(value)}</p>
<p>{formatPercent(value)}</p>
```

### 2. KPI card structure — use `KPICard` component

Every KPI must be rendered through the `KPICard` component with the correct
`variant` prop:

```tsx
import { KPICard } from './kpi-card';

// Available variants: 'income' | 'outcome' | 'profit' | 'profitPercent'
<KPICard
  label="Total Income"
  value={formatCurrency(metrics.totalIncome)}
  helperText="Cumulative revenue from all income movements"
  icon={TrendingUp}
  variant="income"
  loading={loading}
/>
```

### 3. Chart components must receive `MonthlyDataPoint[]`

Chart components (`IncomeOutcomeChart`, `ProfitPercentChart`) must accept
`data: MonthlyDataPoint[]` and `loading?: boolean` props. Never pass raw
`FinancialMovement[]` directly to chart components.

### 4. Loading state — always show skeleton placeholders

When `loading` is `true`, KPI cards and charts must show skeleton placeholders,
not text or empty states:

```tsx
// KPICard skeleton is built-in via the `loading` prop
<KPICard ... loading={true} />

// Chart components handle loading internally
```

### 5. Empty state — show "No data available" with role="status"

When data is empty (all values are zero), show an accessible empty state:

```tsx
{!hasData ? (
  <div className="flex h-[280px] items-center justify-center text-muted-foreground text-sm" role="status">
    No data available to display
  </div>
) : (
  <ChartComponent ... />
)}
```

### 6. Error state — use `role="alert"` with `aria-live="assertive"`

```tsx
{error ? (
  <div
    className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm"
    role="alert"
    aria-live="assertive"
  >
    {error}
  </div>
) : null}
```

### 7. All chart icons must be decorative

```tsx
<span aria-hidden="true">
  <Icon size={16} />
</span>
```

### 8. Use `React.memo` on all KPI and chart components

All dashboard components that render metrics should be wrapped in `React.memo`
to prevent unnecessary re-renders:

```tsx
export const KPICard = memo(function KPICard(props) { ... });
export const KPIRow = memo(function KPIRow(props) { ... });
```

## Output

A modified React component that follows all the above rules.

## Acceptance Criteria

- [ ] All monetary values use `formatCurrency()` from `financial-utils.ts`
- [ ] All percentage values use `formatPercent()` from `financial-utils.ts`
- [ ] KPI cards use the `KPICard` component with proper `variant`
- [ ] Chart components accept `MonthlyDataPoint[]` and `loading` props
- [ ] Loading state renders skeletons, not text
- [ ] Empty state renders "No data available" with `role="status"`
- [ ] Error state renders with `role="alert"` and `aria-live="assertive"`
- [ ] Decorative icons have `aria-hidden="true"`
- [ ] Components are wrapped with `React.memo`