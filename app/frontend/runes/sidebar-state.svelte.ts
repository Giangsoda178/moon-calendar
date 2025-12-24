/**
 * Sidebar state management.
 *
 * Svelte 5 idiomatic approach: class with $state fields.
 * Each sidebar registers itself, state is reactive across components.
 *
 * @example Toggle sidebar from any component
 * ```svelte
 * <script lang="ts">
 *   import { sidebarState } from "@/runes/sidebar-state.svelte"
 * </script>
 *
 * <button onclick={() => sidebarState.toggle("app-sidebar")}>
 *   Toggle
 * </button>
 * ```
 *
 * @example In sidebar component
 * ```svelte
 * <script lang="ts">
 *   import { sidebarState } from "@/runes/sidebar-state.svelte"
 *
 *   const id = "app-sidebar"
 *
 *   // Register on mount, reactive binding
 *   $effect(() => {
 *     sidebarState.register(id, true)
 *     return () => sidebarState.unregister(id)
 *   })
 *
 *   // Reactive: UI updates automatically
 *   const isOpen = $derived(sidebarState.isOpen(id))
 * </script>
 *
 * <aside aria-hidden={!isOpen}>...</aside>
 * ```
 */

import { SvelteMap } from "svelte/reactivity"

class SidebarState {
  /** Map of sidebar ID to open state */
  #sidebars = new SvelteMap<string, boolean>()

  /** Register a sidebar with initial state */
  register(id: string, initialOpen = true) {
    if (!this.#sidebars.has(id)) {
      this.#sidebars.set(id, initialOpen)
    }
  }

  /** Unregister a sidebar */
  unregister(id: string) {
    this.#sidebars.delete(id)
  }

  /** Check if sidebar is open */
  isOpen(id: string): boolean {
    return this.#sidebars.get(id) ?? true
  }

  /** Open a sidebar */
  open(id: string) {
    this.#sidebars.set(id, true)
  }

  /** Close a sidebar */
  close(id: string) {
    this.#sidebars.set(id, false)
  }

  /** Toggle a sidebar */
  toggle(id: string) {
    this.#sidebars.set(id, !this.isOpen(id))
  }
}

/** Singleton sidebar state - shared across all components */
export const sidebarState = new SidebarState()
