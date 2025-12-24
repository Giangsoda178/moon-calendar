<!--
  @component BottomNavItem
  Individual item for BottomNav. Can be used standalone or via BottomNav items prop.
  Follows Basecoat styling with proper focus states, transitions, and badge patterns.

  @example
  ```svelte
  <BottomNavItem icon={Home} label="Home" href="/" active />
  ```
-->
<script lang="ts">
  import type { IconProps } from "@lucide/svelte"
  import type { Component } from "svelte"

  import { cn, inertiaAction } from "@/utils"

  type Props = {
    /** Lucide icon component */
    icon: Component<IconProps>
    /** Label text */
    label: string
    /** Navigation URL */
    href: string
    /** Is this item currently active */
    active?: boolean
    /** Badge count (number or true for dot) */
    badge?: number | boolean
    /** Additional CSS classes */
    class?: string
  }

  let {
    icon: Icon,
    label,
    href,
    active = false,
    badge,
    class: className,
  }: Props = $props()

  let showBadge = $derived(badge !== undefined && badge !== false)
  let badgeText = $derived(typeof badge === "number" ? String(badge) : "")
</script>

<a
  {href}
  use:inertiaAction
  class={cn(
    "flex min-w-12 flex-1 flex-col items-center justify-center gap-0.5 transition-colors",
    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset",
    active && "text-primary",
    !active && "text-muted-foreground hover:text-foreground",
    className,
  )}
  aria-current={active ? "page" : undefined}
>
  <span class="relative">
    <Icon class="size-5" />
    {#if showBadge}
      <span
        class={cn(
          "bg-destructive text-destructive-foreground absolute -top-1 -right-1.5 flex items-center justify-center rounded-full",
          badgeText
            ? "min-w-4 px-1 text-[10px] leading-4 font-medium"
            : "size-2",
        )}
      >
        {badgeText}
      </span>
    {/if}
  </span>
  <span class="text-[10px] leading-none font-medium">{label}</span>
</a>
