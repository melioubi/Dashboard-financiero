/**
 * Query parameter types for the Financial Metrics API endpoints.
 * All parameters map to query string parameters sent to the backend.
 * Dates are always in YYYY-MM-DD format.
 */

/**
 * Shared optional date range filter used across multiple endpoints.
 * When both are omitted, the endpoint returns data for the entire dataset.
 * When only one is provided, the filter applies a half-open range
 * (only lower bound or only upper bound).
 */
export interface DateRangeFilter {
  /** Start date in YYYY-MM-DD format (ISO 8601). Optional; when empty, no lower bound is applied. */
  start_date?: string;
  /** End date in YYYY-MM-DD format (ISO 8601). Optional; when empty, no upper bound is applied. */
  end_date?: string;
}

/**
 * Parameters for GET /api/metrics/alerts.
 * Extends DateRangeFilter so alerts respect the active date range.
 */
export interface AlertsParams extends DateRangeFilter {
  /**
   * Anomaly detection threshold as a ratio between 0.01 and 1.0.
   * An alert is triggered when (outcome - baseline) / baseline > threshold.
   * Default: 0.3
   */
  threshold: number;
}

/**
 * Parameters for GET /api/metrics/categories/top.
 * Extends DateRangeFilter to allow date-scoped top category queries.
 */
export interface TopCategoriesParams extends DateRangeFilter {
  /**
   * Operation type to filter by: "income" or "outcome".
   * Default: "outcome"
   */
  operation_type: "income" | "outcome";
  /**
   * Maximum number of categories to return.
   * Must be an integer between 1 and 20 (inclusive).
   * Default: 5
   */
  limit: number;
}