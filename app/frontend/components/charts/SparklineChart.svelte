<!--
  @component SparklineChart
  Compact trend visualization for inline/table use.
  Minimal SVG with auto-scaling to data range.

  @example Simple line
  ```svelte
  <SparklineChart data={[12, 15, 18, 14, 22, 28, 25]} />
  ```

  @example Area variant
  ```svelte
  <SparklineChart data={[12, 15, 18, 14, 22]} type="area" color="var(--chart-2)" />
  ```

  @example Bar variant
  ```svelte
  <SparklineChart data={[45, 52, 38, 65, 58]} type="bar" />
  ```
-->
<script lang="ts">
  import { DEFAULT_CHART_COLORS } from "./types"

  type DataPoint = number | { value: number; date?: string }

  interface Props {
    /** Data array - numbers or objects with value property */
    data: DataPoint[]
    /** Chart type */
    type?: "line" | "area" | "bar"
    /** Color (CSS variable or color value) */
    color?: string
    /** Show last point marker */
    showLastPoint?: boolean
    /** Show min/max markers */
    showMinMax?: boolean
    /** Width in pixels */
    width?: number
    /** Height in pixels */
    height?: number
    /** Line stroke width */
    strokeWidth?: number
    /** Use curved lines */
    curved?: boolean
    /** CSS class for container */
    class?: string
  }

  let {
    data,
    type = "line",
    color = DEFAULT_CHART_COLORS[0],
    showLastPoint = true,
    showMinMax = false,
    width = 100,
    height = 24,
    strokeWidth = 1.5,
    curved = true,
    class: className,
  }: Props = $props()

  // Normalize data to numbers
  const values = $derived(
    data.map((d) => (typeof d === "number" ? d : d.value)),
  )

  // Calculate bounds
  const minValue = $derived(Math.min(...values))
  const maxValue = $derived(Math.max(...values))
  const range = $derived(maxValue - minValue || 1)

  // Padding for stroke and points
  const padding = 2
  const chartWidth = $derived(width - padding * 2)
  const chartHeight = $derived(height - padding * 2)

  // Calculate points
  const points = $derived(
    values.map((v, i) => ({
      x: padding + (i / (values.length - 1 || 1)) * chartWidth,
      y: padding + chartHeight - ((v - minValue) / range) * chartHeight,
      value: v,
      isMin: v === minValue,
      isMax: v === maxValue,
      isLast: i === values.length - 1,
    })),
  )

  // Generate SVG path for line/area
  const linePath = $derived.by(() => {
    if (points.length < 2) return ""

    if (curved) {
      // Catmull-Rom spline for smooth curves
      let path = `M ${points[0].x} ${points[0].y}`

      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)]
        const p1 = points[i]
        const p2 = points[i + 1]
        const p3 = points[Math.min(points.length - 1, i + 2)]

        // Calculate control points
        const cp1x = p1.x + (p2.x - p0.x) / 6
        const cp1y = p1.y + (p2.y - p0.y) / 6
        const cp2x = p2.x - (p3.x - p1.x) / 6
        const cp2y = p2.y - (p3.y - p1.y) / 6

        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
      }

      return path
    } else {
      return points
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
        .join(" ")
    }
  })

  // Generate area path (line path + close to bottom)
  const areaPath = $derived.by(() => {
    if (points.length < 2) return ""
    const bottomY = height - padding
    return `${linePath} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`
  })

  // Bar chart dimensions
  const barWidth = $derived(Math.max(2, (chartWidth / values.length) * 0.7))
  const barGap = $derived(Math.max(1, (chartWidth / values.length) * 0.3))
</script>

<svg
  data-chart
  {width}
  {height}
  viewBox="0 0 {width} {height}"
  class="inline-block {className}"
  role="img"
  aria-label="Sparkline chart"
>
  {#if type === "line"}
    <!-- Line -->
    <path
      d={linePath}
      fill="none"
      stroke={color}
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- Min/Max markers -->
    {#if showMinMax}
      {#each points.filter((p) => p.isMin || p.isMax) as point, i (i)}
        <circle
          cx={point.x}
          cy={point.y}
          r="2"
          fill={point.isMax ? color : "var(--destructive)"}
        />
      {/each}
    {/if}

    <!-- Last point marker -->
    {#if showLastPoint && points.length > 0}
      {@const lastPoint = points[points.length - 1]}
      <circle cx={lastPoint.x} cy={lastPoint.y} r="2.5" fill={color} />
    {/if}
  {:else if type === "area"}
    <!-- Area fill -->
    <path d={areaPath} fill={color} opacity="0.2" />

    <!-- Area line -->
    <path
      d={linePath}
      fill="none"
      stroke={color}
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- Last point marker -->
    {#if showLastPoint && points.length > 0}
      {@const lastPoint = points[points.length - 1]}
      <circle cx={lastPoint.x} cy={lastPoint.y} r="2.5" fill={color} />
    {/if}
  {:else if type === "bar"}
    <!-- Bars -->
    {#each values as value, i (i)}
      {@const barHeight = Math.max(
        2,
        ((value - minValue) / range) * chartHeight,
      )}
      {@const x = padding + i * (barWidth + barGap)}
      {@const y = height - padding - barHeight}
      <rect {x} {y} width={barWidth} height={barHeight} fill={color} rx="1" />
    {/each}
  {/if}
</svg>
