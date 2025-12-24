// =============================================================================
// Types - Unified Svelte 5 API
// =============================================================================
export type {
  // Chart-specific data types
  CalendarColorScheme,
  CalendarDataPoint,
  // Core unified types
  ChartDataPoint,
  ChartPadding,
  FlatNode,
  FunnelDataPoint,
  GaugeThreshold,
  HistogramBin,
  LegendItem,
  LegendParams,
  LegendSnippet,
  NestedNode,
  ReferenceLine,
  // Retention Lifecycle types
  RetentionSankeyData,
  RetentionSankeyLink,
  RetentionSankeyNode,
  RetentionState,
  RetentionTimelineDataPoint,
  SparklineData,
  TooltipParams,
  TooltipSnippet,
} from "./types"

export {
  DEFAULT_CHART_COLORS,
  RETENTION_STATE_COLORS,
  calcBottomPadding,
  calcHorizontalLeftPadding,
  calcLeftPadding,
  calcPadding,
} from "./types"

export { createSelectionState } from "./selection-state.svelte"

// =============================================================================
// Utilities
// =============================================================================

// Hierarchy utilities
export {
  clearHierarchyCache,
  computeTreemap,
  flatToNested,
} from "./hierarchy-utils"

// =============================================================================
// Context
// =============================================================================
export { getChartContext, setChartContext } from "./ChartContext.svelte"
export type { ChartContextValue } from "./ChartContext.svelte"

// =============================================================================
// Components - Basic Charts
// =============================================================================
export { default as AreaChart } from "./AreaChart.svelte"
export { default as BarChart } from "./BarChart.svelte"
export { default as ChartContainer } from "./ChartContainer.svelte"
export { default as ChartTooltip } from "./ChartTooltip.svelte"
export { default as FunnelChart } from "./FunnelChart.svelte"
export { default as GaugeChart } from "./GaugeChart.svelte"
export { default as LineChart } from "./LineChart.svelte"
export { default as PieChart } from "./PieChart.svelte"
export { default as RadialProgressChart } from "./RadialProgressChart.svelte"
export { default as SparklineChart } from "./SparklineChart.svelte"

// =============================================================================
// Components - Extended Charts
// =============================================================================
export { default as HistogramChart } from "./HistogramChart.svelte"
export { default as CalendarChart } from "./CalendarChart.svelte"
export { default as TreemapChart } from "./TreemapChart.svelte"

// =============================================================================
// Components - Retention Lifecycle Charts
// =============================================================================
export { default as RetentionJourney } from "./RetentionJourney.svelte"
export { default as RetentionSankeyChart } from "./RetentionSankeyChart.svelte"

// =============================================================================
// Insights System
// =============================================================================
export {
  // Constants
  DEFAULT_HEALTH_STATES,
  DEFAULT_HISTOGRAM_THRESHOLDS,
  FUNNEL_INSIGHTS_CONFIG,
  type HealthStateConfig,
  // Types
  type HealthStatus,
  type HistogramThresholds,
  // Components
  InsightsBanner,
  type InsightsConfig,
  type MetricItem,
  MetricsGrid,
  RETENTION_INSIGHTS_CONFIG,
  type ThresholdRule,
  // Factory Functions
  createInsightsConfig,
  createRule,
} from "./insights"
