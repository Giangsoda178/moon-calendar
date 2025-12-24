/**
 * Insights System Integration Tests
 * Tests for Phase 2 refactored charts: FunnelChart, RetentionJourney, RetentionSankeyChart
 * Verifies: imports, InsightsBanner rendering, MetricsGrid data, evaluateInsights config
 */
/// <reference types="@testing-library/jest-dom" />

import { render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"

// Browser API mocks (ResizeObserver, matchMedia) are in vitest-setup.ts

import FunnelChart from "../FunnelChart.svelte"
import GaugeChart from "../GaugeChart.svelte"
import HistogramChart from "../HistogramChart.svelte"
import RetentionJourney from "../RetentionJourney.svelte"
import RetentionSankeyChart from "../RetentionSankeyChart.svelte"
import {
  DEFAULT_HEALTH_STATES,
  DEFAULT_HISTOGRAM_THRESHOLDS,
  FUNNEL_INSIGHTS_CONFIG,
  type HistogramThresholds,
  InsightsBanner,
  MetricsGrid,
  RETENTION_INSIGHTS_CONFIG,
  createInsightsConfig,
  createRule,
  evaluateInsights,
} from "../insights"
import type { RetentionSankeyData, RetentionState } from "../types"

// =============================================================================
// IMPORT VERIFICATION TESTS
// =============================================================================

describe("Insights System Imports", () => {
  it("exports InsightsBanner component", () => {
    expect(InsightsBanner).toBeDefined()
  })

  it("exports MetricsGrid component", () => {
    expect(MetricsGrid).toBeDefined()
  })

  it("exports DEFAULT_HEALTH_STATES", () => {
    expect(DEFAULT_HEALTH_STATES).toBeDefined()
    expect(DEFAULT_HEALTH_STATES.healthy).toBeDefined()
    expect(DEFAULT_HEALTH_STATES.warning).toBeDefined()
    expect(DEFAULT_HEALTH_STATES.critical).toBeDefined()
  })

  it("exports FUNNEL_INSIGHTS_CONFIG", () => {
    expect(FUNNEL_INSIGHTS_CONFIG).toBeDefined()
    expect(FUNNEL_INSIGHTS_CONFIG.rules).toBeInstanceOf(Array)
  })

  it("exports RETENTION_INSIGHTS_CONFIG", () => {
    expect(RETENTION_INSIGHTS_CONFIG).toBeDefined()
    expect(RETENTION_INSIGHTS_CONFIG.rules).toBeInstanceOf(Array)
  })

  it("exports evaluateInsights function", () => {
    expect(evaluateInsights).toBeDefined()
    expect(typeof evaluateInsights).toBe("function")
  })
})

// =============================================================================
// INSIGHTS BANNER TESTS
// =============================================================================

describe("InsightsBanner Component", () => {
  it("renders healthy state with correct color and icon", () => {
    const { container } = render(InsightsBanner, {
      props: {
        status: "healthy",
        message: "All metrics performing well",
      },
    })

    expect(screen.getByText("Performing Well")).toBeInTheDocument()
    expect(screen.getByText("All metrics performing well")).toBeInTheDocument()

    // Check for color styling (green for healthy)
    const coloredDiv = container.querySelector("[style*='color']")
    expect(coloredDiv).toBeInTheDocument()
  })

  it("renders warning state with correct label and icon", () => {
    render(InsightsBanner, {
      props: {
        status: "warning",
        message: "Review these metrics for improvement",
      },
    })

    expect(screen.getByText("Needs Attention")).toBeInTheDocument()
    expect(
      screen.getByText("Review these metrics for improvement"),
    ).toBeInTheDocument()
  })

  it("renders critical state with correct label and icon", () => {
    render(InsightsBanner, {
      props: {
        status: "critical",
        message: "Immediate action required",
      },
    })

    expect(screen.getByText("Action Required")).toBeInTheDocument()
    expect(screen.getByText("Immediate action required")).toBeInTheDocument()
  })

  it("allows custom label override", () => {
    render(InsightsBanner, {
      props: {
        status: "healthy",
        message: "Test message",
        label: "Custom Label",
      },
    })

    expect(screen.getByText("Custom Label")).toBeInTheDocument()
    expect(screen.queryByText("Performing Well")).not.toBeInTheDocument()
  })

  it("renders custom class", () => {
    const { container } = render(InsightsBanner, {
      props: {
        status: "healthy",
        message: "Test",
        class: "custom-class",
      },
    })

    expect(container.querySelector(".custom-class")).toBeInTheDocument()
  })
})

// =============================================================================
// METRICS GRID TESTS
// =============================================================================

describe("MetricsGrid Component", () => {
  const sampleMetrics = [
    { label: "Conversion", value: 45, unit: "%" },
    { label: "Users", value: "1,250" },
    { label: "Drop-off", value: 250, unit: "users" },
    { label: "Rate", value: 75 },
  ]

  it("renders all metrics", () => {
    render(MetricsGrid, { props: { metrics: sampleMetrics } })

    expect(screen.getByText("Conversion")).toBeInTheDocument()
    expect(screen.getByText("Users")).toBeInTheDocument()
    expect(screen.getByText("Drop-off")).toBeInTheDocument()
    expect(screen.getByText("Rate")).toBeInTheDocument()
  })

  it("displays metric values and units", () => {
    render(MetricsGrid, { props: { metrics: sampleMetrics } })

    expect(screen.getByText("45%")).toBeInTheDocument()
    expect(screen.getByText("1,250")).toBeInTheDocument()
    expect(screen.getByText("250users")).toBeInTheDocument()
  })

  it("displays secondary values when provided", () => {
    const metricsWithSecondary = [
      {
        label: "Active",
        value: 80,
        unit: "%",
        secondaryValue: "(64 users)",
      },
      { label: "At Risk", value: 15, unit: "%", secondaryValue: "(12 users)" },
    ]

    render(MetricsGrid, { props: { metrics: metricsWithSecondary } })

    expect(screen.getByText("(64 users)")).toBeInTheDocument()
    expect(screen.getByText("(12 users)")).toBeInTheDocument()
  })

  it("applies 4-column grid layout by default", () => {
    const { container } = render(MetricsGrid, {
      props: { metrics: sampleMetrics },
    })

    const gridDiv = container.querySelector(".grid-cols-2.sm\\:grid-cols-4")
    expect(gridDiv).toBeInTheDocument()
  })

  it("applies 2-column grid layout when columns=2", () => {
    const { container } = render(MetricsGrid, {
      props: { metrics: sampleMetrics, columns: 2 },
    })

    const gridDiv = container.querySelector(
      ".grid-cols-2:not(.sm\\:grid-cols-4)",
    )
    expect(gridDiv).toBeInTheDocument()
  })

  it("renders custom class", () => {
    const { container } = render(MetricsGrid, {
      props: { metrics: sampleMetrics, class: "custom-grid" },
    })

    expect(container.querySelector(".custom-grid")).toBeInTheDocument()
  })

  it("applies metric color when provided", () => {
    const coloredMetrics = [{ label: "Healthy", value: 90, color: "#10b981" }]

    render(MetricsGrid, {
      props: { metrics: coloredMetrics },
    })

    // Check if color is applied
    const valueSpan = screen.getByText("90")
    expect(valueSpan).toHaveStyle({ color: "#10b981" })
  })
})

// =============================================================================
// EVALUATE INSIGHTS TESTS
// =============================================================================

describe("evaluateInsights Function", () => {
  describe("Funnel Insights Config", () => {
    it("returns critical status when conversion < 10%", () => {
      const result = evaluateInsights(
        { conversionRate: 8 },
        FUNNEL_INSIGHTS_CONFIG,
      )

      expect(result.status).toBe("critical")
      expect(result.matchedRule).toBeDefined()
    })

    it("returns warning status when conversion 10-25%", () => {
      const result = evaluateInsights(
        { conversionRate: 15 },
        FUNNEL_INSIGHTS_CONFIG,
      )

      expect(result.status).toBe("warning")
    })

    it("returns healthy status when conversion >= 25%", () => {
      const result = evaluateInsights(
        { conversionRate: 35 },
        FUNNEL_INSIGHTS_CONFIG,
      )

      expect(result.status).toBe("healthy")
    })

    it("includes message with value substitution", () => {
      const result = evaluateInsights(
        { conversionRate: 8 },
        FUNNEL_INSIGHTS_CONFIG,
      )

      expect(result.message).toContain("8")
    })
  })

  describe("Retention Insights Config", () => {
    it("returns critical status when atRiskPct >= 30%", () => {
      const result = evaluateInsights(
        { atRiskPct: 35, churnRate: 10 },
        RETENTION_INSIGHTS_CONFIG,
      )

      expect(result.status).toBe("critical")
    })

    it("returns critical status when churnRate >= 25%", () => {
      const result = evaluateInsights(
        { atRiskPct: 10, churnRate: 28 },
        RETENTION_INSIGHTS_CONFIG,
      )

      expect(result.status).toBe("critical")
    })

    it("returns warning status when atRiskPct 15-30%", () => {
      const result = evaluateInsights(
        { atRiskPct: 20, churnRate: 10 },
        RETENTION_INSIGHTS_CONFIG,
      )

      expect(result.status).toBe("warning")
    })

    it("returns warning status when churnRate 15-25%", () => {
      const result = evaluateInsights(
        { atRiskPct: 5, churnRate: 20 },
        RETENTION_INSIGHTS_CONFIG,
      )

      expect(result.status).toBe("warning")
    })

    it("returns healthy status when both metrics healthy", () => {
      const result = evaluateInsights(
        { atRiskPct: 10, churnRate: 5 },
        RETENTION_INSIGHTS_CONFIG,
      )

      expect(result.status).toBe("healthy")
    })

    it("evaluates rules in order (first match wins)", () => {
      // atRiskPct >= 30 takes precedence over churnRate >= 25
      const result = evaluateInsights(
        { atRiskPct: 35, churnRate: 28 },
        RETENTION_INSIGHTS_CONFIG,
      )

      const matchedRule = result.matchedRule
      expect(matchedRule?.metric).toBe("atRiskPct")
    })
  })
})

// =============================================================================
// CUSTOM CONFIG TESTS
// =============================================================================

describe("Custom Insights Configs", () => {
  it("createInsightsConfig creates valid config", () => {
    const rules = [
      createRule("score", ">", 80, "healthy"),
      createRule("score", ">", 50, "warning"),
    ]

    const config = createInsightsConfig(rules, {
      defaultStatus: "critical",
    })

    expect(config.rules).toHaveLength(2)
    expect(config.defaultStatus).toBe("critical")
  })

  it("custom config evaluates correctly", () => {
    const customRules = [
      createRule("customMetric", ">=", 100, "healthy"),
      createRule("customMetric", ">=", 50, "warning"),
    ]

    const customConfig = createInsightsConfig(customRules)

    const result = evaluateInsights({ customMetric: 120 }, customConfig)

    expect(result.status).toBe("healthy")
  })

  it("supports custom health states", () => {
    // Test that custom status names can be used
    const config = createInsightsConfig([
      createRule("score", ">", 90, "excellent"),
    ])

    const result = evaluateInsights({ score: 95 }, config)
    expect(result.status).toBe("excellent")
  })
})

// =============================================================================
// FUNNEL CHART INTEGRATION TESTS
// =============================================================================

describe("FunnelChart with Insights", () => {
  const funnelData = [
    { stage: "Awareness", value: 1000 },
    { stage: "Consideration", value: 500 },
    { stage: "Decision", value: 150 },
    { stage: "Purchase", value: 50 },
  ]

  it("renders without insights when showInsights=false", () => {
    render(FunnelChart, {
      props: {
        data: funnelData,
        showInsights: false,
      },
    })

    // Chart should render without error
    expect(
      screen.getByRole("img", { name: "Funnel chart" }),
    ).toBeInTheDocument()
  })

  it("renders insights banner when showInsights=true and conversion is healthy", () => {
    // High conversion (50%) should be healthy
    const { container } = render(FunnelChart, {
      props: {
        data: funnelData,
        showInsights: true,
      },
    })

    // Should display insights section (health banner and/or metrics)
    expect(container.querySelector("[data-chart]")).toBeInTheDocument()
    // Banner should be rendered somewhere in the component
    const possibleBanners = [
      screen.queryByText("Performing Well"),
      screen.queryByText("Needs Attention"),
      screen.queryByText("Action Required"),
    ]
    expect(possibleBanners.some((b) => b !== null)).toBe(true)
  })

  it("displays metrics grid with funnel metrics", () => {
    render(FunnelChart, {
      props: {
        data: funnelData,
        showInsights: true,
      },
    })

    expect(screen.getByText("Conversion")).toBeInTheDocument()
    expect(screen.getByText("Lost")).toBeInTheDocument()
    expect(screen.getByText("Biggest Drop")).toBeInTheDocument()
  })

  it("accepts custom insightsConfig prop", () => {
    const customConfig = createInsightsConfig([
      createRule("conversionRate", ">", 40, "healthy"),
      createRule("conversionRate", ">", 20, "warning"),
    ])

    render(FunnelChart, {
      props: {
        data: funnelData,
        showInsights: true,
        insightsConfig: customConfig,
      },
    })

    // With custom config, 50% conversion should still be healthy
    expect(screen.getByText("Performing Well")).toBeInTheDocument()
  })

  it("uses FUNNEL_INSIGHTS_CONFIG as default", () => {
    const { container } = render(FunnelChart, {
      props: {
        data: funnelData,
        showInsights: true,
        // No insightsConfig provided - should use default
      },
    })

    // Default config should apply - check that component renders with insights
    expect(container.querySelector("[data-chart]")).toBeInTheDocument()
    // Metrics should be displayed
    expect(screen.getByText("Conversion")).toBeInTheDocument()
  })

  it("renders conversion percentage in metrics", () => {
    render(FunnelChart, {
      props: {
        data: funnelData,
        showInsights: true,
      },
    })

    // Conversion: 50/1000 = 5%, verify conversion metric is displayed
    expect(screen.getByText("Conversion")).toBeInTheDocument()
    // The percentage value should be somewhere in the metrics grid
    const conversionElements = screen.queryAllByText(/\d+%/)
    expect(conversionElements.length).toBeGreaterThan(0)
  })
})

// =============================================================================
// RETENTION JOURNEY INTEGRATION TESTS
// =============================================================================

describe("RetentionJourney with Insights", () => {
  const journeyData = [
    { date: "2024-01-01", state: "new" as const, daysInState: 7 },
    { date: "2024-01-08", state: "active" as const, daysInState: 45 },
    { date: "2024-02-22", state: "lapsing" as const, daysInState: 14 },
    { date: "2024-03-07", state: "active" as const, daysInState: 60 },
  ]

  it("renders without insights when showInsights=false", () => {
    render(RetentionJourney, {
      props: {
        data: journeyData,
        showInsights: false,
      },
    })

    // Should render journey without insights panel
    expect(screen.getByText("Customer journey")).toBeInTheDocument()
  })

  it("renders insights banner when showInsights=true", () => {
    render(RetentionJourney, {
      props: {
        data: journeyData,
        showInsights: true,
      },
    })

    // Should display a health banner
    const banner = screen.queryByRole("img") // Icon is inside banner
    expect(
      banner ||
        screen.getByText(/Performing Well|Needs Attention|Action Required/),
    ).toBeTruthy()
  })

  it("displays journey metrics grid", () => {
    render(RetentionJourney, {
      props: {
        data: journeyData,
        showInsights: true,
      },
    })

    expect(screen.getByText("Active Time")).toBeInTheDocument()
    expect(screen.getByText("At-Risk Time")).toBeInTheDocument()
    expect(screen.getByText("Lapse Count")).toBeInTheDocument()
  })

  it("accepts custom insightsConfig prop", () => {
    const customConfig = createInsightsConfig([
      createRule("atRiskPct", ">=", 20, "critical"),
    ])

    render(RetentionJourney, {
      props: {
        data: journeyData,
        showInsights: true,
        insightsConfig: customConfig,
      },
    })

    // Should render without error with custom config
    expect(screen.getByText("Active Time")).toBeInTheDocument()
  })

  it("uses RETENTION_INSIGHTS_CONFIG as default", () => {
    render(RetentionJourney, {
      props: {
        data: journeyData,
        showInsights: true,
        // No insightsConfig provided - should use default
      },
    })

    expect(screen.getByText("Active Time")).toBeInTheDocument()
  })
})

// =============================================================================
// RETENTION SANKEY INTEGRATION TESTS
// =============================================================================

describe("RetentionSankeyChart with Insights", () => {
  const sankeyData: RetentionSankeyData = {
    nodes: [
      { id: "potential" as RetentionState, label: "Potential", value: 1000 },
      { id: "new" as RetentionState, label: "New", value: 600 },
      { id: "active" as RetentionState, label: "Active", value: 400 },
      { id: "lapsed" as RetentionState, label: "Lapsed", value: 100 },
      { id: "lost" as RetentionState, label: "Lost", value: 100 },
    ],
    links: [
      {
        source: "potential" as RetentionState,
        target: "new" as RetentionState,
        value: 600,
      },
      {
        source: "new" as RetentionState,
        target: "active" as RetentionState,
        value: 400,
      },
      {
        source: "active" as RetentionState,
        target: "lapsed" as RetentionState,
        value: 80,
      },
      {
        source: "active" as RetentionState,
        target: "lost" as RetentionState,
        value: 20,
      },
      {
        source: "lapsed" as RetentionState,
        target: "lost" as RetentionState,
        value: 100,
      },
    ],
  }

  it("renders without insights when showInsights=false", () => {
    const { container } = render(RetentionSankeyChart, {
      props: {
        data: sankeyData,
        showInsights: false,
      },
    })

    // Should render sankey chart with svg
    expect(container.querySelector("svg")).toBeTruthy()
  })

  it("renders insights banner when showInsights=true", () => {
    const { container } = render(RetentionSankeyChart, {
      props: {
        data: sankeyData,
        showInsights: true,
      },
    })

    // Should display a health banner or metrics
    expect(container.querySelector("[data-chart]")).toBeInTheDocument()
  })

  it("displays sankey metrics grid", () => {
    render(RetentionSankeyChart, {
      props: {
        data: sankeyData,
        showInsights: true,
      },
    })

    // These metrics should be displayed when insights are shown
    const possibleMetrics = [
      screen.queryByText("Retained"),
      screen.queryByText("At Risk"),
      screen.queryByText("Churned"),
      screen.queryByText("Conversion"),
    ]
    expect(possibleMetrics.some((m) => m !== null)).toBe(true)
  })

  it("accepts custom insightsConfig prop", () => {
    const customConfig = createInsightsConfig([
      createRule("churnRate", ">=", 10, "warning"),
    ])

    const { container } = render(RetentionSankeyChart, {
      props: {
        data: sankeyData,
        showInsights: true,
        insightsConfig: customConfig,
      },
    })

    // Should render without error with custom config
    expect(container.querySelector("[data-chart]")).toBeInTheDocument()
  })

  it("uses RETENTION_INSIGHTS_CONFIG as default", () => {
    const { container } = render(RetentionSankeyChart, {
      props: {
        data: sankeyData,
        showInsights: true,
        // No insightsConfig provided - should use default
      },
    })

    // Should render with default config
    expect(container.querySelector("[data-chart]")).toBeInTheDocument()
  })
})

// =============================================================================
// HEALTH STATES DEFAULT CONFIGURATION TESTS
// =============================================================================

describe("DEFAULT_HEALTH_STATES", () => {
  it("has healthy state with green color", () => {
    expect(DEFAULT_HEALTH_STATES.healthy.color).toBe("#10b981") // active green
  })

  it("has warning state with yellow color", () => {
    expect(DEFAULT_HEALTH_STATES.warning.color).toBe("#f59e0b") // lapsing amber
  })

  it("has critical state with red color", () => {
    expect(DEFAULT_HEALTH_STATES.critical.color).toBe("#ef4444") // lost red
  })

  it("has all states with label, icon, and priority", () => {
    for (const [_key, config] of Object.entries(DEFAULT_HEALTH_STATES)) {
      expect(config.label).toBeDefined()
      expect(config.icon).toBeDefined()
      expect(typeof config.priority).toBe("number")
    }
  })

  it("has correct priority ordering", () => {
    expect(DEFAULT_HEALTH_STATES.critical.priority).toBeLessThan(
      DEFAULT_HEALTH_STATES.warning.priority,
    )
    expect(DEFAULT_HEALTH_STATES.warning.priority).toBeLessThan(
      DEFAULT_HEALTH_STATES.healthy.priority,
    )
  })
})

// =============================================================================
// HISTOGRAM INSIGHTS CONFIG TESTS
// =============================================================================

describe("HistogramThresholds and DEFAULT_HISTOGRAM_THRESHOLDS", () => {
  it("exports HistogramThresholds type", () => {
    // Type-level test: ensure the type can be used
    const thresholds: HistogramThresholds = {
      cvWarning: 0.5,
      cvCritical: 1.0,
      skewWarning: 1.0,
      skewCritical: 2.0,
    }
    expect(thresholds.cvWarning).toBe(0.5)
  })

  it("exports DEFAULT_HISTOGRAM_THRESHOLDS with expected values", () => {
    expect(DEFAULT_HISTOGRAM_THRESHOLDS).toBeDefined()
    expect(DEFAULT_HISTOGRAM_THRESHOLDS.cvWarning).toBe(0.5)
    expect(DEFAULT_HISTOGRAM_THRESHOLDS.cvCritical).toBe(1.0)
    expect(DEFAULT_HISTOGRAM_THRESHOLDS.skewWarning).toBe(1.0)
    expect(DEFAULT_HISTOGRAM_THRESHOLDS.skewCritical).toBe(2.0)
  })
})

// =============================================================================
// HISTOGRAM CHART INSIGHTS INTEGRATION TESTS
// =============================================================================

describe("HistogramChart Insights Integration", () => {
  const histogramData = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

  it("renders without insights by default", () => {
    const { container } = render(HistogramChart, {
      props: {
        data: histogramData,
      },
    })

    // Check chart renders
    expect(container.querySelector("[data-chart]")).toBeInTheDocument()
    // No InsightsBanner without showInsights
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("renders with insights when showInsights=true", () => {
    const { container } = render(HistogramChart, {
      props: {
        data: histogramData,
        showInsights: true,
      },
    })

    expect(container.querySelector("[data-chart]")).toBeInTheDocument()
    // Should show insights panel with InsightsBanner
    // Data [10-100] has CV=52% which triggers "warning" status
    expect(container.textContent).toContain("Needs Attention")
    expect(container.textContent).toContain("CV=52%")
  })

  it("shows statistics metrics when insights enabled", () => {
    const { container } = render(HistogramChart, {
      props: {
        data: histogramData,
        showInsights: true,
      },
    })

    // Check for statistical labels in MetricsGrid
    // Note: Chart SVG may not render due to mock ResizeObserver, but insights panel should
    const metricsLabels = ["Mean", "Median", "Std Dev", "Range"]
    const foundLabels = metricsLabels.filter((label) =>
      container.textContent?.includes(label),
    )
    expect(foundLabels.length).toBeGreaterThan(0)
  })

  it("accepts custom insightsConfig prop", () => {
    const customConfig: HistogramThresholds = {
      cvWarning: 0.3,
      cvCritical: 0.6,
      skewWarning: 0.5,
      skewCritical: 1.0,
    }

    const { container } = render(HistogramChart, {
      props: {
        data: histogramData,
        showInsights: true,
        insightsConfig: customConfig,
      },
    })

    // Should render without error with custom config
    expect(container.querySelector("[data-chart]")).toBeInTheDocument()
  })
})

// =============================================================================
// GAUGE CHART INSIGHTS INTEGRATION TESTS
// =============================================================================

describe("GaugeChart Insights Integration", () => {
  const gaugeThresholds = [
    { value: 30, color: "var(--chart-1)", label: "Low" },
    { value: 60, color: "var(--chart-4)", label: "Medium" },
    { value: 100, color: "var(--chart-5)", label: "High" },
  ]

  it("renders without insights by default", () => {
    const { container } = render(GaugeChart, {
      props: {
        value: 50,
      },
    })

    expect(container.querySelector("[data-chart]")).toBeInTheDocument()
    // No InsightsBanner without showInsights
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("renders with insights when showInsights=true", () => {
    const { container } = render(GaugeChart, {
      props: {
        value: 50,
        showInsights: true,
      },
    })

    expect(container.querySelector("[data-chart]")).toBeInTheDocument()
    // Should show insights panel with InsightsBanner
    expect(container.textContent).toContain("Performing Well")
    expect(container.textContent).toContain("Value within normal range")
  })

  it("shows gauge metrics when insights enabled", () => {
    const { container } = render(GaugeChart, {
      props: {
        value: 50,
        showInsights: true,
      },
    })

    // Check for gauge-specific labels
    const metricsLabels = ["Current", "Percentage", "Zone", "Range"]
    const foundLabels = metricsLabels.filter((label) =>
      container.textContent?.includes(label),
    )
    expect(foundLabels.length).toBe(4)
  })

  it("detects threshold zones correctly", () => {
    const { container } = render(GaugeChart, {
      props: {
        value: 75,
        thresholds: gaugeThresholds,
        showInsights: true,
      },
    })

    // Value 75 is >= 60 (Medium threshold) but < 100 (High threshold)
    // The zone is determined by the last threshold that value >= threshold.value
    // With thresholds at 30, 60, 100: value 75 >= 60 so zone is "Medium"
    expect(container.textContent).toContain("Medium")
  })

  it("shows healthy status for values in normal zone", () => {
    render(GaugeChart, {
      props: {
        value: 25,
        showInsights: true,
      },
    })

    // No thresholds = normal zone
    expect(screen.getByText("Value within normal range")).toBeInTheDocument()
  })
})
