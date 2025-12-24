<!--
  @component HistogramChart
  Distribution visualization with automatic binning.
  Uses d3-array bin() for histogram calculation.

  @example Basic usage (array of numbers)
  ```svelte
  <HistogramChart data={[23, 45, 67, 34, 56, 78, 89, 12, 45, 67]} />
  ```

  @example With objects and value key
  ```svelte
  <HistogramChart data={orders} x="total" binCount={15} />
  ```

  @example With reference lines
  ```svelte
  <HistogramChart
    data={data}
    x="score"
    referenceLines={[{ value: 75, label: 'Passing' }]}
  />
  ```
-->
<script lang="ts">
  import { bin } from "d3-array"
  import { scaleLinear } from "d3-scale"
  import type { Snippet } from "svelte"

  import ChartTooltip from "./ChartTooltip.svelte"
  import {
    DEFAULT_HEALTH_STATES,
    DEFAULT_HISTOGRAM_THRESHOLDS,
    type HealthStatus,
    type HistogramThresholds,
    InsightsBanner,
    type MetricItem,
    MetricsGrid,
  } from "./insights"
  import { type ChartPadding, type TooltipParams } from "./types"

  type T = number | Record<string, unknown>

  interface HistBin {
    x0: number
    x1: number
    count: number
    values: number[]
    index: number
  }

  interface Props {
    /** Data array - numbers or objects with value key */
    data: T[]
    /** Key to extract value (if data is objects) */
    x?: string
    /** Number of bins (default: auto via Sturges) */
    binCount?: number
    /** Explicit bin thresholds */
    thresholds?: number[]
    /** Domain [min, max] (auto-detected if not set) */
    domain?: [number, number]
    /** Bar color */
    color?: string
    /** Reference lines at specific values */
    referenceLines?: { value: number; label?: string; color?: string }[]
    /** Custom padding */
    padding?: Partial<ChartPadding>
    /** Custom tooltip */
    tooltip?: Snippet<
      [TooltipParams<{ x0: number; x1: number; count: number }>]
    >
    /** Show insights panel below chart */
    showInsights?: boolean
    /** Custom insights thresholds */
    insightsConfig?: HistogramThresholds
    /** CSS class */
    class?: string
  }

  let {
    data,
    x,
    binCount,
    thresholds,
    domain,
    color = "var(--chart-1)",
    referenceLines = [],
    padding: customPadding,
    tooltip: customTooltip,
    showInsights = false,
    insightsConfig,
    class: className,
  }: Props = $props()

  // Container state
  let containerEl = $state<HTMLElement | null>(null)
  let containerWidth = $state(0)
  let containerHeight = $state(0)
  let hoveredIndex = $state<number | null>(null)

  // Observe container size
  $effect(() => {
    if (!containerEl) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerWidth = entry.contentRect.width
        containerHeight = entry.contentRect.height
      }
    })
    observer.observe(containerEl)
    return () => observer.disconnect()
  })

  // Extract numeric values
  const values = $derived(
    data.map((d) => (typeof d === "number" ? d : Number(d[x ?? "value"]) || 0)),
  )

  // Calculate domain
  const calculatedDomain = $derived.by<[number, number]>(() => {
    if (domain) return domain
    const min = Math.min(...values)
    const max = Math.max(...values)
    return [min, max]
  })

  // Create bins
  const bins = $derived.by<HistBin[]>(() => {
    const dom = calculatedDomain
    const binner = bin().domain(dom)

    if (thresholds) {
      binner.thresholds(thresholds)
    } else if (binCount) {
      binner.thresholds(binCount)
    }

    return binner(values).map((b, i) => ({
      x0: b.x0 ?? 0,
      x1: b.x1 ?? 0,
      count: b.length,
      values: [...b],
      index: i,
    }))
  })

  // Max count for y-scale
  const maxCount = $derived(Math.max(...bins.map((b) => b.count), 1))

  // Compute histogram insights
  const histogramInsights = $derived(() => {
    if (values.length === 0) return null

    const n = values.length
    const t = insightsConfig ?? DEFAULT_HISTOGRAM_THRESHOLDS

    // Basic statistics
    const mean = values.reduce((a, b) => a + b, 0) / n
    const sorted = [...values].sort((a, b) => a - b)
    const median =
      n % 2 === 0
        ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
        : sorted[Math.floor(n / 2)]
    const variance =
      values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n
    const stdDev = Math.sqrt(variance)
    const cv = mean !== 0 ? stdDev / Math.abs(mean) : 0

    // Min/max
    const min = sorted[0]
    const max = sorted[n - 1]

    // Determine health based on coefficient of variation
    let healthStatus: HealthStatus
    let priorityAction: string

    if (cv >= t.cvCritical) {
      healthStatus = "critical"
      priorityAction = `High variability (CV=${(cv * 100).toFixed(0)}%) - data spread is significant`
    } else if (cv >= t.cvWarning) {
      healthStatus = "warning"
      priorityAction = `Moderate spread (CV=${(cv * 100).toFixed(0)}%) - consider segmentation`
    } else {
      healthStatus = "healthy"
      priorityAction = `Tight distribution (CV=${(cv * 100).toFixed(0)}%) - data is consistent`
    }

    return {
      mean,
      median,
      stdDev,
      min,
      max,
      cv,
      healthStatus,
      priorityAction,
      count: n,
    }
  })

  // Padding - extra top space for reference line labels
  const calculatedPadding = $derived({
    left: 48,
    right: 12,
    top: referenceLines.length > 0 ? 16 : 8,
    bottom: 24,
    ...customPadding,
  })

  // Format bin label
  function formatBinLabel(binData: { x0: number; x1: number }): string {
    return `${binData.x0.toLocaleString()} - ${binData.x1.toLocaleString()}`
  }
</script>

<div data-chart class="flex w-full flex-col {className}">
  <div class="relative h-[200px]" bind:this={containerEl}>
    {#if containerWidth > 0}
      {@const chartWidth =
        containerWidth - calculatedPadding.left - calculatedPadding.right}
      {@const chartHeight =
        containerHeight - calculatedPadding.top - calculatedPadding.bottom}
      {@const xScale = scaleLinear()
        .domain(calculatedDomain)
        .range([0, chartWidth])}
      {@const yScale = scaleLinear()
        .domain([0, maxCount * 1.1])
        .range([chartHeight, 0])}

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 {containerWidth} {containerHeight}"
      >
        <g
          transform="translate({calculatedPadding.left}, {calculatedPadding.top})"
        >
          <!-- Grid lines -->
          {#each yScale.ticks(5) as tick (tick)}
            <line
              x1={0}
              x2={chartWidth}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke="var(--border)"
              stroke-dasharray="2,2"
            />
          {/each}

          <!-- Bars -->
          {#each bins as binItem, i (binItem.index)}
            {@const barX = xScale(binItem.x0)}
            {@const barWidth = xScale(binItem.x1) - xScale(binItem.x0) - 1}
            {@const barHeight = chartHeight - yScale(binItem.count)}
            <rect
              x={barX}
              y={yScale(binItem.count)}
              width={Math.max(0, barWidth)}
              height={barHeight}
              fill={color}
              fill-opacity={hoveredIndex !== null && hoveredIndex !== i
                ? 0.4
                : 1}
              class="cursor-pointer transition-[fill-opacity] duration-150"
              onmouseenter={() => (hoveredIndex = i)}
              onmouseleave={() => (hoveredIndex = null)}
              role="button"
              tabindex="0"
            />
          {/each}

          <!-- Reference lines -->
          {#each referenceLines as line (line.value)}
            <line
              x1={xScale(line.value)}
              x2={xScale(line.value)}
              y1={0}
              y2={chartHeight}
              stroke={line.color ?? "var(--muted-foreground)"}
              stroke-width={2}
              stroke-dasharray="4,4"
            />
            {#if line.label}
              <text
                x={xScale(line.value)}
                y={-4}
                text-anchor="middle"
                class="fill-muted-foreground text-xs"
              >
                {line.label}
              </text>
            {/if}
          {/each}

          <!-- X Axis -->
          <g transform="translate(0, {chartHeight})">
            {#each xScale.ticks(6) as tick (tick)}
              <g transform="translate({xScale(tick)}, 0)">
                <line y2={6} stroke="var(--border)" />
                <text
                  y={18}
                  text-anchor="middle"
                  class="fill-muted-foreground text-xs"
                >
                  {tick.toLocaleString()}
                </text>
              </g>
            {/each}
          </g>

          <!-- Y Axis -->
          {#each yScale.ticks(5) as tick (tick)}
            <g transform="translate(0, {yScale(tick)})">
              <text
                x={-8}
                text-anchor="end"
                dominant-baseline="middle"
                class="fill-muted-foreground text-xs"
              >
                {tick.toLocaleString()}
              </text>
            </g>
          {/each}
        </g>
      </svg>

      <!-- Tooltip -->
      {#if hoveredIndex !== null}
        {@const hoveredBin = bins[hoveredIndex]}
        <div
          class="pointer-events-none absolute z-20"
          style:left="{calculatedPadding.left +
            xScale((hoveredBin.x0 + hoveredBin.x1) / 2)}px"
          style:top="{calculatedPadding.top + yScale(hoveredBin.count) - 10}px"
          style:transform="translate(-50%, -100%)"
        >
          {#if customTooltip}
            {@render customTooltip({
              data: hoveredBin,
              index: hoveredIndex,
              color,
            })}
          {:else}
            <ChartTooltip {color}>
              <div class="flex flex-col gap-1">
                <span class="font-medium">{formatBinLabel(hoveredBin)}</span>
                <span>Count: {hoveredBin.count.toLocaleString()}</span>
              </div>
            </ChartTooltip>
          {/if}
        </div>
      {/if}
    {/if}
  </div>

  <!-- Insights Panel (outside chart container) -->
  {#if showInsights}
    {@const insightData = histogramInsights()}
    {#if insightData}
      {@const healthColor =
        DEFAULT_HEALTH_STATES[insightData.healthStatus]?.color ??
        DEFAULT_HEALTH_STATES.healthy.color}
      {@const histogramMetrics: MetricItem[] = [
      {
        label: "Mean",
        value: insightData.mean.toFixed(1),
        color: healthColor,
      },
      {
        label: "Median",
        value: insightData.median.toFixed(1),
      },
      {
        label: "Std Dev",
        value: insightData.stdDev.toFixed(1),
        secondaryValue: `CV: ${(insightData.cv * 100).toFixed(0)}%`,
      },
      {
        label: "Range",
        value: `${insightData.min.toFixed(1)} - ${insightData.max.toFixed(1)}`,
        secondaryValue: `n=${insightData.count}`,
      },
    ]}
      <div class="mt-4 w-full space-y-3 border-t pt-4">
        <InsightsBanner
          status={insightData.healthStatus}
          message={insightData.priorityAction}
        />
        <MetricsGrid metrics={histogramMetrics} />
      </div>
    {/if}
  {/if}
</div>
