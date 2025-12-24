/**
 * Insights Configuration System
 * Extensible, data-driven configuration for chart insights.
 * Designed for business customization and DB-driven rules via Inertia.
 */
import { AlertTriangle, CircleAlert, CircleCheck, Info } from "@lucide/svelte"
import type { Component } from "svelte"

import { RETENTION_STATE_COLORS } from "../types"

// =============================================================================
// EXTENSIBLE HEALTH STATUS SYSTEM
// =============================================================================

/** Base health status - extensible via string literal union */
export type HealthStatus =
  | "healthy"
  | "warning"
  | "critical"
  | "info"
  | (string & {})

/** Health state configuration - fully customizable per business need */
export interface HealthStateConfig {
  color: string
  label: string
  icon: Component
  /** Lower = more severe (for sorting/precedence) */
  priority: number
}

/** Default health states - business can override or extend */
export const DEFAULT_HEALTH_STATES: Record<string, HealthStateConfig> = {
  critical: {
    color: RETENTION_STATE_COLORS.lost, // #ef4444
    label: "Action Required",
    icon: CircleAlert,
    priority: 0,
  },
  warning: {
    color: RETENTION_STATE_COLORS.lapsing, // #f59e0b
    label: "Needs Attention",
    icon: AlertTriangle,
    priority: 1,
  },
  info: {
    color: "#3b82f6", // blue-500
    label: "For Your Information",
    icon: Info,
    priority: 2,
  },
  healthy: {
    color: RETENTION_STATE_COLORS.active, // #10b981
    label: "Performing Well",
    icon: CircleCheck,
    priority: 3,
  },
}

// =============================================================================
// ICON REGISTRY (for DB-driven configs)
// =============================================================================

/** Icon registry for mapping string keys to Lucide components */
export const INSIGHT_ICONS: Record<string, Component> = {
  alert: CircleAlert,
  warning: AlertTriangle,
  info: Info,
  check: CircleCheck,
}

/** Get icon from registry by key */
export function getIcon(key: string): Component {
  return INSIGHT_ICONS[key] ?? CircleCheck
}

// =============================================================================
// GENERIC THRESHOLD SYSTEM
// =============================================================================

/** Comparison operators for threshold rules */
export type ThresholdOperator = "<" | "<=" | ">" | ">=" | "==" | "!="

/** Generic threshold rule - works with ANY metric */
export interface ThresholdRule {
  /** Metric key to evaluate (e.g., "conversionRate", "atRiskPct") */
  metric: string
  /** Comparison operator */
  operator: ThresholdOperator
  /** Threshold value */
  value: number
  /** Resulting health status if rule matches */
  status: HealthStatus
  /** Optional message template (supports {metric}, {value} placeholders) */
  message?: string
}

/** Insights configuration - pass to any chart */
export interface InsightsConfig {
  /** Custom health states (merged with defaults) */
  healthStates?: Partial<Record<string, HealthStateConfig>>
  /** Threshold rules evaluated in order (first match wins) */
  rules: ThresholdRule[]
  /** Fallback status if no rules match */
  defaultStatus?: HealthStatus
}

// =============================================================================
// PRESET CONFIGS (Business can use as-is or customize)
// =============================================================================

export const FUNNEL_INSIGHTS_CONFIG: InsightsConfig = {
  rules: [
    {
      metric: "conversionRate",
      operator: "<",
      value: 10,
      status: "critical",
      message: "Conversion critically low at {value}%",
    },
    {
      metric: "conversionRate",
      operator: "<",
      value: 25,
      status: "warning",
      message: "Conversion below target at {value}%",
    },
  ],
  defaultStatus: "healthy",
}

export const RETENTION_INSIGHTS_CONFIG: InsightsConfig = {
  rules: [
    { metric: "atRiskPct", operator: ">=", value: 30, status: "critical" },
    { metric: "churnRate", operator: ">=", value: 25, status: "critical" },
    { metric: "atRiskPct", operator: ">=", value: 15, status: "warning" },
    { metric: "churnRate", operator: ">=", value: 15, status: "warning" },
  ],
  defaultStatus: "healthy",
}

// =============================================================================
// FACTORY FUNCTIONS
// =============================================================================

/** Create custom config for specific business needs */
export function createInsightsConfig(
  rules: ThresholdRule[],
  options?: {
    healthStates?: Partial<Record<string, HealthStateConfig>>
    defaultStatus?: HealthStatus
  },
): InsightsConfig {
  return {
    rules,
    healthStates: options?.healthStates,
    defaultStatus: options?.defaultStatus ?? "healthy",
  }
}

/** Create a threshold rule with type safety */
export function createRule(
  metric: string,
  operator: ThresholdOperator,
  value: number,
  status: HealthStatus,
  message?: string,
): ThresholdRule {
  return { metric, operator, value, status, message }
}

// =============================================================================
// HISTOGRAM INSIGHTS CONFIG
// =============================================================================

/** Histogram-specific thresholds for distribution analysis */
export interface HistogramThresholds {
  /** Coefficient of variation threshold for "spread" warning (default: 0.5 = 50%) */
  cvWarning: number
  /** Coefficient of variation threshold for "spread" critical (default: 1.0 = 100%) */
  cvCritical: number
  /** Skewness threshold for distribution warning (default: 1.0) */
  skewWarning: number
  /** Skewness threshold for distribution critical (default: 2.0) */
  skewCritical: number
}

export const DEFAULT_HISTOGRAM_THRESHOLDS: HistogramThresholds = {
  cvWarning: 0.5,
  cvCritical: 1.0,
  skewWarning: 1.0,
  skewCritical: 2.0,
}

// =============================================================================
// GAUGE INSIGHTS CONFIG
// =============================================================================

/** Gauge-specific configuration for zone insights */
export interface GaugeInsightConfig {
  /** Custom labels for each threshold zone */
  zoneLabels?: Record<string, string>
}

// =============================================================================
// METRICS DISPLAY
// =============================================================================

/** Metric item for display in MetricsGrid */
export interface MetricItem {
  label: string
  value: string | number
  unit?: string
  color?: string
  secondaryValue?: string
  secondaryLabel?: string
  /** Optional tooltip for additional context */
  tooltip?: string
  /** Optional trend indicator */
  trend?: "up" | "down" | "flat"
}
