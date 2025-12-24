/**
 * Chart Context for Svelte 5
 * Shares chart state and scales across components via Svelte context.
 */
import { getContext, setContext } from "svelte"

export interface ChartContextValue<T = unknown> {
  // Data
  data: T[]

  // Interaction state
  hoveredIndex: number | null
  selectedIndices: Set<number>

  // Computed from LayerChart
  xScale: unknown
  yScale: unknown
  width: number
  height: number
}

const CHART_CONTEXT_KEY = Symbol("chart-context")

export function setChartContext<T>(value: ChartContextValue<T>): void {
  setContext(CHART_CONTEXT_KEY, value)
}

export function getChartContext<T>(): ChartContextValue<T> {
  return getContext(CHART_CONTEXT_KEY)
}
