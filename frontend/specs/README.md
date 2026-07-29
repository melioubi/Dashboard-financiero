# Frontend Specifications — Financial Dashboard

This directory contains the frontend specification documents for the Financial Dashboard application. These specs are intended for developers (or AI agents) to implement each feature without requiring additional clarification.

## Feature 1 — Date Range Filter

### Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/metrics/facets` | Fetch the available date range (`min_date`, `max_date`) to display as a hint to the user |

### Types Used

- **Response:** `FacetsResponse` (from `api-types.ts`)
- **Parameters:** `DateRangeFilter` (from `param-types.ts`)

### Parameters

| Parameter | Type | Required | Default | Valid Values |
|-----------|------|----------|---------|--------------|
| `start_date` | `string` (YYYY-MM-DD) | No | `null` | ISO 8601 date string |
| `end_date` | `string` (YYYY-MM-DD) | No | `null` | ISO 8601 date string |

### Edge Cases

1. **Only one date filled:** When only `start_date` is provided, the API returns data from that date onward with no upper bound. When only `end_date` is provided, data up to that date is returned with no lower bound. The UI must correctly pass the empty field as `undefined` (omitted from query) rather than sending an empty string.
2. **Date range with no data:** If the selected date range contains no records, the existing charts on the dashboard should render their empty states (e.g. "No data available" indicators, zeroed axes). The facets hint still shows the full dataset range, not the filtered range.
3. **Start date later than end date:** The UI should prevent this at the form level by validating that `start_date <= end_date` before invoking `onFilterChange`. If the user enters an invalid combination, show an inline error: "Start date must be before or equal to end date."

---

## Feature 2 — Anomaly Alerts Table

### Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/metrics/alerts?threshold=<ratio>&start_date=<date>&end_date=<date>` | Fetch anomaly alerts for the current threshold and optional date range |

### Types Used

- **Response:** `AlertsResponse` (`AlertEntry[]`, from `api-types.ts`)
- **Parameters:** `AlertsParams` (extends `DateRangeFilter`, from `param-types.ts`)

### Parameters

| Parameter | Type | Required | Default | Valid Values |
|-----------|------|----------|---------|--------------|
| `threshold` | `number` | Yes | `0.3` | `0.01` to `1.0` (inclusive). The API accepts `0` and above, but the UI restricts to `>= 0.01` |
| `group_by` | `string` | No | `"month"` | `"day"`, `"week"`, or `"month"` |
| `start_date` | `string` (YYYY-MM-DD) | No | `null` | ISO 8601 date |
| `end_date` | `string` (YYYY-MM-DD) | No | `null` | ISO 8601 date |
| `business_type` | `string` | No | `null` | `"B2B"` or `"B2C"` |

### Edge Cases

1. **No anomalies detected (empty array):** When the API returns `[]`, the UI renders the explicit empty state message: "No anomalies detected." This occurs when the threshold is set high enough that no period exceeds it, or when the filtered date range contains no outcome spikes.
2. **Threshold at boundary values:** A threshold of `0.01` triggers alerts for even tiny deviations (almost every period may qualify). A threshold of `1.0` means only periods where expenses more than doubled are flagged. The UI must clamp input values outside `[0.01, 1.0]` to the nearest boundary and display a validation message.
3. **Date range reduces data to zero alerts:** If the user selects a narrow date range (e.g. a single month) with no anomalies, the alerts table shows the empty state message. The message should still reference the current threshold value.
4. **Large number of alerts:** If many periods exceed the threshold (e.g. threshold near `0.01`), the table may show many rows. The table should support vertical scrolling with a fixed maximum height if needed.

---

## Feature 3 — B2B vs B2C Comparative View

### Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/metrics/facets` | Fetch the available business types (`business_types` list) to confirm both B2B and B2C exist |
| `GET /api/metrics/categories/top?operation_type=income&business_type=B2B&limit=5` | Fetch top 5 income categories for B2B |
| `GET /api/metrics/categories/top?operation_type=income&business_type=B2C&limit=5` | Fetch top 5 income categories for B2C |

### Types Used

- **Response:** `FacetsResponse` (for business type validation), `TopCategoriesResponse` (`CategoryEntry[]`, from `api-types.ts`)
- **Parameters:** `TopCategoriesParams` (extends `DateRangeFilter`, from `param-types.ts`)

### Parameters

| Parameter | Type | Required | Default | Valid Values |
|-----------|------|----------|---------|--------------|
| `operation_type` | `string` | Yes | `"outcome"` | `"income"` or `"outcome"` |
| `limit` | `integer` | No | `5` | `1` to `20` (inclusive) |
| `business_type` | `string` | No | `null` | `"B2B"` or `"B2C"` |
| `start_date` | `string` (YYYY-MM-DD) | No | `null` | ISO 8601 date |
| `end_date` | `string` (YYYY-MM-DD) | No | `null` | ISO 8601 date |

### Edge Cases

1. **One business type has fewer than 5 categories:** If B2B has only 2 income categories (e.g. "sales" and "others") while B2C has 2, the table shows only the available categories. The UI should not pad with empty rows. The `% of Group` calculation must still use the actual total group income for that business type.
2. **Business type has zero income records:** When `GET /api/metrics/categories/top` returns an empty array for a specific business type (e.g. B2C has no income in the selected date range), the corresponding panel shows the empty state message: "No income data for {businessType}." The other panel renders normally with its data.
3. **Date range affects both panels independently:** The `start_date` and `end_date` parameters are shared between both B2B and B2C requests. If the date range returns data for B2B but not B2C (or vice versa), each panel independently handles its empty state.
4. **Percentage calculations:** The `% of Group` column divides each category's `total_amount` by the sum of all category amounts returned (which represents the total income for that business type). If no categories exist, no percentage is calculated.

## Validation Summary

| Rule | Feature | Behaviour |
|------|---------|-----------|
| `start_date` > `end_date` | 1 | UI shows inline validation error; `onFilterChange` not called |
| Threshold < 0.01 or > 1.0 | 2 | Clamp to nearest boundary; show validation message |
| Empty alerts array | 2 | Display "No anomalies detected" empty state |
| Empty top categories | 3 | Display "No income data for {businessType}" per panel |
| Both date inputs empty | 1 | Pass `undefined` for both; fetch all data |