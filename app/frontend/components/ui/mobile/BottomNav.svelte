<!--
  @component BottomNav
  Fixed bottom tab navigation for mobile apps.
  Follows Basecoat styling with proper borders, shadows, and safe area handling.

  @example Basic usage with items prop
  ```svelte
  <script lang="ts">
    import { Home, Search, Bell, User } from "@lucide/svelte"
    import BottomNav from "@/components/ui/mobile/BottomNav.svelte"

    const items = [
      { icon: Home, label: "Home", href: "/" },
      { icon: Search, label: "Search", href: "/search" },
      { icon: Bell, label: "Alerts", href: "/alerts", badge: 5 },
      { icon: User, label: "Profile", href: "/profile" },
    ]
  </script>

  <BottomNav {items} />
  ```

  @example Manual items via children
  ```svelte
  <script lang="ts">
    import { Home, Search, Bell, User } from "@lucide/svelte"
    import BottomNav from "@/components/ui/mobile/BottomNav.svelte"
    import BottomNavItem from "@/components/ui/mobile/BottomNavItem.svelte"
    import { page } from "@inertiajs/svelte"

    let currentPath = $derived($page.url)
  </script>

  <BottomNav>
    <BottomNavItem icon={Home} label="Home" href="/" active={currentPath === "/"} />
    <BottomNavItem icon={Search} label="Search" href="/search" active={currentPath === "/search"} />
    <BottomNavItem icon={Bell} label="Alerts" href="/alerts" badge={3} active={currentPath === "/alerts"} />
    <BottomNavItem icon={User} label="Profile" href="/profile" active={currentPath === "/profile"} />
  </BottomNav>
  ```
-->
<script lang="ts">
  import { page } from "@inertiajs/svelte"
  import { type IconProps } from "@lucide/svelte"
  import type { Component, Snippet } from "svelte"

  import { cn } from "@/utils"

  import BottomNavItem from "./BottomNavItem.svelte"

  export type BottomNavItemData = {
    icon: Component<IconProps>
    label: string
    href: string
    badge?: number | boolean
  }

  type Props = {
    /** Data-driven items array */
    items?: BottomNavItemData[]
    /** Manual items via slot */
    children?: Snippet
    /** Additional CSS classes */
    class?: string
  }

  let { items, children, class: className }: Props = $props()

  // Get current path for auto-active detection
  let currentPath = $derived($page?.url ?? "")

  function isActive(href: string): boolean {
    // Strip query params and hash from current path for comparison
    const pathOnly = currentPath.split("?")[0].split("#")[0]
    // Exact match of path portion only
    return pathOnly === href
  }
</script>

<nav
  class={cn(
    "border-border bg-background fixed inset-x-0 bottom-0 z-50 flex flex-col border-t shadow-[0_-1px_3px_0_rgb(0_0_0_/_0.05)]",
    className,
  )}
  aria-label="Main navigation"
>
  <!-- Nav items row -->
  <div class="flex h-14">
    {#if items}
      {#each items as item (item.href)}
        <BottomNavItem
          icon={item.icon}
          label={item.label}
          href={item.href}
          badge={item.badge}
          active={isActive(item.href)}
        />
      {/each}
    {:else if children}
      {@render children()}
    {/if}
  </div>
  <!-- Safe area spacer -->
  <div class="pb-safe"></div>
</nav>
