# Component Specification

## Feature 1 — Date Range Filter

### Component: `DateRangeFilter`

A pair of date input fields at the top of the main dashboard to filter all visible data by a custom date range.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `minDate` | `string` | Yes | Earliest date available in the dataset (from `FacetsResponse.min_date`), displayed as a hint below the inputs. Format: `YYYY-MM-DD` |
| `maxDate` | `string` | Yes | Latest date available in the dataset (from `FacetsResponse.max_date`), displayed as a hint below the inputs. Format: `YYYY-MM-DD` |
| `onFilterChange` | `(startDate: string \| undefined, endDate: string \| undefined) => void` | Yes | Callback invoked whenever a date value changes. Passes the current values (or `undefined` when empty) to the parent so it can re-fetch data. |

#### Layout

- Two `<input type="date">` elements placed side by side, labeled "Start Date" and "End Date".
- Below the inputs, a small text hint showing: `Available range: {minDate} — {maxDate}`.
- The hint uses the `minDate` and `maxDate` values from the `FacetsResponse`.

#### Behaviour

- **Both empty (default state):** No date filtering is applied. The dashboard shows all data.
- **Only start_date filled:** Filters data from that start date onward (inclusive). No upper bound.
- **Only end_date filled:** Filters data up to that end date (inclusive). No lower bound.
- **Both filled:** Filters data between start_date and end_date inclusive.
- **Invalid date entry:** Browser native `<input type="date">` validation prevents non-date values. If min/max attributes are set on the inputs, the calendar picker will also restrict selection.
- **min/max constraint (recommended):** The start_date input should have `max` set to the current `maxDate`, and the end_date input should have `min` set to the current `minDate`, to prevent selecting out-of-range dates.

---

## Feature 2 — Anomaly Alerts Table

### Component: `AnomalyAlertsTable`

A table displayed below the existing charts on the main dashboard, highlighting periods where expenses rose unexpectedly.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `alerts` | `AlertEntry[]` | Yes | The list of alerts returned from `GET /api/metrics/alerts`. May be an empty array. |
| `threshold` | `number` | Yes | Current threshold value used for anomaly detection. Range: `0.01`–`1.0`. |
| `onThresholdChange` | `(newThreshold: number) => void` | Yes | Callback invoked when the user changes the threshold value. Passes the validated number. |
| `loading` | `boolean` | No | Whether the alerts data is currently being fetched. When `true`, a loading skeleton is shown. Default: `false`. |

#### Table Columns

| Column | Data Source | Type | Format |
|--------|-------------|------|--------|
| **Period** | `alert.period` | `string` | e.g. `"2025-08"`, `"2025-W32"`, or ISO date |
| **Recorded Outcome** | `alert.outcome_total` | `number` | Formatted as currency with 2 decimal places |
| **3-Period Moving Average** | `alert.baseline_average` | `number` | Formatted as currency with 2 decimal places |
| **Increase Percentage** | `alert.increase_ratio` | `number` | Formatted as percentage with 2 decimal places (e.g. `35.85%`) |

#### Threshold Input

- A numeric `<input>` element labelled "Alert Threshold" placed above the table.
- Accepts values between `0.01` and `1.0` (inclusive).
- Default value: `0.3`.
- **Out of range behaviour:** When the user enters a value below `0.01` or above `1.0`, the input should clamp to the nearest valid boundary (i.e. values < 0.01 become 0.01, values > 1.0 become 1.0). Additionally, an inline validation message should be displayed: `"Threshold must be between 0.01 and 1.0"`.
- Decimal step: `0.01` or `0.1` is acceptable.

#### Empty State

When `alerts` is an empty array (`[]`), the table area renders:

> **No anomalies detected**
> All expense periods are within the normal range for the current threshold ({threshold}).
> Try lowering the threshold to detect smaller deviations.

This message is displayed centered in the table area, replacing the table rows. The column headers may remain visible for layout consistency, or the entire table is replaced with a simple card containing the message.

#### Loading State

When `loading` is `true`, the table area shows a skeleton placeholder (e.g. 3-4 rows of grey bars) to indicate ongoing data fetching.

---

## Feature 3 — B2B vs B2C Comparative View

### Component: `B2BvsB2CView` (Page-level container)

A new page/section in the dashboard dedicated to comparing revenue performance between the B2B and B2C business lines. It contains two parallel sections, each headed by the business type name.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `b2bCategories` | `CategoryEntry[]` | Yes | Top 5 income categories for B2B (from `GET /api/metrics/categories/top?operation_type=income&business_type=B2B`). |
| `b2cCategories` | `CategoryEntry[]` | Yes | Top 5 income categories for B2C (from `GET /api/metrics/categories/top?operation_type=income&business_type=B2C`). || `b2bTotalIncome` | `number` | Yes | Sum of all B2B income (used by the chart and the Top5Table % calculations). |
| `b2cTotalIncome` | `number` | Yes | Sum of all B2C income (used by the chart and the Top5Table % calculations). || `loading` | `boolean` | No | Whether data is being fetched. When `true`, skeleton placeholders are shown. Default: `false`. |

#### Layout

```
┌─────────────────────┬─────────────────────┐
│      B2B            │      B2C            │
│  ┌───────────────┐  │  ┌───────────────┐  │
│  │ Top 5 Table   │  │  │ Top 5 Table   │  │
│  │ (Top5Table)   │  │  │ (Top5Table)   │  │
│  └───────────────┘  │  └───────────────┘  │
└─────────────────────┴─────────────────────┘
┌─────────────────────────────────────────────┐
│          ComparisonChart (B2B vs B2C)        │
│  ┌─────────────────────────────────────────┐│
│  │   ██ B2B: $XXX,XXX.XX                   ││
│  │   ██ B2C: $XXX,XXX.XX                   ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

### Component: `Top5Table`

A table showing the top 5 income categories for a given business type.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `businessType` | `"B2B" \| "B2C"` | Yes | The business type label displayed as section heading. |
| `categories` | `CategoryEntry[]` | Yes | The top N category entries (expected length <= 5). |
| `totalGroupIncome` | `number` | Yes | Sum of all income for this business type, used to calculate percentages. |

#### Columns

| Column | Data Source | Type | Format |
|--------|-------------|------|--------|
| **Category** | `entry.category` | `string` | Human-readable category name (capitalized) |
| **Total Income** | `entry.total_amount` | `number` | Formatted as currency with 2 decimal places |
| **% of Group** | `(entry.total_amount / totalGroupIncome) * 100` | `number` | Percentage with 1 decimal place (e.g. `85.3%`) |

#### Empty State

When `categories` is an empty array (`[]`), the panel renders:

> **No income data for {businessType}**
> There are no income records available for this business line in the current date range.

This message is displayed centered within the panel area.

### Component: `ComparisonChart`

A single chart that compares the total income of B2B versus B2C visually. Placed below the two parallel panels, spanning the full width of the view.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `b2bTotalIncome` | `number` | Yes | Total income for B2B (sum of all income amounts across B2B categories). |
| `b2cTotalIncome` | `number` | Yes | Total income for B2C (sum of all income amounts across B2C categories). |

#### Chart Description

- The chart displays exactly **two data points**: B2B total income and B2C total income.
- Chart type: a side-by-side bar chart or a single horizontal bar with two segments is recommended.
- **X-axis / legend labels:** "B2B" and "B2C".
- **Y-axis / value:** Total income amount in currency.
- Each bar/segment represents the **aggregate total income** for that business line (not per-category breakdown).
- An optional label above or beside each bar shows the exact dollar amount.

#### Empty State

When both totals are zero (or when both top-5 lists are empty), the chart area shows:

> **No data to display**

...centered in the chart container.