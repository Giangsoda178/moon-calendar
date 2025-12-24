<!--
  @component CalendarChart
  GitHub-style activity heatmap showing values over time.

  @example Basic year view
  ```svelte
  <CalendarChart
    data={activityData}
    x="date"
    y="commits"
  />
  ```

  @example Custom date range
  ```svelte
  <CalendarChart
    data={salesData}
    x="date"
    y="revenue"
    start={new Date('2024-01-01')}
    end={new Date('2024-12-31')}
    colorScheme="greens"
  />
  ```
-->
<script lang="ts" generics="T extends object">
  import { scaleThreshold } from "d3-scale"
  import { schemeBlues, schemeGreens, schemePurples } from "d3-scale-chromatic"
  import type { Snippet } from "svelte"

  import ChartTooltip from "./ChartTooltip.svelte"
  import { type CalendarColorScheme, type TooltipParams } from "./types"

  interface CalendarCell {
    date: Date
    dateKey: string
    value: number
    data: T | undefined
    x: number
    y: number
    weekIndex: number
    dayOfWeek: number
  }

  interface Props {
    /** Chart data array */
    data: T[]
    /** Key for date values */
    x: keyof T & string
    /** Key for numeric values */
    y: keyof T & string
    /** Start date (defaults to earliest in data) */
    start?: Date
    /** End date (defaults to latest in data) */
    end?: Date
    /** Cell size in pixels */
    cellSize?: number
    /** Gap between cells */
    cellGap?: number
    /** Color scheme: 'blues' | 'greens' | 'purples' | custom colors[] */
    colorScheme?: CalendarColorScheme
    /** Number of color levels (3-9, must match d3 scheme indices) */
    colorLevels?: 3 | 4 | 5 | 6 | 7 | 8 | 9
    /** Show month labels */
    showMonthLabels?: boolean
    /** Custom tooltip */
    tooltip?: Snippet<[TooltipParams<T>]>
    /** CSS class */
    class?: string
  }

  let {
    data,
    x,
    y,
    start,
    end,
    cellSize = 11,
    cellGap = 2,
    colorScheme = "blues",
    colorLevels = 5,
    showMonthLabels = true,
    tooltip: customTooltip,
    class: className,
  }: Props = $props()

  // Hover state
  let hoveredCell = $state<CalendarCell | null>(null)
  let mouseX = $state(0)
  let mouseY = $state(0)

  // Parse dates from data and create lookup map
  const dateMap = $derived(() => {
    // eslint-disable-next-line svelte/prefer-svelte-reactivity -- Map is local to derived, recreated on each update
    const map = new Map<string, T>()
    for (const d of data) {
      const date = d[x]
      let dateKey: string
      if (date instanceof Date) {
        dateKey = date.toISOString().split("T")[0]
      } else if (typeof date === "string") {
        dateKey = date.split("T")[0]
      } else {
        continue
      }
      map.set(dateKey, d)
    }
    return map
  })

  // Calculate date range
  const dateRange = $derived(() => {
    if (start && end) return { start, end }

    const dates = data
      .map((d) => {
        const date = d[x]
        return date instanceof Date ? date : new Date(String(date))
      })
      .filter((d) => !isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime())

    return {
      start: start ?? dates[0] ?? new Date(),
      end: end ?? dates[dates.length - 1] ?? new Date(),
    }
  })

  // Value domain
  const valueDomain = $derived(() => {
    const values = data.map((d) => Number(d[y]) || 0).filter((v) => v > 0)
    if (values.length === 0) return [0, 1]
    return [Math.min(...values), Math.max(...values)]
  })

  // Color scale
  const colors = $derived(() => {
    if (Array.isArray(colorScheme)) return colorScheme

    const schemes: Record<string, readonly string[]> = {
      blues: schemeBlues[colorLevels],
      greens: schemeGreens[colorLevels],
      purples: schemePurples[colorLevels],
    }

    return schemes[colorScheme] ?? schemes.blues
  })

  // Threshold scale for color
  const colorScale = $derived(() => {
    const [min, max] = valueDomain()
    const colorsArr = colors()

    if (max === min) {
      return scaleThreshold<number, string>()
        .domain([min + 1])
        .range([colorsArr[0], colorsArr[0]])
    }

    const step = (max - min) / (colorsArr.length - 1)
    const thresholds = Array.from(
      { length: colorsArr.length - 1 },
      (_, i) => min + step * (i + 1),
    )

    return scaleThreshold<number, string>().domain(thresholds).range(colorsArr)
  })

  // Generate calendar cells
  const cells = $derived(() => {
    const { start: startDate, end: endDate } = dateRange()
    const result: CalendarCell[] = []
    const dMap = dateMap()

    // Get first Sunday on or before start date
    // eslint-disable-next-line svelte/prefer-svelte-reactivity -- Date is local to derived, used for iteration
    const current = new Date(startDate)
    current.setHours(0, 0, 0, 0)
    const dayOffset = current.getDay()
    current.setDate(current.getDate() - dayOffset)

    let weekIndex = 0

    while (current <= endDate) {
      const dateKey = current.toISOString().split("T")[0]
      const dataItem = dMap.get(dateKey)
      const value = dataItem ? Number(dataItem[y]) || 0 : 0
      const dayOfWeek = current.getDay()

      result.push({
        date: new Date(current),
        dateKey,
        value,
        data: dataItem,
        x: weekIndex * (cellSize + cellGap),
        y: dayOfWeek * (cellSize + cellGap),
        weekIndex,
        dayOfWeek,
      })

      // Move to next day
      current.setDate(current.getDate() + 1)
      if (current.getDay() === 0) {
        weekIndex++
      }
    }

    return result
  })

  // Calculate month labels
  const monthLabels = $derived(() => {
    if (!showMonthLabels) return []

    const labels: { text: string; x: number }[] = []
    const cellsArr = cells()
    let lastMonth = -1

    for (const cell of cellsArr) {
      const month = cell.date.getMonth()
      if (month !== lastMonth && cell.dayOfWeek === 0) {
        labels.push({
          text: cell.date.toLocaleDateString("en-US", { month: "short" }),
          x: cell.x,
        })
        lastMonth = month
      }
    }

    return labels
  })

  // Calculate SVG dimensions
  const svgWidth = $derived(() => {
    const cellsArr = cells()
    if (cellsArr.length === 0) return 100
    const maxX = Math.max(...cellsArr.map((c) => c.x))
    // Add extra width for the last month label (e.g., "Dec" = ~24px)
    return maxX + cellSize + 30
  })

  // Month label row height (text + gap to cells)
  const monthLabelHeight = 20

  const svgHeight = $derived(() => {
    return 7 * (cellSize + cellGap) + (showMonthLabels ? monthLabelHeight : 0)
  })

  // Format date for tooltip
  function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Mouse handlers
  function handleMouseMove(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    mouseX = event.clientX - rect.left
    mouseY = event.clientY - rect.top
  }
</script>

<div
  data-chart
  class="flex h-full w-full flex-col {className}"
  onmousemove={handleMouseMove}
  role="img"
>
  <!-- Calendar SVG - centered and scales to fill container -->
  <div class="grid min-h-0 flex-1 place-items-center overflow-hidden">
    <svg
      viewBox="0 0 {svgWidth()} {svgHeight()}"
      class="block h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <!-- Month labels -->
      {#if showMonthLabels}
        <g transform="translate(0, 10)">
          {#each monthLabels() as label (label.x)}
            <text
              x={label.x}
              y={0}
              class="fill-muted-foreground text-[10px]"
              dominant-baseline="middle"
            >
              {label.text}
            </text>
          {/each}
        </g>
      {/if}

      <!-- Calendar cells - positioned below month labels with gap -->
      <g transform="translate(0, {showMonthLabels ? monthLabelHeight : 0})">
        {#each cells() as cell (cell.dateKey)}
          <rect
            x={cell.x}
            y={cell.y}
            width={cellSize}
            height={cellSize}
            rx={2}
            fill={cell.value > 0 ? colorScale()(cell.value) : "var(--muted)"}
            class="cursor-pointer"
            role="img"
            aria-label="{formatDate(cell.date)}: {cell.value}"
            onmouseenter={() => (hoveredCell = cell)}
            onmouseleave={() => (hoveredCell = null)}
          />
        {/each}
      </g>
    </svg>
  </div>

  <!-- Color legend at bottom -->
  <div
    class="text-muted-foreground mt-2 flex items-center justify-center gap-1 text-xs"
  >
    <span>Less</span>
    {#each colors() as color, i (i)}
      <span class="h-3 w-3 rounded-sm" style:background-color={color}></span>
    {/each}
    <span>More</span>
  </div>

  <!-- Tooltip -->
  {#if hoveredCell}
    <div
      class="pointer-events-none absolute z-20"
      style:left="{mouseX + 10}px"
      style:top="{mouseY - 40}px"
    >
      {#if customTooltip && hoveredCell.data}
        {@render customTooltip({
          data: hoveredCell.data,
          index: 0,
          color: colorScale()(hoveredCell.value),
          value: hoveredCell.value,
        })}
      {:else}
        <ChartTooltip
          color={hoveredCell.value > 0
            ? colorScale()(hoveredCell.value)
            : "var(--muted)"}
        >
          <div class="flex flex-col gap-1">
            <span class="font-medium">{formatDate(hoveredCell.date)}</span>
            <span>{y}: {hoveredCell.value.toLocaleString()}</span>
          </div>
        </ChartTooltip>
      {/if}
    </div>
  {/if}
</div>
