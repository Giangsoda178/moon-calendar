<!--
  @component GaugeChart
  Gauge/meter chart for displaying single metric against a scale.
  Perfect for KPI targets, progress meters, conversion rates.

  @example Simple usage
  ```svelte
  <GaugeChart value={67} />
  ```

  @example With thresholds and target
  ```svelte
  <GaugeChart
    value={67}
    target={80}
    thresholds={[
      { value: 30, color: 'var(--chart-5)' },
      { value: 60, color: 'var(--chart-4)' },
      { value: 100, color: 'var(--chart-1)' },
    ]}
  />
  ```
-->
<script lang="ts">
  import type { Snippet } from "svelte"
  import { cubicOut } from "svelte/easing"
  import { Tween } from "svelte/motion"

  import {
    DEFAULT_HEALTH_STATES,
    type HealthStatus,
    InsightsBanner,
    type MetricItem,
    MetricsGrid,
  } from "./insights"
  import { DEFAULT_CHART_COLORS, RETENTION_STATE_COLORS } from "./types"

  interface Threshold {
    value: number
    color: string
    label?: string
  }

  interface Props {
    /** Current value */
    value: number
    /** Minimum value (default: 0) */
    min?: number
    /** Maximum value (default: 100) */
    max?: number
    /** Target value (optional marker) */
    target?: number
    /** Threshold zones with colors */
    thresholds?: Threshold[]
    /** Start angle in degrees (default: -135) */
    startAngle?: number
    /** End angle in degrees (default: 135) */
    endAngle?: number
    /** Arc thickness (default: 20) */
    thickness?: number
    /** Show tick marks */
    showTicks?: boolean
    /** Animate value changes */
    animated?: boolean
    /** Custom value label snippet */
    valueLabel?: Snippet<
      [{ value: number; percentage: number; min: number; max: number }]
    >
    /** Show insights panel below chart */
    showInsights?: boolean
    /** CSS class for container */
    class?: string
  }

  let {
    value,
    min = 0,
    max = 100,
    target,
    thresholds,
    startAngle = -135,
    endAngle = 135,
    thickness = 20,
    showTicks = false,
    animated = true,
    valueLabel: customValueLabel,
    showInsights = false,
    class: className,
  }: Props = $props()

  // Calculate percentage
  const targetPercentage = $derived(
    Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)),
  )

  // Tween class for smooth animation (Svelte 5 API)
  // Note: animated is intentionally captured at mount - Tween duration doesn't need to be reactive
  const animatedPercentage = new Tween(0, {
    duration: animated ? 700 : 0,
    easing: cubicOut,
  })

  // Update tween target when value changes
  $effect(() => {
    animatedPercentage.target = targetPercentage
  })

  // SVG dimensions
  const size = 200
  const center = size / 2
  // Note: thickness is intentionally captured at mount - SVG geometry doesn't need to be reactive
  const radius = (size - thickness) / 2 - 10

  // Convert angle to radians
  function toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180
  }

  // Calculate point on arc
  function pointOnArc(
    angle: number,
    r: number = radius,
  ): { x: number; y: number } {
    const rad = toRadians(angle - 90) // Offset by -90 to start from top
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    }
  }

  // Create arc path
  function describeArc(
    startAngleDeg: number,
    endAngleDeg: number,
    r: number = radius,
  ): string {
    const start = pointOnArc(startAngleDeg, r)
    const end = pointOnArc(endAngleDeg, r)
    const largeArc = Math.abs(endAngleDeg - startAngleDeg) > 180 ? 1 : 0
    const sweep = endAngleDeg > startAngleDeg ? 1 : 0

    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`
  }

  // Calculate value angle
  const totalAngle = $derived(endAngle - startAngle)

  // Background arc path
  const backgroundPath = $derived(describeArc(startAngle, endAngle))

  // Arc length for stroke-dasharray animation
  const totalArcLength = $derived(
    (Math.abs(totalAngle) / 360) * 2 * Math.PI * radius,
  )
  const valueArcLength = $derived(
    (animatedPercentage.current / 100) * totalArcLength,
  )

  // Get color based on value and thresholds
  const valueColor = $derived.by(() => {
    if (!thresholds || thresholds.length === 0) {
      return DEFAULT_CHART_COLORS[0]
    }
    // Find the threshold zone the value falls into
    for (const t of thresholds) {
      if (value <= t.value) {
        return t.color
      }
    }
    return thresholds[thresholds.length - 1]?.color ?? DEFAULT_CHART_COLORS[0]
  })

  // Generate threshold arcs
  const thresholdArcs = $derived.by(() => {
    if (!thresholds || thresholds.length === 0) return []

    const arcs: Array<{ path: string; color: string }> = []
    let prevValue = min

    for (const t of thresholds) {
      const startPct = ((prevValue - min) / (max - min)) * 100
      const endPct = ((t.value - min) / (max - min)) * 100
      const arcStart = startAngle + (startPct / 100) * totalAngle
      const arcEnd = startAngle + (endPct / 100) * totalAngle

      arcs.push({
        path: describeArc(arcStart, arcEnd),
        color: t.color,
      })

      prevValue = t.value
    }

    return arcs
  })

  // Target marker position
  const targetAngle = $derived(
    target !== undefined
      ? startAngle + ((((target - min) / (max - min)) * 100) / 100) * totalAngle
      : null,
  )
  const targetPoint = $derived(
    targetAngle !== null ? pointOnArc(targetAngle) : null,
  )

  // Tick marks
  const ticks = $derived.by(() => {
    if (!showTicks) return []
    const tickCount = 5
    const tickMarks: Array<{
      angle: number
      label: string
      point: { x: number; y: number }
    }> = []

    for (let i = 0; i <= tickCount; i++) {
      const pct = i / tickCount
      const tickValue = min + pct * (max - min)
      const tickAngle = startAngle + pct * totalAngle
      tickMarks.push({
        angle: tickAngle,
        label: Math.round(tickValue).toString(),
        point: pointOnArc(tickAngle, radius + 15),
      })
    }

    return tickMarks
  })

  // Compute gauge insights
  const gaugeInsights = $derived(() => {
    const range = max - min
    const pct = ((value - min) / range) * 100

    // Determine zone from existing thresholds
    let currentZone = "Normal"
    let healthStatus: HealthStatus = "healthy"

    if (thresholds?.length) {
      const sorted = [...thresholds].sort((a, b) => a.value - b.value)
      for (const t of sorted) {
        if (value >= t.value) {
          currentZone = t.label ?? "Threshold"
          // Map threshold color to health status
          if (
            t.color?.includes("red") ||
            t.color === RETENTION_STATE_COLORS.lost ||
            t.color === "var(--chart-5)"
          ) {
            healthStatus = "critical"
          } else if (
            t.color?.includes("amber") ||
            t.color?.includes("yellow") ||
            t.color === RETENTION_STATE_COLORS.lapsing ||
            t.color === "var(--chart-4)"
          ) {
            healthStatus = "warning"
          }
        }
      }
    }

    // Find next threshold
    const nextThreshold = thresholds?.find((t) => t.value > value)
    const distanceToNext = nextThreshold ? nextThreshold.value - value : null

    const priorityAction =
      healthStatus === "critical"
        ? "Value exceeds critical threshold"
        : healthStatus === "warning"
          ? `Value approaching critical zone${distanceToNext ? ` (${distanceToNext.toFixed(1)} to next)` : ""}`
          : "Value within normal range"

    return {
      value,
      percentage: pct,
      currentZone,
      distanceToNext,
      healthStatus,
      priorityAction,
      min,
      max,
    }
  })
</script>

<div data-chart class="flex w-full flex-col items-center {className}">
  <svg viewBox="0 0 {size} {size}" class="h-auto w-full max-w-[200px]">
    <!-- Background arc or threshold arcs -->
    {#if thresholds && thresholds.length > 0}
      {#each thresholdArcs as arc, i (i)}
        <path
          d={arc.path}
          fill="none"
          stroke={arc.color}
          stroke-width={thickness}
          stroke-linecap="round"
          opacity="0.2"
        />
      {/each}
    {:else}
      <path
        d={backgroundPath}
        fill="none"
        stroke="currentColor"
        stroke-width={thickness}
        stroke-linecap="round"
        class="text-muted opacity-20"
      />
    {/if}

    <!-- Value arc - uses stroke-dasharray for smooth animation -->
    <path
      d={backgroundPath}
      fill="none"
      stroke={valueColor}
      stroke-width={thickness}
      stroke-linecap="round"
      stroke-dasharray="{valueArcLength} {totalArcLength}"
    />

    <!-- Target marker -->
    {#if targetPoint}
      <circle
        cx={targetPoint.x}
        cy={targetPoint.y}
        r="6"
        fill="currentColor"
        class="text-foreground"
      />
      <circle
        cx={targetPoint.x}
        cy={targetPoint.y}
        r="3"
        fill="currentColor"
        class="text-background"
      />
    {/if}

    <!-- Tick marks -->
    {#if showTicks}
      {#each ticks as tick, i (i)}
        <text
          x={tick.point.x}
          y={tick.point.y}
          text-anchor="middle"
          dominant-baseline="middle"
          class="fill-muted-foreground text-[10px]"
        >
          {tick.label}
        </text>
      {/each}
    {/if}

    <!-- Center value display -->
    <g transform="translate({center}, {center + 10})">
      {#if customValueLabel}
        <foreignObject x="-50" y="-30" width="100" height="60">
          <div class="flex h-full w-full items-center justify-center">
            {@render customValueLabel({
              value,
              percentage: targetPercentage,
              min,
              max,
            })}
          </div>
        </foreignObject>
      {:else}
        <text
          text-anchor="middle"
          dominant-baseline="middle"
          class="fill-foreground text-3xl font-bold tabular-nums"
        >
          {Math.round(value)}
        </text>
        <text
          y="24"
          text-anchor="middle"
          dominant-baseline="middle"
          class="fill-muted-foreground text-xs"
        >
          of {target}
        </text>
      {/if}
    </g>
  </svg>

  <!-- Insights Panel -->
  {#if showInsights}
    {@const insightData = gaugeInsights()}
    {@const healthColor =
      DEFAULT_HEALTH_STATES[insightData.healthStatus]?.color ??
      DEFAULT_HEALTH_STATES.healthy.color}
    {@const gaugeMetrics: MetricItem[] = [
      {
        label: "Current",
        value: insightData.value.toLocaleString(),
        color: healthColor,
      },
      {
        label: "Percentage",
        value: insightData.percentage.toFixed(1),
        unit: "%",
      },
      {
        label: "Zone",
        value: insightData.currentZone,
      },
      {
        label: "Range",
        value: `${insightData.min} - ${insightData.max}`,
      },
    ]}
    <div class="mt-4 w-full space-y-3 border-t pt-4">
      <InsightsBanner
        status={insightData.healthStatus}
        message={insightData.priorityAction}
      />
      <MetricsGrid metrics={gaugeMetrics} />
    </div>
  {/if}
</div>
