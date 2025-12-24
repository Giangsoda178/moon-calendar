<!--
  @component ChartTooltip
  Tooltip wrapper with consistent styling and optional color indicator.
  Use inside LayerChart's Tooltip.Root for positioning.

  @example Basic usage
  ```svelte
  <Tooltip.Root variant="none">
    {#snippet children({ data })}
      <ChartTooltip>
        {data.month}: ${data.value}
      </ChartTooltip>
    {/snippet}
  </Tooltip.Root>
  ```

  @example With color indicator
  ```svelte
  <ChartTooltip color="var(--chart-1)">
    Sales: $1,234
  </ChartTooltip>
  ```

  @example With line indicator
  ```svelte
  <ChartTooltip color="var(--chart-2)" indicator="line">
    Revenue: $5,678
  </ChartTooltip>
  ```
-->
<script lang="ts">
  import type { Snippet } from "svelte"

  type Props = {
    /** Tooltip content */
    children: Snippet
    /** Color for the indicator (CSS variable or color value) */
    color?: string
    /** Indicator style: dot, line, or none */
    indicator?: "dot" | "line" | "none"
    /** Additional CSS classes */
    class?: string
  }

  let { children, color, indicator = "dot", class: className }: Props = $props()
</script>

<div
  class="bg-popover text-popover-foreground flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl {className}"
>
  {#if color && indicator !== "none"}
    <div
      class="mt-0.5 shrink-0 rounded-[2px]"
      class:size-2.5={indicator === "dot"}
      class:h-full={indicator === "line"}
      class:w-1={indicator === "line"}
      class:min-h-4={indicator === "line"}
      style="background-color: {color};"
    ></div>
  {/if}
  <div class="flex-1">
    {@render children()}
  </div>
</div>
