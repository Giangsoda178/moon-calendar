<!--
  @component RetentionJourney
  Proportional timeline showing user lifecycle journey with time-based segments.
  Segment widths represent actual time spent in each state.
  Designed for customer profile pages - staff awareness at a glance.

  @example Basic usage
  ```svelte
  <RetentionJourney
    data={[
      { date: '2024-01-01', state: 'new', daysInState: 7 },
      { date: '2024-01-08', state: 'active', daysInState: 45 },
      { date: '2024-02-22', state: 'lapsing', daysInState: 14 },
      { date: '2024-03-07', state: 'active', daysInState: 60 }
    ]}
  />
  ```

  @example Without header (compact view)
  ```svelte
  <RetentionJourney data={journey} showHeader={false} />
  ```

  @example Journey bar only (minimal)
  ```svelte
  <RetentionJourney data={journey} showHeader={false} showLegend={false} />
  ```
-->
<script lang="ts">
  import { cubicOut } from "svelte/easing"
  import { fade } from "svelte/transition"

  import ChartTooltip from "./ChartTooltip.svelte"
  import {
    InsightsBanner,
    type InsightsConfig,
    type MetricItem,
    MetricsGrid,
    RETENTION_INSIGHTS_CONFIG,
    evaluateInsights,
  } from "./insights"
  import {
    RETENTION_STATE_COLORS,
    type RetentionState,
    type RetentionTimelineDataPoint,
  } from "./types"

  interface Props {
    data: RetentionTimelineDataPoint[]
    /** Show prominent current state header */
    showHeader?: boolean
    /** Show aggregate distribution legend */
    showLegend?: boolean
    /** Show insights panel with journey analysis */
    showInsights?: boolean
    /** Custom insights configuration for thresholds */
    insightsConfig?: InsightsConfig
    /** Minimum segment width percentage (prevents tiny segments) */
    minSegmentWidth?: number
    class?: string
  }

  let {
    data,
    showHeader = true,
    showLegend = true,
    showInsights = false,
    insightsConfig = RETENTION_INSIGHTS_CONFIG,
    minSegmentWidth = 3,
    class: className,
  }: Props = $props()

  // Parse dates
  const parsedData = $derived(
    data.map((d) => ({
      ...d,
      date: d.date instanceof Date ? d.date : new Date(d.date),
    })),
  )

  const currentState = $derived(parsedData[parsedData.length - 1])
  const totalDays = $derived(
    parsedData.reduce((sum, p) => sum + p.daysInState, 0),
  )

  // Calculate segment widths with minimum width enforcement
  const segments = $derived(() => {
    if (totalDays === 0) return []

    // First pass: calculate raw percentages
    const raw = parsedData.map((point) => ({
      ...point,
      rawPercentage: (point.daysInState / totalDays) * 100,
    }))

    // Second pass: enforce minimum width and redistribute
    const belowMin = raw.filter((s) => s.rawPercentage < minSegmentWidth)
    const aboveMin = raw.filter((s) => s.rawPercentage >= minSegmentWidth)

    if (belowMin.length === 0) {
      return raw.map((s) => ({ ...s, width: s.rawPercentage }))
    }

    // Calculate how much we need to redistribute
    const deficit = belowMin.reduce(
      (sum, s) => sum + (minSegmentWidth - s.rawPercentage),
      0,
    )
    const aboveTotal = aboveMin.reduce((sum, s) => sum + s.rawPercentage, 0)

    return raw.map((s) => ({
      ...s,
      width:
        s.rawPercentage < minSegmentWidth
          ? minSegmentWidth
          : s.rawPercentage - (deficit * s.rawPercentage) / aboveTotal,
    }))
  })

  // Calculate aggregate distribution by state (for legend)
  const aggregateDistribution = $derived(() => {
    if (totalDays === 0) return []

    // eslint-disable-next-line svelte/prefer-svelte-reactivity -- Map is local to derived, recreated on each update
    const byState = new Map<RetentionState, number>()
    for (const point of parsedData) {
      byState.set(
        point.state,
        (byState.get(point.state) ?? 0) + point.daysInState,
      )
    }

    // Order: active (good) → new → potential → lapsing → lapsed → lost (bad)
    const stateOrder: RetentionState[] = [
      "active",
      "new",
      "potential",
      "lapsing",
      "lapsed",
      "lost",
    ]
    return stateOrder
      .filter((state) => byState.has(state))
      .map((state) => ({
        state,
        days: byState.get(state) ?? 0,
        percentage: Math.round(((byState.get(state) ?? 0) / totalDays) * 100),
      }))
  })

  // Priority action message based on health status and state
  function getPriorityAction(ctx: {
    healthStatus: "healthy" | "warning" | "critical"
    state: RetentionState
    daysInState: number
    atRiskPct: number
    activePct: number
    lapsingOccurrences: number
    recoveries: number
  }): string {
    // Critical states
    if (ctx.healthStatus === "critical") {
      if (ctx.state === "lost")
        return "Customer has churned - consider win-back campaign"
      if (ctx.state === "lapsed")
        return `Win-back needed - ${ctx.daysInState} days inactive`
      return `${ctx.atRiskPct}% of journey in at-risk states`
    }

    // Warning states
    if (ctx.healthStatus === "warning") {
      if (ctx.state === "lapsing")
        return `Re-engage now - ${ctx.daysInState} days lapsing`
      if (ctx.lapsingOccurrences > 1)
        return `Has lapsed ${ctx.lapsingOccurrences} times - monitor closely`
      return `${ctx.atRiskPct}% of journey in at-risk periods`
    }

    // Healthy states
    if (ctx.recoveries > 0)
      return `Good recovery - re-engaged ${ctx.recoveries} time(s)`
    return `${ctx.activePct}% active - healthy engagement`
  }

  // Compute journey insights
  const journeyInsights = $derived(() => {
    if (parsedData.length < 2) return null

    const distribution = aggregateDistribution()
    const activeDays = distribution.find((d) => d.state === "active")?.days ?? 0
    const atRiskDays =
      (distribution.find((d) => d.state === "lapsing")?.days ?? 0) +
      (distribution.find((d) => d.state === "lapsed")?.days ?? 0)
    const lostDays = distribution.find((d) => d.state === "lost")?.days ?? 0

    const activePct = Math.round((activeDays / totalDays) * 100)
    const atRiskPct = Math.round((atRiskDays / totalDays) * 100)

    // Count state transitions
    const transitions = parsedData.length - 1

    // Find concerning patterns
    const lapsingOccurrences = parsedData.filter(
      (p) => p.state === "lapsing",
    ).length
    const recoveries = parsedData.filter(
      (p, i) =>
        p.state === "active" &&
        i > 0 &&
        (parsedData[i - 1].state === "lapsing" ||
          parsedData[i - 1].state === "lapsed"),
    ).length

    // Use configurable threshold evaluation (augment with state-based rules)
    const churnRate = Math.round((lostDays / totalDays) * 100)
    const evaluation = evaluateInsights(
      { atRiskPct, churnRate },
      insightsConfig,
    )

    // Augment with state-based critical conditions
    let healthStatus: "healthy" | "warning" | "critical"
    if (
      currentState.state === "lost" ||
      currentState.state === "lapsed" ||
      evaluation.status === "critical"
    ) {
      healthStatus = "critical"
    } else if (
      currentState.state === "lapsing" ||
      lapsingOccurrences > 1 ||
      evaluation.status === "warning"
    ) {
      healthStatus = "warning"
    } else {
      healthStatus = "healthy"
    }

    // Generate contextual priority action
    const priorityAction = getPriorityAction({
      healthStatus,
      state: currentState.state,
      daysInState: currentState.daysInState,
      atRiskPct,
      activePct,
      lapsingOccurrences,
      recoveries,
    })

    return {
      activePct,
      atRiskPct,
      activeDays,
      atRiskDays,
      lostDays,
      transitions,
      lapsingOccurrences,
      recoveries,
      healthStatus,
      priorityAction,
    }
  })

  // Hover state
  let hoveredIndex = $state<number | null>(null)

  // State labels and icons (descriptions removed - InsightsBanner provides actionable context)
  const stateConfig: Record<RetentionState, { label: string; icon: string }> = {
    potential: { label: "Potential", icon: "○" },
    new: { label: "New", icon: "●" },
    active: { label: "Active", icon: "✓" },
    lapsing: { label: "Lapsing", icon: "⚠" },
    lapsed: { label: "Lapsed", icon: "◐" },
    lost: { label: "Lost", icon: "✗" },
  }

  // Format date
  function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Calculate opacity for segment based on hover state
  function getSegmentOpacity(index: number): number {
    if (hoveredIndex === null) return 1
    return hoveredIndex === index ? 1 : 0.4
  }

  // Calculate filter for segment based on hover state
  function getSegmentFilter(index: number): string {
    if (hoveredIndex === index) return "brightness(1.15)"
    return "none"
  }
</script>

<div class="flex flex-col gap-3 {className}">
  <!-- Current State Header -->
  {#if showHeader && currentState}
    {@const config = stateConfig[currentState.state]}
    {@const color = RETENTION_STATE_COLORS[currentState.state]}
    <div
      class="flex items-center justify-between rounded-lg border p-3"
      style:border-color="{color}40"
      style:background-color="{color}10"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full text-lg"
          style:background-color="{color}30"
          style:color
        >
          {config.icon}
        </div>
        <div class="flex items-center gap-2">
          <span class="font-semibold" style:color>
            {config.label}
          </span>
          <span class="text-muted-foreground text-xs">
            {currentState.daysInState} days
          </span>
        </div>
      </div>
      <div class="text-muted-foreground text-right text-xs">
        <div>Since</div>
        <div class="font-medium">{formatDate(currentState.date)}</div>
      </div>
    </div>
  {/if}

  <!-- Proportional Journey Timeline -->
  {#if segments().length > 0}
    <div class="space-y-1.5">
      <div
        class="text-muted-foreground flex items-center justify-between text-xs"
      >
        <span>Customer journey</span>
        <span>{totalDays} days total</span>
      </div>

      <!-- Timeline bar with proportional segments -->
      <div class="relative">
        <div class="flex h-4 w-full overflow-hidden rounded-lg">
          {#each segments() as segment, i (i)}
            {@const color = RETENTION_STATE_COLORS[segment.state]}
            {@const isLast = i === segments().length - 1}
            {@const isFirst = i === 0}

            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="cursor-pointer transition-[opacity,filter] duration-200 ease-out"
              style:width="{segment.width}%"
              style:background-color={color}
              style:opacity={getSegmentOpacity(i)}
              style:filter={getSegmentFilter(i)}
              class:rounded-l-lg={isFirst}
              class:rounded-r-lg={isLast}
              onmouseenter={() => (hoveredIndex = i)}
              onmouseleave={() => (hoveredIndex = null)}
            ></div>
          {/each}
        </div>

        <!-- Tooltip (outside overflow container) -->
        {#if hoveredIndex !== null}
          {@const segment = segments()[hoveredIndex]}
          {@const color = RETENTION_STATE_COLORS[segment.state]}
          {@const config = stateConfig[segment.state]}
          {@const leftOffset =
            segments()
              .slice(0, hoveredIndex)
              .reduce((sum, s) => sum + s.width, 0) +
            segment.width / 2}
          <div
            class="pointer-events-none absolute bottom-full z-50 mb-2 -translate-x-1/2"
            style:left="{leftOffset}%"
            transition:fade={{ duration: 150, easing: cubicOut }}
          >
            <ChartTooltip {color}>
              <p class="font-medium">{config.label}</p>
              <p class="text-muted-foreground">{formatDate(segment.date)}</p>
              <p class="text-muted-foreground">
                {segment.daysInState} days ({Math.round(
                  segment.rawPercentage,
                )}%)
              </p>
            </ChartTooltip>
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Aggregate Legend -->
  {#if showLegend && aggregateDistribution().length > 0}
    <div class="flex flex-wrap gap-x-4 gap-y-1 pt-1">
      {#each aggregateDistribution() as item (item.state)}
        <div class="flex items-center gap-1.5 text-xs">
          <div
            class="h-2.5 w-2.5 rounded-full"
            style:background-color={RETENTION_STATE_COLORS[item.state]}
          ></div>
          <span class="text-muted-foreground"
            >{stateConfig[item.state].label}:</span
          >
          <span class="font-medium">{item.percentage}%</span>
          <span class="text-muted-foreground">({item.days}d)</span>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Insights Panel -->
  {#if showInsights}
    {@const insightData = journeyInsights()}
    {#if insightData}
      {@const journeyMetrics: MetricItem[] = [
        {
          label: "Active Time",
          value: insightData.activePct,
          unit: "%",
          color: RETENTION_STATE_COLORS.active,
          secondaryValue: `(${insightData.activeDays}d)`,
        },
        {
          label: "At-Risk Time",
          value: insightData.atRiskPct,
          unit: "%",
          color: RETENTION_STATE_COLORS.lapsing,
          secondaryValue: `(${insightData.atRiskDays}d)`,
        },
        {
          label: "Lapse Count",
          value: `${insightData.lapsingOccurrences}×`,
          color: insightData.lapsingOccurrences > 1 ? RETENTION_STATE_COLORS.lapsing : undefined,
        },
        {
          label: "Recoveries",
          value: `${insightData.recoveries}×`,
          color: insightData.recoveries > 0 ? RETENTION_STATE_COLORS.active : undefined,
        },
      ]}
      <div class="space-y-3 border-t pt-3">
        <InsightsBanner
          status={insightData.healthStatus}
          message={insightData.priorityAction}
        />
        <MetricsGrid metrics={journeyMetrics} />
      </div>
    {/if}
  {/if}
</div>
