<!--
  @component ChartContainer
  Simple wrapper for chart components with consistent styling.
  Provides height constraint and optional CSS class customization.

  @example
  ```svelte
  <ChartContainer class="h-[300px]">
    <BarChart {data} x="product" y="sales" />
  </ChartContainer>
  ```
-->
<script lang="ts">
  import type { Snippet } from "svelte"

  import { cn } from "@/utils"

  type Props = {
    /** Additional CSS classes */
    class?: string
    /** Chart content */
    children: Snippet
  }

  const uid = $props.id()

  let { class: className, children }: Props = $props()

  const chartId = `chart-${uid.replace(/:/g, "")}`
</script>

<div data-chart={chartId} class={cn("h-full w-full", className)}>
  {@render children()}
</div>
