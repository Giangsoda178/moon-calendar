<!--
  @component TreemapChart
  Rectangular hierarchy visualization showing proportions.
  Good for showing file sizes, budgets, or category breakdowns.

  @example Nested data
  ```svelte
  <TreemapChart
    data={{
      name: 'root',
      children: [
        { name: 'Category A', value: 100 },
        { name: 'Category B', children: [
          { name: 'B1', value: 50 },
          { name: 'B2', value: 30 }
        ]}
      ]
    }}
  />
  ```

  @example Flat data (with parent)
  ```svelte
  <TreemapChart
    data={[
      { id: 'root', name: 'All' },
      { id: 'a', parent: 'root', name: 'Category A', value: 100 },
      { id: 'b', parent: 'root', name: 'Category B', value: 80 }
    ]}
    flat
  />
  ```

  @example With drill-down
  ```svelte
  <TreemapChart data={data} drillDown />
  ```
-->
<script lang="ts" generics="T extends NestedNode | FlatNode[]">
  import type { HierarchyRectangularNode } from "d3-hierarchy"
  import type { Snippet } from "svelte"

  import ChartTooltip from "./ChartTooltip.svelte"
  import { computeTreemap, flatToNested } from "./hierarchy-utils"
  import {
    DEFAULT_CHART_COLORS,
    type FlatNode,
    type NestedNode,
    type TooltipParams,
  } from "./types"

  interface Props {
    /** Hierarchical data (nested or flat with parent field) */
    data: T
    /** Whether data is flat (array with parent references) */
    flat?: boolean
    /** Field for node name */
    nameField?: string
    /** Field for node value */
    valueField?: string
    /** Field for parent ID (flat mode) */
    parentField?: string
    /** Field for node ID (flat mode) */
    idField?: string
    /** Colors by depth level */
    colors?: string[]
    /** Padding between cells */
    padding?: number
    /** Inner padding (between siblings) */
    paddingInner?: number
    /** Outer padding (from parent) */
    paddingOuter?: number
    /** Enable drill-down on click */
    drillDown?: boolean
    /** Show labels on cells */
    showLabels?: boolean
    /** Min width to show label */
    labelMinWidth?: number
    /** Min height to show label */
    labelMinHeight?: number
    /** Custom tooltip */
    tooltip?: Snippet<[TooltipParams<NestedNode>]>
    /** CSS class */
    class?: string
  }

  let {
    data,
    flat = false,
    nameField = "name",
    valueField = "value",
    parentField = "parent",
    idField = "id",
    colors = [...DEFAULT_CHART_COLORS],
    padding = 2,
    paddingInner,
    paddingOuter,
    drillDown = false,
    showLabels = true,
    labelMinWidth = 40,
    labelMinHeight = 20,
    tooltip: customTooltip,
    class: className,
  }: Props = $props()

  // State
  let containerWidth = $state(100)
  let containerHeight = $state(300)
  let hoveredNode = $state<HierarchyRectangularNode<NestedNode> | null>(null)
  let drillRoot = $state<NestedNode | null>(null)
  let mouseX = $state(0)
  let mouseY = $state(0)

  // Type guard for nested node structure
  function isNestedNode(value: unknown): value is NestedNode {
    return (
      typeof value === "object" &&
      value !== null &&
      "name" in value &&
      !Array.isArray(value)
    )
  }

  // Convert flat to nested if needed with runtime validation
  const nestedData = $derived(() => {
    if (!flat) {
      if (!isNestedNode(data)) {
        console.warn("TreemapChart: Expected nested data when flat=false")
        return { name: "root", value: 0 } as NestedNode
      }
      return data
    }

    if (!Array.isArray(data)) {
      console.warn("TreemapChart: Expected flat data array when flat=true")
      return { name: "root", value: 0 } as NestedNode
    }
    return flatToNested(data, {
      idField,
      parentField,
      nameField,
    })
  })

  // Current root for drill-down
  const currentRoot = $derived(drillRoot ?? nestedData())

  // Compute treemap layout
  const nodes = $derived(() => {
    return computeTreemap(currentRoot, {
      width: containerWidth,
      height: containerHeight,
      value: (d) => Number(d[valueField]) || 0,
      children: (d) => d.children,
      padding,
      paddingInner,
      paddingOuter,
    })
  })

  // Leaf nodes only (for rendering)
  const leafNodes = $derived(
    nodes().filter((n) => !n.children || n.children.length === 0),
  )

  // Get color for depth
  function getColorForDepth(depth: number): string {
    return colors[depth % colors.length]
  }

  // Check if label should show
  function shouldShowLabel(
    node: HierarchyRectangularNode<NestedNode>,
  ): boolean {
    if (!showLabels) return false
    const width = node.x1 - node.x0
    const height = node.y1 - node.y0
    return width >= labelMinWidth && height >= labelMinHeight
  }

  // Handle drill-down click
  function handleClick(node: HierarchyRectangularNode<NestedNode>): void {
    if (!drillDown) return
    if (node.children && node.children.length > 0) {
      drillRoot = node.data
    }
  }

  // Drill up to parent
  function drillUp(): void {
    drillRoot = null
  }

  // Format value
  function formatValue(value: number | undefined): string {
    if (value == null) return ""
    return value.toLocaleString()
  }

  // Handle mouse move for tooltip positioning
  function handleMouseMove(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    mouseX = event.clientX - rect.left
    mouseY = event.clientY - rect.top
  }

  // Bind container size
  function handleResize(node: HTMLElement): { destroy: () => void } {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerWidth = entry.contentRect.width
        containerHeight = entry.contentRect.height
      }
    })
    observer.observe(node)
    return {
      destroy() {
        observer.disconnect()
      },
    }
  }
</script>

<div
  data-chart
  class="relative h-full w-full {className}"
  use:handleResize
  onmousemove={handleMouseMove}
  role="img"
>
  <!-- Drill-up button -->
  {#if drillDown && drillRoot}
    <button
      type="button"
      class="bg-background/80 hover:bg-background absolute top-2 left-2 z-10 rounded px-2 py-1 text-xs"
      onclick={drillUp}
    >
      ← Back
    </button>
  {/if}

  <svg
    width="100%"
    height="100%"
    viewBox="0 0 {containerWidth} {containerHeight}"
  >
    {#each leafNodes as node (node.data.name ?? node.value)}
      {@const width = node.x1 - node.x0}
      {@const height = node.y1 - node.y0}
      <g
        transform="translate({node.x0}, {node.y0})"
        class="cursor-pointer"
        onmouseenter={() => (hoveredNode = node)}
        onmouseleave={() => (hoveredNode = null)}
        onclick={() => handleClick(node)}
        role="button"
        tabindex="0"
        onkeydown={(e) => e.key === "Enter" && handleClick(node)}
      >
        <!-- Cell rectangle -->
        <rect
          {width}
          {height}
          rx={2}
          fill={getColorForDepth(node.depth)}
          fill-opacity={hoveredNode && hoveredNode !== node ? 0.6 : 1}
          class="transition-[fill-opacity] duration-150"
        />

        <!-- Cell label -->
        {#if shouldShowLabel(node)}
          <foreignObject
            x={0}
            y={0}
            {width}
            {height}
            class="pointer-events-none"
          >
            <div
              class="flex h-full w-full flex-col items-center justify-center overflow-hidden p-1 text-center"
            >
              <span class="w-full truncate text-xs font-medium text-white/90">
                {node.data[nameField] ?? ""}
              </span>
              {#if height > 35}
                <span class="w-full truncate text-xs text-white/80">
                  {formatValue(node.value)}
                </span>
              {/if}
            </div>
          </foreignObject>
        {/if}
      </g>
    {/each}
  </svg>

  {#if hoveredNode}
    <div
      class="pointer-events-none absolute z-20"
      style:left="{mouseX + 10}px"
      style:top="{mouseY + 10}px"
    >
      {#if customTooltip}
        {@render customTooltip({
          data: hoveredNode.data,
          index: 0,
          color: getColorForDepth(hoveredNode.depth),
          value: hoveredNode.value,
        })}
      {:else}
        <ChartTooltip color={getColorForDepth(hoveredNode.depth)}>
          <div class="flex flex-col gap-1">
            <span class="font-medium">{hoveredNode.data[nameField]}</span>
            <span>Value: {formatValue(hoveredNode.value)}</span>
            {#if hoveredNode.parent}
              <span class="text-muted-foreground">
                Parent: {hoveredNode.parent.data[nameField]}
              </span>
            {/if}
          </div>
        </ChartTooltip>
      {/if}
    </div>
  {/if}
</div>
