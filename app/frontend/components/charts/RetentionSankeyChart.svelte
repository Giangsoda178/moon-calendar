<!--
  @component RetentionSankeyChart
  Sankey flow diagram showing user transitions between retention states.
  Nodes represent states, links show transition volumes.

  @example
  ```svelte
  <RetentionSankeyChart
    data={{
      nodes: [
        { id: 'new', label: 'New Users' },
        { id: 'active', label: 'Active' },
        { id: 'lapsed', label: 'Lapsed' }
      ],
      links: [
        { source: 'new', target: 'active', value: 850 },
        { source: 'active', target: 'lapsed', value: 120 }
      ]
    }}
  />
  ```
-->
<script lang="ts">
  import { sankey, sankeyJustify, sankeyLinkHorizontal } from "d3-sankey"
  import type { SankeyExtraProperties } from "d3-sankey"
  import type { Snippet } from "svelte"

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
    type RetentionSankeyData,
    type RetentionSankeyNode,
    type RetentionState,
    type TooltipParams,
  } from "./types"

  // Input types for d3-sankey (before computation)
  interface InputNode {
    id: RetentionState
    label?: string
    value?: number
  }

  interface InputLink {
    source: string
    target: string
    value: number
  }

  // Output types for d3-sankey (after computation adds layout properties)
  interface ComputedNode extends SankeyExtraProperties {
    id: RetentionState
    label?: string
    value?: number
    x0?: number
    x1?: number
    y0?: number
    y1?: number
    sourceLinks?: ComputedLink[]
    targetLinks?: ComputedLink[]
  }

  interface ComputedLink extends SankeyExtraProperties {
    source: ComputedNode
    target: ComputedNode
    value: number
    width?: number
    y0?: number
    y1?: number
  }

  interface Props {
    data: RetentionSankeyData
    nodeWidth?: number
    nodePadding?: number
    linkOpacity?: number
    showLabels?: boolean
    showValues?: boolean
    showLegend?: boolean
    showInsights?: boolean
    /** Custom insights configuration for thresholds */
    insightsConfig?: InsightsConfig
    nodeTooltip?: Snippet<[TooltipParams<RetentionSankeyNode>]>
    linkTooltip?: Snippet<
      [{ source: string; target: string; value: number; percentage: number }]
    >
    class?: string
  }

  let {
    data,
    nodeWidth = 20,
    nodePadding = 16,
    linkOpacity = 0.4,
    showLabels = true,
    showValues = true,
    showLegend = true,
    showInsights = false,
    insightsConfig = RETENTION_INSIGHTS_CONFIG,
    nodeTooltip,
    linkTooltip,
    class: className,
  }: Props = $props()

  // Type guard for RetentionState
  const RETENTION_STATES: RetentionState[] = [
    "potential",
    "new",
    "active",
    "lapsing",
    "lapsed",
    "lost",
  ]

  function isRetentionState(value: string): value is RetentionState {
    return RETENTION_STATES.includes(value as RetentionState)
  }

  // State config with labels and action hints
  const stateConfig: Record<
    RetentionState,
    { label: string; icon: string; description: string }
  > = {
    potential: {
      label: "Potential",
      icon: "○",
      description: "Not yet converted",
    },
    new: { label: "New", icon: "●", description: "Recently acquired" },
    active: { label: "Active", icon: "✓", description: "Engaged customers" },
    lapsing: {
      label: "Lapsing",
      icon: "⚠",
      description: "At risk - re-engage",
    },
    lapsed: { label: "Lapsed", icon: "◐", description: "Win-back needed" },
    lost: { label: "Lost", icon: "✗", description: "Churned" },
  }

  // Compute comprehensive insights from the data
  const insights = $derived(() => {
    const total = totalUsers()
    if (total === 0) return null

    // Get node values
    const getValue = (id: string) =>
      data.nodes.find((n) => n.id === id)?.value ?? 0
    const getPct = (val: number) => Math.round((val / total) * 100)

    const potential = getValue("potential")
    const newUsers = getValue("new")
    const active = getValue("active")
    const lapsing = getValue("lapsing")
    const lapsed = getValue("lapsed")
    const lost = getValue("lost")

    // Calculate key metrics
    const conversionRate =
      potential > 0 ? Math.round((newUsers / potential) * 100) : 0
    const activationRate =
      newUsers > 0 ? Math.round((active / newUsers) * 100) : 0
    const retentionRate = getPct(active)
    const atRiskUsers = lapsing + lapsed
    const atRiskPct = getPct(atRiskUsers)
    const churnRate = getPct(lost)

    // Find biggest leak (where most users are lost)
    const leakageFlows = data.links
      .filter(
        (l) =>
          l.target === "lost" ||
          l.target === "lapsed" ||
          l.target === "lapsing",
      )
      .sort((a, b) => b.value - a.value)
    const biggestLeak = leakageFlows[0]

    // Use configurable threshold evaluation
    const evaluation = evaluateInsights(
      { atRiskPct, churnRate },
      insightsConfig,
    )
    const healthStatus = evaluation.status as "healthy" | "warning" | "critical"

    // Generate contextual priority action
    let priorityAction: string
    let priorityUrgency: "low" | "medium" | "high"

    if (healthStatus === "critical") {
      priorityAction =
        atRiskPct > churnRate
          ? `${atRiskUsers.toLocaleString()} users need immediate re-engagement`
          : `High churn: focus on retention strategies`
      priorityUrgency = "high"
    } else if (healthStatus === "warning") {
      priorityAction =
        lapsing > lapsed
          ? `Re-engage ${lapsing.toLocaleString()} lapsing users before they churn`
          : `Win back ${lapsed.toLocaleString()} lapsed users`
      priorityUrgency = "medium"
    } else {
      priorityAction =
        conversionRate < 80
          ? `Improve acquisition: only ${conversionRate}% convert from potential`
          : `Maintain momentum with ${active.toLocaleString()} active users`
      priorityUrgency = "low"
    }

    return {
      total,
      conversionRate,
      activationRate,
      retentionRate,
      atRiskUsers,
      atRiskPct,
      churnRate,
      active,
      lapsing,
      lapsed,
      lost,
      biggestLeak,
      healthStatus,
      priorityAction,
      priorityUrgency,
    }
  })

  // State ordering for consistent legend display
  const stateOrder: RetentionState[] = [
    "potential",
    "new",
    "active",
    "lapsing",
    "lapsed",
    "lost",
  ]

  // Map nodes by ID for quick lookup
  const nodeMap = $derived(new Map(data.nodes.map((n) => [n.id, n])))

  // Container dimensions
  let containerWidth = $state(600)
  let containerHeight = $state(400)

  // Compute layout
  const layout = $derived(() => {
    // Build sankey input data with string IDs for source/target
    const sankeyData: { nodes: InputNode[]; links: InputLink[] } = {
      nodes: data.nodes.map((n) => ({ ...n })),
      links: data.links.map((l) => ({
        value: l.value,
        source: l.source,
        target: l.target,
      })),
    }

    // Create layout generator
    // d3-sankey mutates input data in-place, transforming string source/target
    // to object references. TypeScript generics can't model this mutation,
    // so we use InputNode for input and cast the result to ComputedNode.
    const generator = sankey<InputNode, InputLink>()
      .nodeId((d) => d.id)
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
      .nodeAlign(sankeyJustify)
      .extent([
        [1, 1],
        [containerWidth - 1, containerHeight - 1],
      ])
      .iterations(6)

    // After generator runs, nodes and links are mutated with layout properties
    // and links have object references instead of strings
    const result = generator(sankeyData)
    return result as unknown as { nodes: ComputedNode[]; links: ComputedLink[] }
  })

  // State
  let hoveredNodeId = $state<string | null>(null)
  let hoveredLinkIndex = $state<number | null>(null)

  // Get node color using type guard
  function getNodeColor(nodeId: string): string {
    if (isRetentionState(nodeId)) {
      return RETENTION_STATE_COLORS[nodeId]
    }
    return "#94a3b8"
  }

  // Check if link is connected to hovered node
  function isLinkConnected(link: ComputedLink): boolean {
    if (!hoveredNodeId) return false
    return link.source.id === hoveredNodeId || link.target.id === hoveredNodeId
  }

  // Generate link path
  function getLinkPath(link: ComputedLink): string {
    // sankeyLinkHorizontal accepts SankeyLink which ComputedLink extends
    return sankeyLinkHorizontal()(link) ?? ""
  }

  // Calculate percentage
  function getPercentage(value: number, total: number): number {
    return total > 0 ? Math.round((value / total) * 100) : 0
  }

  // Total users (sum of first column nodes)
  const totalUsers = $derived(() => {
    const sourceIds = new Set(data.links.map((l) => l.source))
    const targetIds = new Set(data.links.map((l) => l.target))
    const rootIds = [...sourceIds].filter((id) => !targetIds.has(id))
    return data.nodes
      .filter((n) => rootIds.includes(n.id))
      .reduce((sum, n) => sum + (n.value ?? 0), 0)
  })

  // Resize observer
  function handleResize(node: HTMLElement) {
    const observer = new ResizeObserver((entries) => {
      containerWidth = entries[0]?.contentRect.width ?? 600
      containerHeight = entries[0]?.contentRect.height ?? 400
    })
    observer.observe(node)
    return { destroy: () => observer.disconnect() }
  }
</script>

<div data-chart class="flex h-full w-full flex-col {className}">
  <!-- Chart container -->
  <div class="relative min-h-0 flex-1" use:handleResize>
    <svg width="100%" height="100%">
      <!-- Links -->
      <g class="links">
        {#each layout().links as link, i (i)}
          {@const connected = isLinkConnected(link)}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <path
            d={getLinkPath(link)}
            fill="none"
            stroke={getNodeColor(link.source.id)}
            stroke-width={Math.max(1, link.width ?? 1)}
            stroke-opacity={hoveredNodeId
              ? connected
                ? linkOpacity + 0.2
                : 0.1
              : hoveredLinkIndex === i
                ? linkOpacity + 0.2
                : linkOpacity}
            class="cursor-pointer transition-opacity"
            onmouseenter={() => {
              hoveredLinkIndex = i
              hoveredNodeId = null
            }}
            onmouseleave={() => (hoveredLinkIndex = null)}
          />
        {/each}
      </g>

      <!-- Nodes -->
      <g class="nodes">
        {#each layout().nodes as node (node.id)}
          {@const x = node.x0 ?? 0}
          {@const y = node.y0 ?? 0}
          {@const w = (node.x1 ?? 0) - x}
          {@const h = (node.y1 ?? 0) - y}
          {@const color = getNodeColor(node.id)}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <g
            transform="translate({x}, {y})"
            class="cursor-pointer"
            onmouseenter={() => {
              hoveredNodeId = node.id
              hoveredLinkIndex = null
            }}
            onmouseleave={() => (hoveredNodeId = null)}
          >
            <rect
              width={w}
              height={h}
              fill={color}
              rx={2}
              class="transition-opacity"
              class:opacity-60={hoveredNodeId && hoveredNodeId !== node.id}
            />

            {#if showLabels && h > 20}
              {@const isLeft = x < containerWidth / 2}
              <text
                x={isLeft ? w + 6 : -6}
                y={h / 2}
                text-anchor={isLeft ? "start" : "end"}
                dominant-baseline="middle"
                class="fill-foreground text-xs font-medium"
              >
                {node.label ?? node.id}
              </text>
              {#if showValues}
                <text
                  x={isLeft ? w + 6 : -6}
                  y={h / 2 + 14}
                  text-anchor={isLeft ? "start" : "end"}
                  dominant-baseline="middle"
                  class="fill-muted-foreground text-xs"
                >
                  {(node.value ?? 0).toLocaleString()}
                </text>
              {/if}
            {/if}
          </g>
        {/each}
      </g>
    </svg>

    <!-- Node tooltip -->
    {#if hoveredNodeId}
      {@const node = layout().nodes.find((n) => n.id === hoveredNodeId)}
      {#if node}
        <div
          class="pointer-events-none absolute z-50"
          style:left="{(node.x0 ?? 0) +
            ((node.x1 ?? 0) - (node.x0 ?? 0)) / 2}px"
          style:top="{(node.y0 ?? 0) - 8}px"
          style:transform="translate(-50%, -100%)"
        >
          {#if nodeTooltip}
            {@render nodeTooltip({
              data: {
                id: isRetentionState(node.id) ? node.id : "potential",
                label: node.label,
                value: node.value,
              },
              index: layout().nodes.indexOf(node),
              color: getNodeColor(node.id),
              value: node.value,
            })}
          {:else}
            <ChartTooltip color={getNodeColor(node.id)}>
              <p class="font-medium">{node.label ?? node.id}</p>
              <p class="text-muted-foreground">
                {(node.value ?? 0).toLocaleString()} users
              </p>
              <p class="text-muted-foreground">
                {getPercentage(node.value ?? 0, totalUsers())}% of total
              </p>
            </ChartTooltip>
          {/if}
        </div>
      {/if}
    {/if}

    <!-- Link tooltip -->
    {#if hoveredLinkIndex !== null}
      {@const link = layout().links[hoveredLinkIndex]}
      {#if link}
        {@const midX = ((link.source.x1 ?? 0) + (link.target.x0 ?? 0)) / 2}
        {@const midY = ((link.y0 ?? 0) + (link.y1 ?? 0)) / 2}
        <div
          class="pointer-events-none absolute z-50"
          style:left="{midX}px"
          style:top="{midY - 8}px"
          style:transform="translate(-50%, -100%)"
        >
          {#if linkTooltip}
            {@render linkTooltip({
              source: link.source.label ?? link.source.id,
              target: link.target.label ?? link.target.id,
              value: link.value,
              percentage: getPercentage(link.value, link.source.value ?? 1),
            })}
          {:else}
            <ChartTooltip color={getNodeColor(link.source.id)}>
              <p class="font-medium">
                {link.source.label ?? link.source.id} → {link.target.label ??
                  link.target.id}
              </p>
              <p class="text-muted-foreground">
                {link.value.toLocaleString()} users
              </p>
              <p class="text-muted-foreground">
                {getPercentage(link.value, link.source.value ?? 1)}% of source
              </p>
            </ChartTooltip>
          {/if}
        </div>
      {/if}
    {/if}
  </div>

  <!-- Legend -->
  {#if showLegend}
    <div class="flex flex-wrap gap-x-4 gap-y-1 border-t pt-3">
      {#each stateOrder as stateId (stateId)}
        {@const node = nodeMap.get(stateId)}
        {#if node}
          {@const color = getNodeColor(stateId)}
          <div class="flex items-center gap-1.5 text-xs">
            <div
              class="h-2 w-2 rounded-full"
              style:background-color={color}
            ></div>
            <span class="text-muted-foreground">
              {stateConfig[stateId]?.label ?? node.label}
            </span>
          </div>
        {/if}
      {/each}
    </div>
  {/if}

  <!-- Insights Panel (below legend) -->
  {#if showInsights}
    {@const insightData = insights()}
    {#if insightData}
      {@const sankeyMetrics: MetricItem[] = [
        {
          label: "Retained",
          value: insightData.retentionRate,
          unit: "%",
          color: RETENTION_STATE_COLORS.active,
          secondaryValue: `(${insightData.active.toLocaleString()})`,
        },
        {
          label: "At Risk",
          value: insightData.atRiskPct,
          unit: "%",
          color: RETENTION_STATE_COLORS.lapsing,
          secondaryValue: `(${insightData.atRiskUsers.toLocaleString()})`,
        },
        {
          label: "Churned",
          value: insightData.churnRate,
          unit: "%",
          color: RETENTION_STATE_COLORS.lost,
          secondaryValue: `(${insightData.lost.toLocaleString()})`,
        },
        {
          label: "Conversion",
          value: insightData.conversionRate,
          unit: "%",
          color: RETENTION_STATE_COLORS.new,
          secondaryLabel: "acquired",
        },
      ]}
      <div class="mt-4 w-full space-y-3 border-t pt-4">
        <InsightsBanner
          status={insightData.healthStatus}
          message={insightData.priorityAction}
        />
        <MetricsGrid metrics={sankeyMetrics} />
      </div>
    {/if}
  {/if}
</div>
