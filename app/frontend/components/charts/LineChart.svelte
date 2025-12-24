<!--
  @component LineChart
  Multi-series line chart with Svelte 5 snippet API.
  Uses LayerChart's built-in Tooltip.Root for positioning.

  @example Single series (shorthand)
  ```svelte
  <LineChart {data} x="month" y="revenue" />
  ```

  @example Multi-series
  ```svelte
  <LineChart {data} x="month" series={['revenue', 'expenses']} />
  ```

  @example With legend on the right
  ```svelte
  <LineChart {data} x="month" series={['revenue', 'expenses']} legendPosition="right" />
  ```

  @example With custom tooltip
  ```svelte
  <LineChart {data} x="month" y="revenue">
    {#snippet tooltip({ data, color })}
      <ChartTooltip {color}>{data.month}: ${data.revenue}</ChartTooltip>
    {/snippet}
  </LineChart>
  ```
-->
<script lang="ts" generics="T extends object">
  import { scaleBand } from "d3-scale"
  import { LineChart as LayerLineChart, Tooltip } from "layerchart"
  import type { Snippet } from "svelte"

  import { IsMobile } from "@/runes/is-mobile.svelte"

  import ChartTooltip from "./ChartTooltip.svelte"
  import { createSelectionState } from "./selection-state.svelte"
  import {
    type ChartPadding,
    DEFAULT_CHART_COLORS,
    type LegendParams,
    type TooltipParams,
    calcBottomPadding,
    calcLeftPadding,
  } from "./types"

  interface Props {
    /** Chart data array */
    data: T[]
    /** Key for x-axis values */
    x: keyof T & string
    /** Single y-axis key (shorthand for single series) */
    y?: keyof T & string
    /** Multiple y-axis keys (series names from data) */
    series?: (keyof T & string)[]
    /** Custom labels for series (maps key to display name) */
    labels?: Record<string, string>
    /** Single color (when using y prop) */
    color?: string
    /** Colors for each series (defaults to CSS chart variables) */
    colors?: string[]
    /** Show dots on data points */
    showDots?: boolean
    /** Stroke width */
    strokeWidth?: number
    /** Legend position: "bottom" (default) or "right" */
    legendPosition?: "bottom" | "right"
    /** Custom padding (overrides default) */
    padding?: Partial<ChartPadding>
    /** Custom tooltip content snippet */
    tooltip?: Snippet<[TooltipParams<T>]>
    /** Custom legend snippet (auto-shown for multi-series) */
    legend?: Snippet<[LegendParams]>
    /** Custom X-axis props */
    xAxis?: Record<string, unknown>
    /** Custom Y-axis props */
    yAxis?: Record<string, unknown>
    /** CSS class for container */
    class?: string
  }

  let {
    data,
    x,
    y,
    series,
    labels = {},
    color,
    colors = [...DEFAULT_CHART_COLORS],
    showDots = true,
    strokeWidth = 2,
    legendPosition = "bottom",
    padding: customPadding,
    tooltip: customTooltip,
    legend,
    xAxis: customXAxis,
    yAxis: customYAxis,
    class: className,
  }: Props = $props()

  // Mobile detection for responsive legend
  const isMobile = new IsMobile()

  // Derive effective series from y or series prop
  const effectiveSeries = $derived(series ?? (y ? [y] : []))
  const effectiveColors = $derived(color ? [color] : colors)

  // On mobile, always show legend at bottom regardless of legendPosition prop
  const effectiveLegendPosition = $derived(
    isMobile.current ? "bottom" : legendPosition,
  )

  // Selection state for legend toggle
  const selection = createSelectionState<string>()

  // Auto-show legend for multi-series
  const showDefaultLegend = $derived(effectiveSeries.length > 1 && !legend)

  // Transform to LayerChart series format
  const layerSeries = $derived(
    effectiveSeries.map((key, i) => ({
      key,
      label: labels[key] ?? key,
      color: effectiveColors[i % effectiveColors.length],
    })),
  )

  // Filter visible series based on selection
  const visibleSeries = $derived(
    layerSeries.filter((s) => selection.isVisible(s.key)),
  )

  // Calculate padding based on this chart's data
  const calculatedPadding = $derived({
    left: calcLeftPadding(data, effectiveSeries[0]),
    right: 12,
    top: 8,
    bottom: calcBottomPadding(data, x),
    ...customPadding,
  })
</script>

<div
  data-chart
  class="h-full w-full {effectiveLegendPosition === 'right'
    ? 'flex gap-4'
    : 'flex flex-col'} {className}"
>
  <div
    class={effectiveLegendPosition === "right"
      ? "h-full min-w-0 flex-1"
      : "min-h-0 flex-1"}
  >
    <LayerLineChart
      {data}
      {x}
      xScale={scaleBand()}
      series={visibleSeries}
      axis={true}
      padding={calculatedPadding}
      props={{
        spline: { strokeWidth, motion: "tween" },
        xAxis: { ...customXAxis },
        yAxis: { format: (d: number) => d.toLocaleString(), ...customYAxis },
        highlight: {
          points: { r: showDots ? 4 : 0 },
        },
      }}
    >
      {#snippet tooltip()}
        <Tooltip.Root variant="none">
          {#snippet children({ data: tooltipData })}
            {#if tooltipData}
              {#if customTooltip}
                {@render customTooltip({
                  data: tooltipData as T,
                  index: 0,
                  color: visibleSeries[0]?.color,
                })}
              {:else}
                <ChartTooltip>
                  <p class="mb-1 font-medium">{tooltipData[x]}</p>
                  <div class="grid gap-1">
                    {#each visibleSeries as s (s.key)}
                      <div class="flex items-center gap-2">
                        <span
                          class="size-2 rounded-full"
                          style:background-color={s.color}
                        ></span>
                        <span class="text-muted-foreground">{s.label}</span>
                        <span
                          class="ml-auto font-mono font-medium tabular-nums"
                        >
                          {(tooltipData[s.key] as number)?.toLocaleString()}
                        </span>
                      </div>
                    {/each}
                  </div>
                </ChartTooltip>
              {/if}
            {/if}
          {/snippet}
        </Tooltip.Root>
      {/snippet}
    </LayerLineChart>
  </div>

  <!-- Auto-show default legend for multi-series -->
  {#if showDefaultLegend}
    <div
      class={effectiveLegendPosition === "right"
        ? "flex shrink-0 flex-col justify-center gap-2"
        : "flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2"}
    >
      {#each layerSeries as item (item.key)}
        <button
          type="button"
          class="flex cursor-pointer items-center gap-2 text-sm transition-opacity hover:opacity-80"
          class:opacity-50={!selection.isVisible(item.key)}
          onclick={() => selection.toggle(item.key)}
        >
          <span class="size-3 rounded-full" style:background-color={item.color}
          ></span>
          <span class="text-muted-foreground">{item.label}</span>
        </button>
      {/each}
    </div>
  {/if}

  <!-- Custom legend -->
  {#if legend}
    <div class={effectiveLegendPosition === "right" ? "shrink-0" : "mt-2"}>
      {@render legend({
        items: layerSeries.map((s) => ({
          ...s,
          active: selection.isVisible(s.key),
        })),
        toggle: (key) => selection.toggle(key),
      })}
    </div>
  {/if}
</div>
