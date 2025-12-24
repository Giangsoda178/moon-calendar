/**
 * Popover coordination state.
 *
 * Svelte 5 idiomatic approach: shared reactive state via module singleton.
 * Components read `activePopoverId` reactively - no events, no callbacks.
 *
 * @example Usage in a popover component
 * ```svelte
 * <script lang="ts">
 *   import { popoverState } from "@/runes/popover-state.svelte"
 *
 *   const id = "my-popover"
 *
 *   // Reactive: auto-closes when another popover opens
 *   const isOpen = $derived(popoverState.activeId === id)
 *
 *   function open() {
 *     popoverState.activeId = id
 *   }
 *
 *   function close() {
 *     if (popoverState.activeId === id) {
 *       popoverState.activeId = null
 *     }
 *   }
 * </script>
 * ```
 */

class PopoverState {
  /** Currently active popover ID, or null if none open */
  activeId = $state<string | null>(null)

  /** Open a popover by ID (closes any other) */
  open(id: string) {
    this.activeId = id
  }

  /** Close a specific popover (or any if id matches) */
  close(id?: string) {
    if (!id || this.activeId === id) {
      this.activeId = null
    }
  }

  /** Check if a specific popover is open */
  isOpen(id: string): boolean {
    return this.activeId === id
  }
}

/** Singleton popover state - shared across all components */
export const popoverState = new PopoverState()
