/**
 * Health Status Evaluation Rune
 * Generic rule evaluator for insights system.
 */
import type {
  HealthStatus,
  InsightsConfig,
  ThresholdRule,
} from "./insights-config"

// =============================================================================
// EVALUATION RESULT
// =============================================================================

export interface EvaluationResult {
  status: HealthStatus
  matchedRule?: ThresholdRule
  message?: string
}

// =============================================================================
// GENERIC RULE EVALUATOR
// =============================================================================

/**
 * Evaluate a single threshold rule against a value
 */
function evaluateRule(value: number, rule: ThresholdRule): boolean {
  switch (rule.operator) {
    case "<":
      return value < rule.value
    case "<=":
      return value <= rule.value
    case ">":
      return value > rule.value
    case ">=":
      return value >= rule.value
    case "==":
      return value === rule.value
    case "!=":
      return value !== rule.value
    default:
      return false
  }
}

/**
 * Evaluate metrics against threshold rules
 * @param metrics - Object with metric values (e.g., { conversionRate: 15, atRiskPct: 20 })
 * @param config - InsightsConfig with rules and defaults
 * @returns Evaluation result with status and matched rule
 *
 * @example
 * const result = evaluateInsights(
 *   { conversionRate: 8 },
 *   FUNNEL_INSIGHTS_CONFIG
 * )
 * // result.status === 'critical'
 * // result.message === 'Conversion critically low at 8%'
 */
export function evaluateInsights(
  metrics: Record<string, number>,
  config: InsightsConfig,
): EvaluationResult {
  // Evaluate rules in order (first match wins)
  for (const rule of config.rules) {
    const metricValue = metrics[rule.metric]
    if (metricValue === undefined) continue

    const matched = evaluateRule(metricValue, rule)
    if (matched) {
      return {
        status: rule.status,
        matchedRule: rule,
        message: rule.message
          ? rule.message
              .replace("{metric}", rule.metric)
              .replace("{value}", String(metricValue))
          : undefined,
      }
    }
  }

  return { status: config.defaultStatus ?? "healthy" }
}

// =============================================================================
// SVELTE 5 RUNE FOR REACTIVE EVALUATION
// =============================================================================

/**
 * Reactive insights evaluation rune
 *
 * @example
 * const insights = useInsights(
 *   () => ({ conversionRate: data.conversion }),
 *   FUNNEL_INSIGHTS_CONFIG
 * )
 * // Use insights.status, insights.message in template
 */
export function useInsights(
  getMetrics: () => Record<string, number>,
  config: InsightsConfig,
): EvaluationResult {
  const result = $derived(evaluateInsights(getMetrics(), config))
  return result
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get the most severe status from multiple evaluations
 * @param results - Array of evaluation results
 * @param priorityMap - Optional custom priority map (lower = more severe)
 */
export function getMostSevereStatus(
  results: EvaluationResult[],
  priorityMap: Record<string, number> = {
    critical: 0,
    warning: 1,
    info: 2,
    healthy: 3,
  },
): EvaluationResult {
  if (results.length === 0) {
    return { status: "healthy" }
  }

  return results.reduce((most, current) => {
    const mostPriority = priorityMap[most.status] ?? 99
    const currentPriority = priorityMap[current.status] ?? 99
    return currentPriority < mostPriority ? current : most
  })
}

/**
 * Batch evaluate multiple metric sets against the same config
 */
export function batchEvaluate(
  metricSets: Record<string, number>[],
  config: InsightsConfig,
): EvaluationResult[] {
  return metricSets.map((metrics) => evaluateInsights(metrics, config))
}
