<!--
  @component SafeArea
  Wrapper component that applies safe area insets for mobile devices with notches.

  @example Basic usage
  ```svelte
  <SafeArea top bottom>
    <div>Content safe from notch and home indicator</div>
  </SafeArea>
  ```

  @example All sides
  ```svelte
  <SafeArea all>
    <div>Full safe area padding</div>
  </SafeArea>
  ```

  @example With custom class
  ```svelte
  <SafeArea top class="bg-background">
    <AppBar title="Settings" />
  </SafeArea>
  ```
-->
<script lang="ts">
  import type { Snippet } from "svelte"

  import { cn } from "@/utils"

  type Props = {
    /** Apply top safe area padding */
    top?: boolean
    /** Apply bottom safe area padding */
    bottom?: boolean
    /** Apply left safe area padding */
    left?: boolean
    /** Apply right safe area padding */
    right?: boolean
    /** Apply all safe area padding */
    all?: boolean
    /** Additional CSS classes */
    class?: string
    /** Content */
    children: Snippet
  }

  let {
    top = false,
    bottom = false,
    left = false,
    right = false,
    all = false,
    class: className,
    children,
  }: Props = $props()

  let classes = $derived(
    cn(
      all && "p-safe",
      !all && top && "pt-safe",
      !all && bottom && "pb-safe",
      !all && left && "pl-safe",
      !all && right && "pr-safe",
      className,
    ),
  )
</script>

<div class={classes}>
  {@render children()}
</div>
