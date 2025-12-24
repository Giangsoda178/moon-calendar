/**
 * Insights System Barrel Export
 * Import from "@/components/charts/insights"
 */

// Components
export { default as InsightsBanner } from "./InsightsBanner.svelte"
export { default as MetricsGrid } from "./MetricsGrid.svelte"

// Configuration & Types
export {
  // Constants
  DEFAULT_HEALTH_STATES,
  DEFAULT_HISTOGRAM_THRESHOLDS,
  // Preset Configs
  FUNNEL_INSIGHTS_CONFIG,
  type GaugeInsightConfig,
  type HealthStateConfig,
  // Types
  type HealthStatus,
  type HistogramThresholds,
  INSIGHT_ICONS,
  type InsightsConfig,
  type MetricItem,
  RETENTION_INSIGHTS_CONFIG,
  type ThresholdOperator,
  type ThresholdRule,
  // Factory Functions
  createInsightsConfig,
  createRule,
  getIcon,
} from "./insights-config"

// Health Status Evaluation
export {
  type EvaluationResult,
  batchEvaluate,
  evaluateInsights,
  getMostSevereStatus,
  useInsights,
} from "./use-health-status.svelte"
