<!--
  @component BarChart
  Vertical or horizontal bar chart with Svelte 5 snippet API.
  Supports single series, multi-series grouped, and stacked modes.
  Uses LayerChart's built-in Tooltip.Root for positioning.

  @example Single series
  ```svelte
  <BarChart {data} x="product" y="sales" />
  ```

  @example Multi-series grouped (default for multi-series)
  ```svelte
  <BarChart {data} x="month" series={['thisYear', 'lastYear']} />
  ```

  @example Multi-series stacked
  ```svelte
  <BarChart {data} x="month" series={['direct', 'organic', 'referral']} stacked />
  ```

  @example Horizontal bar chart
  ```svelte
  <BarChart {data} x="product" y="sales" horizontal />
  ```

  @example With legend on the right
  ```svelte
  <BarChart {data} x="month" series={['thisYear', 'lastYear']} legendPosition="right" />
  ```

  @example With custom tooltip
  ```svelte
  <BarChart {data} x="product" y="sales">
    {#snippet tooltip({ data, color })}
      <ChartTooltip {color}>{data.product}: ${data.sales}</ChartTooltip>
    {/snippet}
  </BarChart>
  ```
-->
<script lang="ts" generics="T extends object">
  import { scaleBand } from "d3-scale"
  import { BarChart as LayerBarChart, Tooltip } from "layerchart"
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
    calcHorizontalLeftPadding,
    calcLeftPadding,
  } from "./types"

  interface Props {
    /** Chart data array */
    data: T[]
    /** Key for x-axis (categories) */
    x: keyof T & string
    /** Key for y-axis (single series shorthand) */
    y?: keyof T & string
    /** Multiple y-axis keys (series names for multi-series) */
    series?: (keyof T & string)[]
    /** Custom labels for series (maps key to display name) */
    labels?: Record<string, string>
    /** Bar color (single series only) */
    color?: string
    /** Colors for each series (multi-series) */
    colors?: string[]
    /** Horizontal orientation */
    horizontal?: boolean
    /** Stack bars (multi-series) */
    stacked?: boolean
    /** Bar corner radius */
    radius?: number
    /** Legend position: "bottom" (default) or "right" */
    legendPosition?: "bottom" | "right"
    /** Custom padding (overrides default) */
    padding?: Partial<ChartPadding>
    /** Custom tooltip content snippet */
    tooltip?: Snippet<[TooltipParams<T>]>
    /** Custom legend snippet (auto-shown for multi-series) */
    legend?: Snippet<[LegendParams]>
    /** CSS class for container */
    class?: string
  }

  let {
    data,
    x,
    y,
    series,
    labels = {},
    color = "var(--chart-1)",
    colors = [...DEFAULT_CHART_COLORS],
    horizontal = false,
    stacked = false,
    radius = 4,
    legendPosition = "bottom",
    padding: customPadding,
    tooltip: customTooltip,
    legend,
    class: className,
  }: Props = $props()

  // Mobile detection for responsive legend
  const isMobile = new IsMobile()

  // Selection state for legend toggle
  const selection = createSelectionState<string>()

  // Derive effective series from y or series prop
  const effectiveSeries = $derived(series ?? (y ? [y] : []))

  // On mobile, always show legend at bottom regardless of legendPosition prop
  const effectiveLegendPosition = $derived(
    isMobile.current ? "bottom" : legendPosition,
  )
  const effectiveColors = $derived(series ? colors : [color])
  const isMultiSeries = $derived(effectiveSeries.length > 1)

  // Auto-show legend for multi-series
  const showDefaultLegend = $derived(isMultiSeries && !legend)

  // Determine series layout for LayerChart
  const seriesLayout = $derived<"group" | "stack" | "overlap">(
    stacked ? "stack" : isMultiSeries ? "group" : "overlap",
  )

  // Create series format for LayerChart
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
    left: horizontal
      ? calcHorizontalLeftPadding(data, x)
      : calcLeftPadding(data, effectiveSeries[0]),
    right: 12,
    top: 8,
    bottom: horizontal ? 20 : calcBottomPadding(data, x),
    ...customPadding,
  })
</script>

<div
  data-chart
  class="h-full w-full overflow-hidden {effectiveLegendPosition === 'right'
    ? 'flex gap-4'
    : 'flex flex-col'} {className}"
>
  <div
    class={effectiveLegendPosition === "right"
      ? "h-full min-w-0 flex-1"
      : "min-h-0 flex-1"}
  >
    {#if horizontal}
      <!-- Horizontal bar chart uses orientation prop with yScale -->
      <LayerBarChart
        {data}
        orientation="horizontal"
        y={x}
        yScale={scaleBand().padding(0.25)}
        series={visibleSeries}
        {seriesLayout}
        axis="y"
        grid={false}
        rule={false}
        padding={calculatedPadding}
        props={{
          bars: {
            rounded: "all",
            radius,
            stroke: "none",
          },
          yAxis: {
            format: (d: unknown) =>
              typeof d === "string" && d.length > 10
                ? d.slice(0, 10) + "…"
                : String(d),
            tickLabelProps: { dx: -8 },
          },
          highlight: {
            area: { class: "fill-muted-foreground/10" },
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
                {:else if isMultiSeries}
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
                {:else}
                  <ChartTooltip color={visibleSeries[0]?.color}>
                    <p class="font-medium">{tooltipData[x]}</p>
                    <p class="text-muted-foreground">
                      {(
                        tooltipData[effectiveSeries[0]] as number
                      )?.toLocaleString()}
                    </p>
                  </ChartTooltip>
                {/if}
              {/if}
            {/snippet}
          </Tooltip.Root>
        {/snippet}
      </LayerBarChart>
    {:else}
      <!-- Vertical bar chart (default) -->
      <LayerBarChart
        {data}
        {x}
        xScale={scaleBand().padding(0.25)}
        series={visibleSeries}
        {seriesLayout}
        axis={true}
        padding={calculatedPadding}
        props={{
          bars: { rounded: "all", radius, stroke: "none" },
          xAxis: {
            format: (d: unknown) =>
              typeof d === "string" && d.length > 8
                ? d.slice(0, 8) + "…"
                : String(d),
          },
          yAxis: {
            format: (d: number) => d.toLocaleString(),
          },
          highlight: {
            area: { class: "fill-muted-foreground/10" },
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
                {:else if isMultiSeries}
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
                {:else}
                  <ChartTooltip color={visibleSeries[0]?.color}>
                    <p class="font-medium">{tooltipData[x]}</p>
                    <p class="text-muted-foreground">
                      {(
                        tooltipData[effectiveSeries[0]] as number
                      )?.toLocaleString()}
                    </p>
                  </ChartTooltip>
                {/if}
              {/if}
            {/snippet}
          </Tooltip.Root>
        {/snippet}
      </LayerBarChart>
    {/if}
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
