<!--
  @component PieChart
  Pie or donut chart with Svelte 5 snippet API.
  Uses LayerChart's built-in Tooltip.Root for positioning.

  @example Simple usage
  ```svelte
  <PieChart {data} x="browser" y="visitors" />
  ```

  @example Donut with custom tooltip
  ```svelte
  <PieChart {data} x="browser" y="visitors" innerRadius={60}>
    {#snippet tooltip({ data })}
      <ChartTooltip>{data.browser}: {data.visitors}</ChartTooltip>
    {/snippet}
  </PieChart>
  ```
-->
<script lang="ts" generics="T extends object">
  import { PieChart as LayerPieChart, Tooltip } from "layerchart"
  import type { Snippet } from "svelte"

  import ChartTooltip from "./ChartTooltip.svelte"
  import {
    DEFAULT_CHART_COLORS,
    type LegendParams,
    type TooltipParams,
  } from "./types"

  interface Props {
    /** Chart data array */
    data: T[]
    /** Key for category names (x-axis equivalent) */
    x: keyof T & string
    /** Key for values (y-axis equivalent) */
    y: keyof T & string
    /** Colors for each slice (defaults to CSS chart variables) */
    colors?: string[]
    /** Inner radius for donut (0 = pie) */
    innerRadius?: number
    /** Enable hover highlight effect (any value > 0 enables it) */
    highlightOffset?: number
    /** Custom tooltip content snippet */
    tooltip?: Snippet<[TooltipParams<T>]>
    /** Custom legend snippet */
    legend?: Snippet<[LegendParams]>
    /** CSS class for container */
    class?: string
  }

  let {
    data,
    x,
    y,
    colors = [...DEFAULT_CHART_COLORS],
    innerRadius = 0,
    highlightOffset = 0,
    tooltip: customTooltip,
    legend,
    class: className,
  }: Props = $props()

  // Calculate total for percentage display
  const total = $derived(data.reduce((sum, d) => sum + (Number(d[y]) || 0), 0))

  // Add color to data for LayerChart
  const chartData = $derived(
    data.map((d, i) => ({
      ...d,
      color: colors[i % colors.length],
    })),
  )

  // Legend items derived from data
  const legendItems = $derived(
    data.map((d, i) => ({
      key: String(d[x]),
      label: String(d[x]),
      color: colors[i % colors.length],
      active: true,
    })),
  )
</script>

<div
  data-chart
  class="flex h-full w-full items-center gap-4 {className}"
  class:pie-hover-enabled={highlightOffset > 0}
>
  <div class="h-full flex-1">
    <LayerPieChart
      data={chartData}
      key={x}
      value={y}
      c="color"
      {innerRadius}
      padding={20}
      props={{
        pie: { motion: "tween" },
      }}
    >
      {#snippet tooltip()}
        <Tooltip.Root variant="none">
          {#snippet children({ data: tooltipData })}
            {#if tooltipData}
              {#if customTooltip}
                {@render customTooltip({
                  data: tooltipData as T,
                  index: chartData.findIndex((d) => d[x] === tooltipData[x]),
                  color:
                    colors[
                      chartData.findIndex((d) => d[x] === tooltipData[x]) %
                        colors.length
                    ],
                  percentage: Math.round(
                    (Number(tooltipData[y]) / total) * 100,
                  ),
                  value: Number(tooltipData[y]),
                })}
              {:else}
                {@const sliceIndex = chartData.findIndex(
                  (d) => d[x] === tooltipData[x],
                )}
                {@const sliceColor =
                  sliceIndex >= 0
                    ? colors[sliceIndex % colors.length]
                    : undefined}
                <ChartTooltip color={sliceColor}>
                  <div class="flex items-center gap-2">
                    <span class="text-muted-foreground">
                      {tooltipData[x]}
                    </span>
                    <span class="ml-auto font-mono font-medium tabular-nums">
                      {Number(tooltipData[y]).toLocaleString()}
                    </span>
                  </div>
                </ChartTooltip>
              {/if}
            {/if}
          {/snippet}
        </Tooltip.Root>
      {/snippet}
    </LayerPieChart>
  </div>

  {#if legend}
    {@render legend({
      items: legendItems,
      toggle: () => {},
    })}
  {:else}
    <!-- Default legend (display only - toggle not useful for pie charts) -->
    <div class="flex flex-col gap-2">
      {#each data as item, i (item[x])}
        {@const name = item[x] as string}
        {@const val = Number(item[y])}
        <div class="flex items-center gap-2 text-sm">
          <span
            class="size-3 rounded-full"
            style:background-color={colors[i % colors.length]}
          ></span>
          <span class="text-muted-foreground">{name}</span>
          <span class="ml-auto font-medium tabular-nums">
            {((val / total) * 100).toFixed(1)}%
          </span>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  /* Pure CSS hover effect for pie slices - no state changes, no jitter */
  .pie-hover-enabled :global(path[fill]) {
    cursor: pointer;
    transition:
      filter 200ms ease-out,
      opacity 200ms ease-out;
  }

  .pie-hover-enabled :global(path[fill]:hover) {
    filter: brightness(1.15) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }

  /* Dim other slices when one is hovered */
  .pie-hover-enabled:has(:global(path[fill]:hover))
    :global(path[fill]:not(:hover)) {
    opacity: 0.6;
  }
</style>
