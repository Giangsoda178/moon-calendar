<!--
  @component FunnelChart
  Conversion funnel visualization with Svelte 5 snippet API.
  Shows sequential stage drop-off for checkout funnels, sales pipelines, etc.

  @example Simple usage
  ```svelte
  <FunnelChart {data} />
  ```

  @example With custom tooltip
  ```svelte
  <FunnelChart {data} showPercentages>
    {#snippet tooltip({ data })}
      <ChartTooltip>{data.stage}: {data.value}</ChartTooltip>
    {/snippet}
  </FunnelChart>
  ```
-->
<script lang="ts" generics="T extends FunnelDataPoint">
  import type { Snippet } from "svelte"

  import ChartTooltip from "./ChartTooltip.svelte"
  import {
    DEFAULT_HEALTH_STATES,
    FUNNEL_INSIGHTS_CONFIG,
    InsightsBanner,
    type InsightsConfig,
    type MetricItem,
    MetricsGrid,
    evaluateInsights,
  } from "./insights"
  import { DEFAULT_CHART_COLORS, type FunnelDataPoint } from "./types"

  interface Props {
    /** Funnel data array */
    data: T[]
    /** Colors for each stage (defaults to CSS chart variables) */
    colors?: string[]
    /** Show percentage labels */
    showPercentages?: boolean
    /** Show value labels */
    showValues?: boolean
    /** Gap between stages in pixels */
    gapSize?: number
    /** Stage height in pixels */
    stageHeight?: number
    /** Show insights panel below chart */
    showInsights?: boolean
    /** Custom insights configuration for thresholds */
    insightsConfig?: InsightsConfig
    /** Custom tooltip content snippet */
    tooltip?: Snippet<
      [{ data: T; index: number; percentage: number; color: string }]
    >
    /** Bindable hovered index */
    hoveredIndex?: number | null
    /** CSS class for container */
    class?: string
  }

  let {
    data,
    colors = [...DEFAULT_CHART_COLORS],
    showPercentages = true,
    showValues = true,
    gapSize = 4,
    stageHeight = 48,
    showInsights = false,
    insightsConfig = FUNNEL_INSIGHTS_CONFIG,
    tooltip: customTooltip,
    hoveredIndex = $bindable(null),
    class: className,
  }: Props = $props()

  // Calculate percentages relative to first stage
  const firstValue = $derived(data[0]?.value ?? 1)
  const chartData = $derived(
    data.map((d, i) => ({
      ...d,
      percentage: d.percentage ?? Math.round((d.value / firstValue) * 100),
      color: d.color ?? colors[i % colors.length],
    })),
  )

  // Compute funnel insights
  const insights = $derived(() => {
    if (data.length < 2) return null

    const first = data[0]
    const last = data[data.length - 1]
    const overallConversion = Math.round((last.value / first.value) * 100)

    // Calculate step-by-step drop-offs
    const dropOffs = data.slice(1).map((d, i) => {
      const prev = data[i]
      const dropOff = prev.value - d.value
      const dropOffPct = Math.round((dropOff / prev.value) * 100)
      return {
        from: prev.stage,
        to: d.stage,
        lost: dropOff,
        lostPct: dropOffPct,
        retained: d.value,
        retainedPct: 100 - dropOffPct,
      }
    })

    // Find biggest leak
    const biggestLeak = dropOffs.reduce((max, d) =>
      d.lost > max.lost ? d : max,
    )

    // Use configurable threshold evaluation
    const evaluation = evaluateInsights(
      { conversionRate: overallConversion },
      insightsConfig,
    )
    const healthStatus = evaluation.status as "healthy" | "warning" | "critical"

    // Generate action message based on status
    let priorityAction: string
    if (healthStatus === "critical") {
      priorityAction = `Only ${overallConversion}% convert - focus on ${biggestLeak.from} → ${biggestLeak.to} (losing ${biggestLeak.lostPct}%)`
    } else if (healthStatus === "warning") {
      priorityAction = `Improve ${biggestLeak.from} → ${biggestLeak.to} to reduce ${biggestLeak.lostPct}% drop-off`
    } else {
      priorityAction = `${overallConversion}% conversion rate is solid`
    }

    return {
      overallConversion,
      totalLost: first.value - last.value,
      totalLostPct: 100 - overallConversion,
      dropOffs,
      biggestLeak,
      healthStatus,
      priorityAction,
      firstStage: first.stage,
      lastStage: last.stage,
      firstValue: first.value,
      lastValue: last.value,
    }
  })

  // Calculate stage widths as percentages of available width
  function getStageWidth(percentage: number): string {
    // Minimum width of 20% for visibility
    const minWidth = 20
    const width = Math.max(minWidth, percentage)
    return `${width}%`
  }

  // Tooltip state
  let tooltipX = $state(0)
  let tooltipY = $state(0)
  let showTooltip = $state(false)
  let tooltipData = $state<T | null>(null)
  let tooltipIndex = $state(0)

  function handleMouseEnter(
    item: T,
    index: number,
    event: MouseEvent | FocusEvent,
  ) {
    hoveredIndex = index
    tooltipData = item
    tooltipIndex = index
    const target = event.target
    if (!(target instanceof Element)) return
    const rect = target.getBoundingClientRect()
    tooltipX = rect.left + rect.width / 2
    tooltipY = rect.top
    showTooltip = true
  }

  function handleMouseLeave() {
    hoveredIndex = null
    showTooltip = false
    tooltipData = null
  }
</script>

<div
  data-chart
  class="relative flex w-full flex-col gap-1 {className}"
  role="img"
  aria-label="Funnel chart"
>
  {#each chartData as item, i (item.stage)}
    {@const isHovered = hoveredIndex === i}
    <div
      class="group flex flex-col gap-3 sm:flex-row sm:items-center"
      style:min-height="{stageHeight}px"
      style:margin-bottom="{i < chartData.length - 1 ? gapSize : 0}px"
    >
      <!-- Stage bar -->
      <div class="relative flex flex-1 justify-center">
        <button
          type="button"
          class="relative flex items-center justify-center rounded-md transition-all duration-200 {isHovered
            ? 'scale-[1.02] shadow-lg'
            : ''}"
          style:width={getStageWidth(item.percentage)}
          style:height="100%"
          style:background-color={item.color}
          onmouseenter={(e) => handleMouseEnter(item, i, e)}
          onmouseleave={handleMouseLeave}
          onfocus={(e) => handleMouseEnter(item, i, e)}
          onblur={handleMouseLeave}
        >
          <!-- Inner content -->
          <span
            class="truncate px-3 text-sm font-medium text-white drop-shadow-sm"
          >
            {item.stage}
          </span>
        </button>
      </div>

      <!-- Labels -->
      <div
        class="flex w-full shrink-0 items-center justify-between text-sm sm:w-[180px] sm:flex-col sm:items-end sm:justify-center"
      >
        {#if showValues}
          <span class="font-medium tabular-nums">
            {item.value.toLocaleString()}
          </span>
        {/if}
        {#if showPercentages}
          <span class="text-muted-foreground tabular-nums">
            {item.percentage}%
          </span>
        {/if}
      </div>
    </div>
  {/each}

  <!-- Tooltip -->
  {#if showTooltip && tooltipData}
    <div
      class="pointer-events-none fixed z-50"
      style:left="{tooltipX}px"
      style:top="{tooltipY - 8}px"
      style:transform="translate(-50%, -100%)"
    >
      {#if customTooltip}
        {@const stageColor =
          chartData[tooltipIndex]?.color ??
          colors[tooltipIndex % colors.length]}
        {@render customTooltip({
          data: tooltipData,
          index: tooltipIndex,
          percentage: chartData[tooltipIndex]?.percentage ?? 0,
          color: stageColor,
        })}
      {:else}
        {@const stageColor =
          chartData[tooltipIndex]?.color ??
          colors[tooltipIndex % colors.length]}
        <ChartTooltip color={stageColor}>
          <p class="font-medium">{tooltipData.stage}</p>
          <p class="text-muted-foreground">
            {tooltipData.value.toLocaleString()} ({chartData[tooltipIndex]
              ?.percentage}%)
          </p>
        </ChartTooltip>
      {/if}
    </div>
  {/if}

  <!-- Insights Panel -->
  {#if showInsights}
    {@const insightData = insights()}
    {#if insightData}
      {@const healthColor =
        DEFAULT_HEALTH_STATES[insightData.healthStatus]?.color ??
        DEFAULT_HEALTH_STATES.healthy.color}
      {@const funnelMetrics: MetricItem[] = [
        {
          label: "Conversion",
          value: insightData.overallConversion,
          unit: "%",
          color: healthColor,
        },
        {
          label: insightData.lastStage,
          value: insightData.lastValue.toLocaleString(),
          color: DEFAULT_HEALTH_STATES.healthy.color,
        },
        {
          label: "Lost",
          value: insightData.totalLost.toLocaleString(),
          secondaryValue: `(${insightData.totalLostPct}%)`,
          color: DEFAULT_HEALTH_STATES.critical.color,
        },
        {
          label: "Biggest Drop",
          value: `${insightData.biggestLeak.from} → ${insightData.biggestLeak.to}`,
          secondaryValue: `-${insightData.biggestLeak.lostPct}% (${insightData.biggestLeak.lost.toLocaleString()})`,
        },
      ]}
      <div class="mt-4 space-y-3 border-t pt-4">
        <InsightsBanner
          status={insightData.healthStatus}
          message={insightData.priorityAction}
        />
        <MetricsGrid metrics={funnelMetrics} />
      </div>
    {/if}
  {/if}
</div>
