/**
 * API response types for the Financial Metrics API.
 * All interfaces match the exact shapes returned by the backend endpoints.
 * Verified against GET /api/metrics/facets, GET /api/metrics/alerts,
 * and GET /api/metrics/categories/top responses.
 */

/**
 * Represents a financial movement record returned by the API.
 * Used by: GET /api/metrics, GET /api/metrics/b2b, GET /api/metrics/b2c
 */
export interface FinancialMovement {
  /** Date the movement was created (ISO 8601 date string, e.g. "2025-07-15") */
  create_date: string;
  /** Monetary amount of the movement (positive float with 2 decimal places) */
  amount: number;
  /** Type of operation: "income" or "outcome" */
  operation_type: "income" | "outcome";
  /** Category of the movement: "suppliers" | "sales" | "operational" | "administrative" | "others" */
  category: "suppliers" | "sales" | "operational" | "administrative" | "others";
  /** Business line: "B2B" or "B2C" */
  business_type: "B2B" | "B2C";
}

/**
 * Response from GET /api/metrics/facets.
 * Provides available filter values and the full date range of the dataset.
 * Used by: Date range reference (Feature 1) and B2B vs B2C view (Feature 3).
 */
export interface FacetsResponse {
  /** All distinct operation types present in the dataset */
  operation_types: Array<"income" | "outcome">;
  /** All distinct business types present in the dataset: "B2B" and/or "B2C" */
  business_types: Array<"B2B" | "B2C">;
  /** All distinct categories present in the dataset */
  categories: Array<"suppliers" | "sales" | "operational" | "administrative" | "others">;
  /** Earliest date in the dataset (ISO 8601 date string, e.g. "2025-07-04") */
  min_date: string;
  /** Latest date in the dataset (ISO 8601 date string, e.g. "2026-06-27") */
  max_date: string;
}

/**
 * A single alert entry for anomaly detection.
 * Used by: GET /api/metrics/alerts response items.
 */
export interface AlertEntry {
  /** Period identifier (e.g. "2025-08" for monthly grouping, "2025-W32" for weekly, or ISO date for daily) */
  period: string;
  /** Total outcome (expense) amount recorded for this period */
  outcome_total: number;
  /** Average outcome of the 3 periods immediately preceding this one */
  baseline_average: number;
  /** Ratio of increase: (outcome_total - baseline_average) / baseline_average */
  increase_ratio: number;
}

/**
 * Response from GET /api/metrics/alerts.
 * Returns a list of anomaly alerts, or an empty array if none found.
 */
export type AlertsResponse = AlertEntry[];

/**
 * A single top-category entry for income or outcome.
 * Used by: GET /api/metrics/categories/top response items.
 */
export interface CategoryEntry {
  /** Category name: "suppliers" | "sales" | "operational" | "administrative" | "others" */
  category: "suppliers" | "sales" | "operational" | "administrative" | "others";
  /** Operation type filtered: "income" or "outcome" */
  operation_type: "income" | "outcome";
  /** Total monetary amount for this category (sum of all amounts grouped by category) */
  total_amount: number;
}

/**
 * Response from GET /api/metrics/categories/top.
 * Returns top N categories ordered by total_amount descending.
 * Used by: B2B vs B2C comparative view (Feature 3).
 */
export type TopCategoriesResponse = CategoryEntry[];

/**
 * A single item in the metrics summary (aggregated by day, week, or month).
 * Used by: GET /api/metrics/summary response items.
 */
export interface MetricsSummaryItem {
  /** Period key: ISO date for daily, "YYYY-Www" for weekly, "YYYY-MM" for monthly */
  period: string;
  /** Total income amount for the period */
  income: number;
  /** Total outcome amount for the period */
  outcome: number;
  /** Net value: income minus outcome */
  net: number;
}

/**
 * Comparison data between two periods.
 * Used by: GET /api/metrics/comparison response.
 */
export interface MetricsComparison {
  /** Net value for the current period */
  current_period: number;
  /** Net value for the previous period of equal duration */
  previous_period: number;
  /** Absolute difference: current_period - previous_period */
  delta_abs: number;
  /** Percentage change relative to previous period (null when previous_period is 0) */
  delta_pct: number | null;
}