/**
 * Chart Types - Unified Svelte 5 API
 * Typed snippet parameters for IDE autocomplete and type safety.
 */
import type { Snippet } from "svelte"

// =============================================================================
// Core Types
// =============================================================================

/** Generic data point constraint - accepts any object with indexable properties */
export type ChartDataPoint = Record<string, unknown>

/** Default chart colors from CSS variables */
export const DEFAULT_CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

/** Chart padding configuration */
export interface ChartPadding {
  left: number
  right: number
  top: number
  bottom: number
}

// =============================================================================
// Auto-Padding Utilities
// =============================================================================

/** Pixels per character for label width estimation (~7px for typical chart fonts) */
const PX_PER_CHAR = 7
/** Base padding buffer in pixels */
const PADDING_BUFFER = 12

/**
 * Calculate left padding based on max Y-axis label length (for numeric values)
 * @param data - Chart data array
 * @param key - Key to extract numeric values from
 * @returns Calculated left padding in pixels
 */
export function calcLeftPadding<T extends object>(
  data: T[],
  key: keyof T | undefined,
): number {
  if (!data.length || key === undefined) return 40
  const maxVal = Math.max(
    ...data.map((d) => {
      const v = d[key]
      return typeof v === "number" ? v : 0
    }),
  )
  const maxLen = maxVal.toLocaleString().length
  return maxLen * PX_PER_CHAR + PADDING_BUFFER
}

/**
 * Calculate left padding for horizontal bar charts based on category label length
 * @param data - Chart data array
 * @param key - Key to extract category labels from
 * @param maxChars - Max characters to display (truncation limit)
 * @returns Calculated left padding in pixels
 */
export function calcHorizontalLeftPadding<T extends object>(
  data: T[],
  key: keyof T | undefined,
  maxChars = 10,
): number {
  if (!data.length || key === undefined) return 56
  const maxLen = Math.min(
    Math.max(...data.map((d) => String(d[key] ?? "").length)),
    maxChars,
  )
  return maxLen * PX_PER_CHAR + PADDING_BUFFER + 8
}

/**
 * Calculate bottom padding based on X-axis label length
 * @param data - Chart data array
 * @param key - Key to extract category labels from
 * @returns Calculated bottom padding in pixels
 */
export function calcBottomPadding<T extends object>(
  data: T[],
  key: keyof T | undefined,
): number {
  if (!data.length || key === undefined) return 24
  const maxLen = Math.max(...data.map((d) => String(d[key] ?? "").length))
  // Base 20px + extra for longer labels
  return maxLen > 5 ? 28 : 24
}

/**
 * Unified padding calculation
 */
export function calcPadding<T extends object>(
  data: T[],
  options: {
    yKey?: keyof T
    xKey?: keyof T
    horizontal?: boolean
  },
): ChartPadding {
  const { yKey, xKey, horizontal = false } = options

  return {
    left:
      horizontal && xKey
        ? calcHorizontalLeftPadding(data, xKey)
        : yKey
          ? calcLeftPadding(data, yKey)
          : 40,
    right: 12,
    top: 8,
    bottom: xKey && !horizontal ? calcBottomPadding(data, xKey) : 20,
  }
}

// =============================================================================
// Unified Snippet Parameters
// =============================================================================

/** Tooltip params - unified for ALL charts */
export interface TooltipParams<T> {
  data: T
  index: number
  color?: string
  percentage?: number // For pie/funnel
  value?: number // For pie/funnel
}

/** Legend item */
export interface LegendItem {
  key: string
  label: string
  color: string
  active: boolean
}

/** Legend params - unified for ALL charts with toggleable legends */
export interface LegendParams {
  items: LegendItem[]
  toggle: (key: string) => void
}

// =============================================================================
// Typed Snippet Types
// =============================================================================

export type TooltipSnippet<T> = Snippet<[TooltipParams<T>]>
export type LegendSnippet = Snippet<[LegendParams]>

// =============================================================================
// Chart-Specific Data Types
// =============================================================================

/** Funnel chart data point */
export interface FunnelDataPoint {
  stage: string
  value: number
  percentage?: number
  color?: string
}

/** Gauge chart threshold */
export interface GaugeThreshold {
  value: number
  color: string
  label?: string
}

/** Sparkline data - simple array or objects */
export type SparklineData = number[] | Array<{ value: number; date?: string }>

// =============================================================================
// Histogram Types
// =============================================================================

/** Histogram bin result */
export interface HistogramBin {
  x0: number
  x1: number
  count: number
  values: number[]
}

// =============================================================================
// Calendar Types
// =============================================================================

/** Calendar chart data point */
export interface CalendarDataPoint {
  date: Date | string
  value: number
  [key: string]: unknown
}

/** Color scheme options for calendar */
export type CalendarColorScheme = "blues" | "greens" | "purples" | string[]

// =============================================================================
// Hierarchical Chart Types
// =============================================================================

/** Flat node with parent reference for treemap */
export interface FlatNode {
  id: string
  parent?: string | null
  name?: string
  value?: number
  [key: string]: unknown
}

/** Nested node structure for treemap */
export interface NestedNode {
  name: string
  value?: number
  children?: NestedNode[]
  [key: string]: unknown
}

// =============================================================================
// Reference Lines
// =============================================================================

/** Reference line for charts (histogram, etc.) */
export interface ReferenceLine {
  value: number
  label?: string
  color?: string
}

// =============================================================================
// Retention Lifecycle Types
// =============================================================================

/** Retention lifecycle states */
export type RetentionState =
  | "potential"
  | "new"
  | "active"
  | "lapsing"
  | "lapsed"
  | "lost"

/** Color mapping for retention states (semantic) */
export const RETENTION_STATE_COLORS: Record<RetentionState, string> = {
  potential: "#94a3b8", // slate-400
  new: "#3b82f6", // blue-500
  active: "#10b981", // emerald-500
  lapsing: "#f59e0b", // amber-500
  lapsed: "#f97316", // orange-500
  lost: "#ef4444", // red-500
} as const

/** Timeline data point for single user view */
export interface RetentionTimelineDataPoint {
  date: Date | string
  state: RetentionState
  daysInState: number
  metadata?: Record<string, unknown>
}

/** Sankey node for retention flow */
export interface RetentionSankeyNode {
  id: RetentionState
  label?: string
  value?: number
}

/** Sankey link for retention transitions */
export interface RetentionSankeyLink {
  source: RetentionState
  target: RetentionState
  value: number
}

/** Sankey data structure */
export interface RetentionSankeyData {
  nodes: RetentionSankeyNode[]
  links: RetentionSankeyLink[]
}
