<!--
  @component MetricsGrid
  Renders a responsive grid of metric cards with optional color coding and trends.
  Supports 2-column (compact) and 4-column (default) layouts.

  @example Basic usage
  ```svelte
  <MetricsGrid
    metrics={[
      { label: "Conversion", value: "25", unit: "%" },
      { label: "Lost", value: "750", secondaryValue: "(75%)" },
    ]}
  />
  ```

  @example With colors and trends
  ```svelte
  <MetricsGrid
    metrics={[
      { label: "Revenue", value: "$12.5k", color: "#10b981", trend: "up" },
      { label: "Churn", value: "5%", color: "#ef4444", trend: "down" },
    ]}
  />
  ```

  @example Two-column layout
  ```svelte
  <MetricsGrid metrics={metrics} columns={2} />
  ```
-->
<script lang="ts">
  import { Minus, TrendingDown, TrendingUp } from "@lucide/svelte"

  import type { MetricItem } from "./insights-config"

  interface Props {
    metrics: MetricItem[]
    columns?: 2 | 4
    class?: string
  }

  let { metrics, columns = 4, class: className = "" }: Props = $props()

  const gridClass = $derived(
    columns === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4",
  )
</script>

<div class="grid gap-2 {gridClass} {className}">
  {#each metrics as metric (metric.label)}
    <div
      class="min-w-0 overflow-hidden rounded-lg border p-2.5"
      title={metric.tooltip ??
        `${metric.value}${metric.unit ?? ""}${metric.secondaryValue ? ` ${metric.secondaryValue}` : ""}`}
    >
      <div class="text-muted-foreground truncate text-xs">{metric.label}</div>
      <div class="mt-0.5 flex items-baseline gap-1 overflow-hidden">
        <span
          class="truncate text-sm font-semibold tabular-nums"
          style:color={metric.color}
        >
          {metric.value}{metric.unit ?? ""}
        </span>
        {#if metric.trend}
          <span
            class="flex shrink-0 items-center text-xs"
            class:text-emerald-500={metric.trend === "up"}
            class:text-red-500={metric.trend === "down"}
            class:text-muted-foreground={metric.trend === "flat"}
          >
            {#if metric.trend === "up"}
              <TrendingUp class="size-3" />
            {:else if metric.trend === "down"}
              <TrendingDown class="size-3" />
            {:else}
              <Minus class="size-3" />
            {/if}
          </span>
        {/if}
      </div>
      {#if metric.secondaryValue}
        <div class="text-muted-foreground mt-0.5 truncate text-xs">
          {metric.secondaryLabel
            ? `${metric.secondaryLabel}: `
            : ""}{metric.secondaryValue}
        </div>
      {/if}
    </div>
  {/each}
</div>
