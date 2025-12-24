<!--
  @component Kbd
  Displays keyboard shortcuts or key combinations.

  @example Single key
  ```svelte
  <Kbd>⌘K</Kbd>
  ```

  @example Key combination
  ```svelte
  <span class="inline-flex items-center gap-1">
    <Kbd>⌘</Kbd>
    <Kbd>⇧</Kbd>
    <Kbd>P</Kbd>
  </span>
  ```

  @example In a button
  ```svelte
  <button class="btn-sm-outline pr-2">
    Accept <Kbd>⏎</Kbd>
  </button>
  ```
-->
<script lang="ts">
  import type { Snippet } from "svelte"

  import { cn } from "@/utils"

  type Props = {
    /** CSS class for the kbd element */
    class?: string
    /** Keyboard key content */
    children: Snippet
  }

  let { class: className, children }: Props = $props()
</script>

<kbd class={cn("kbd", className)}>
  {@render children()}
</kbd>
