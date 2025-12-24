import { SvelteSet } from "svelte/reactivity"

/**
 * Selection state for chart legend toggling.
 * Uses Svelte 5 reactivity.
 *
 * Follows LayerChart pattern: when selected is empty, ALL items visible.
 * When selected has items, only those items are visible.
 *
 * @example
 * ```svelte
 * <script>
 *   import { createSelectionState } from "./selection-state.svelte"
 *   const selection = createSelectionState<string>()
 *   const visibleSeries = $derived(
 *     series.filter(s => selection.isVisible(s.key))
 *   )
 * </script>
 * ```
 */
export function createSelectionState<T>() {
  // SvelteSet is reactive for mutations (add/delete/clear)
  const selected = new SvelteSet<T>()

  return {
    /** Get current selected items */
    get selected() {
      return selected
    },

    /** Check if item is selected */
    isSelected(key: T): boolean {
      return selected.has(key)
    },

    /**
     * Check if item should be visible.
     * Visible when: no selection (show all) OR item is selected.
     */
    isVisible(key: T): boolean {
      return selected.size === 0 || selected.has(key)
    },

    /** Toggle item selection */
    toggle(key: T): void {
      // Mutate the SvelteSet directly - it's reactive for mutations
      if (selected.has(key)) {
        selected.delete(key)
      } else {
        selected.add(key)
      }
    },

    /** Clear all selections (show all) */
    clear(): void {
      selected.clear()
    },
  }
}
