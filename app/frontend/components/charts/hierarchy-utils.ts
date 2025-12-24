/**
 * Hierarchy chart utilities for treemap layout.
 * Used by TreemapChart component.
 */
import { hierarchy, treemap, treemapSquarify } from "d3-hierarchy"
import type { HierarchyRectangularNode } from "d3-hierarchy"

import type { FlatNode, NestedNode } from "./types"

/**
 * Convert flat data (with parent field) to nested hierarchy
 */
export function flatToNested<T extends FlatNode>(
  data: T[],
  options: { idField?: string; parentField?: string; nameField?: string } = {},
): NestedNode {
  const { idField = "id", parentField = "parent", nameField = "name" } = options

  // Create lookup map
  const nodeMap = new Map<string, NestedNode & { _id: string }>()
  let root: NestedNode | null = null

  // First pass: create nodes
  for (const item of data) {
    const id = String(item[idField])
    nodeMap.set(id, {
      _id: id,
      name: String(item[nameField] ?? id),
      value: item.value,
      children: [],
      ...item,
    })
  }

  // Second pass: build tree
  for (const item of data) {
    const id = String(item[idField])
    const parentId = item[parentField]
    const node = nodeMap.get(id)

    if (!node) continue

    if (parentId == null || parentId === "") {
      root = node
    } else {
      const parent = nodeMap.get(String(parentId))
      if (parent) {
        parent.children = parent.children ?? []
        parent.children.push(node)
      }
    }
  }

  if (!root) {
    throw new Error("No root node found (node without parent)")
  }

  return root
}

/**
 * Compute treemap layout
 */
export function computeTreemap<T extends NestedNode>(
  data: T,
  options: {
    width: number
    height: number
    value?: (d: T) => number
    children?: (d: T) => T[] | undefined
    padding?: number
    paddingInner?: number
    paddingOuter?: number
    round?: boolean
  },
): HierarchyRectangularNode<T>[] {
  const {
    width,
    height,
    value = (d) => d.value ?? 0,
    // Cast required: d.children is NestedNode[] but we need T[] where T extends NestedNode
    children = (d) => d.children as T[] | undefined,
    padding = 1,
    paddingInner,
    paddingOuter,
    round = true,
  } = options

  // Build hierarchy
  const root = hierarchy(data, children)
    .sum(value)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))

  // Create treemap layout
  const layout = treemap<T>()
    .size([width, height])
    .tile(treemapSquarify)
    .round(round)

  if (paddingInner !== undefined) {
    layout.paddingInner(paddingInner)
  } else {
    layout.padding(padding)
  }

  if (paddingOuter !== undefined) {
    layout.paddingOuter(paddingOuter)
  }

  // Compute layout
  layout(root)

  // Cast required: descendants() returns HierarchyNode<T>[], but after treemap layout
  // the nodes have rectangular properties (x0, x1, y0, y1)
  return root.descendants() as HierarchyRectangularNode<T>[]
}

/** Clear hierarchy cache (for testing) */
export function clearHierarchyCache(): void {
  // No cache currently, provided for API consistency
}
