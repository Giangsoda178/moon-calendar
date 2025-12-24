<!--
  @component RadialProgressChart
  Circular progress indicator for single metrics.
  Pure SVG implementation - no LayerChart dependency.

  @example Basic usage
  ```svelte
  <RadialProgressChart value={67} />
  ```

  @example With label
  ```svelte
  <RadialProgressChart value={750} max={1000} label="Sales Target" />
  ```

  @example Customized
  ```svelte
  <RadialProgressChart
    value={85}
    max={100}
    label="Quota"
    color="var(--chart-1)"
    trackColor="var(--muted)"
    size={120}
    strokeWidth={8}
  />
  ```
-->
<script lang="ts">
  import { cubicOut } from "svelte/easing"
  import { Tween } from "svelte/motion"

  interface Props {
    /** Current value */
    value: number
    /** Maximum value */
    max?: number
    /** Label text shown below percentage */
    label?: string
    /** Show percentage text in center */
    showPercentage?: boolean
    /** Progress color */
    color?: string
    /** Track (background) color */
    trackColor?: string
    /** Size in pixels */
    size?: number
    /** Stroke width */
    strokeWidth?: number
    /** Animate value changes */
    animated?: boolean
    /** CSS class for container */
    class?: string
  }

  let {
    value,
    max = 100,
    label,
    showPercentage = true,
    color = "var(--chart-1)",
    trackColor,
    size = 100,
    strokeWidth = 8,
    animated = true,
    class: className,
  }: Props = $props()

  // Calculate percentage (clamped 0-100)
  const targetPercentage = $derived(
    Math.min(100, Math.max(0, (value / max) * 100)),
  )

  // Tween class for smooth animation (Svelte 5 API)
  // Note: animated is intentionally captured at mount - Tween duration doesn't need to be reactive
  const animatedPercentage = new Tween(0, {
    duration: animated ? 700 : 0,
    easing: cubicOut,
  })

  // Update tween target when value changes
  $effect(() => {
    animatedPercentage.target = targetPercentage
  })

  // SVG calculations
  const radius = $derived((size - strokeWidth) / 2)
  const circumference = $derived(2 * Math.PI * radius)
  const strokeDashoffset = $derived(
    circumference - (animatedPercentage.current / 100) * circumference,
  )

  // Center position
  const center = $derived(size / 2)
</script>

<div
  data-chart
  class="relative inline-flex flex-col items-center justify-center {className}"
>
  <svg
    width={size}
    height={size}
    viewBox="0 0 {size} {size}"
    class="-rotate-90"
  >
    <!-- Track (background circle) -->
    <circle
      cx={center}
      cy={center}
      r={radius}
      fill="none"
      stroke={trackColor ?? "currentColor"}
      stroke-width={strokeWidth}
      class={trackColor ? "" : "opacity-10"}
    />

    <!-- Progress arc -->
    <circle
      cx={center}
      cy={center}
      r={radius}
      fill="none"
      stroke={color}
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-dasharray={circumference}
      stroke-dashoffset={strokeDashoffset}
    />
  </svg>

  <!-- Center content (positioned absolutely over SVG) -->
  <div
    class="absolute flex flex-col items-center justify-center"
    style:width="{size}px"
    style:height="{size}px"
  >
    {#if showPercentage}
      <span class="text-2xl font-bold tabular-nums">
        {Math.round(targetPercentage)}%
      </span>
    {/if}
    {#if label}
      <span class="text-muted-foreground text-xs">{label}</span>
    {/if}
  </div>
</div>
