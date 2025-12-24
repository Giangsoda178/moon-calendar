<!--
  @component Sidebar
  A composable, themeable and customizable sidebar component for app navigation.
  Supports responsive behavior, collapsible sections, and SPA navigation via Inertia when available.

  Data-driven construction via `menu` prop:
  - Groups: `{ type: "group", label: "Group Name", items: [...] }`
  - Items: `{ label: "Item", url: "/path", icon?: Component }`
  - Submenus: `{ type: "submenu", label: "Submenu", icon?: Component, open?: boolean, items: [...] }`
  - Separators: `{ type: "separator" }`

  @example Data-driven sidebar
  ```svelte
  <script>
    import { Home, Settings, Users } from "@lucide/svelte"

    const menu = [
      {
        type: "group",
        label: "Platform",
        items: [
          { label: "Home", url: "/", icon: Home },
          { label: "Users", url: "/users", icon: Users },
        ]
      },
      { type: "separator" },
      {
        type: "group",
        label: "Settings",
        items: [
          {
            type: "submenu",
            label: "Account",
            icon: Settings,
            items: [
              { label: "General", url: "/settings/general" },
              { label: "Billing", url: "/settings/billing" },
            ]
          }
        ]
      }
    ]
  </script>

  <Sidebar {menu}>
    {#snippet header()}
      <div class="flex items-center gap-2 px-2 py-4">
        <img src="/logo.svg" alt="Logo" class="size-8" />
        <span class="font-semibold">My App</span>
      </div>
    {/snippet}
  </Sidebar>
  ```

  @example Toggle sidebar
  ```svelte
  <script>
    let sidebarOpen = $state(true)
  </script>

  <Button onclick={() => (sidebarOpen = !sidebarOpen)}>Toggle</Button>
  <Sidebar bind:open={sidebarOpen} {menu} />
  ```
-->
<script lang="ts">
  import { type IconProps } from "@lucide/svelte"
  import type { Component, Snippet } from "svelte"
  import { onMount, setContext } from "svelte"

  import { IsMobile } from "@/runes/is-mobile.svelte"
  import { sidebarState } from "@/runes/sidebar-state.svelte"
  import { analyzeLink, cn, inertiaAction } from "@/utils"

  export type SidebarItem = {
    type?: "item"
    /** Display label */
    label: string
    /** Navigation URL */
    url?: string
    /** Lucide icon component */
    icon?: Component<IconProps>
    /** Whether this is the current page */
    current?: boolean
    /** HTTP method for Inertia */
    method?: "get" | "post" | "put" | "patch" | "delete"
    /** Keep mobile sidebar open on click */
    keepMobileSidebarOpen?: boolean
    /** Click handler (for button mode) */
    onclick?: (event: MouseEvent) => void
  }

  export type SidebarSubmenu = {
    type: "submenu"
    /** Submenu label */
    label: string
    /** Lucide icon component */
    icon?: Component<IconProps>
    /** Initially open */
    open?: boolean
    /** Submenu items */
    items: SidebarItem[]
  }

  export type SidebarGroup = {
    type: "group"
    /** Group label */
    label?: string
    /** Group items */
    items: (SidebarItem | SidebarSubmenu)[]
  }

  export type SidebarSeparator = {
    type: "separator"
  }

  export type SidebarMenu = (SidebarGroup | SidebarSeparator)[]

  type Props = {
    /** Unique ID for the sidebar */
    id?: string
    /** Data-driven menu array */
    menu?: SidebarMenu
    /** Accessibility label */
    label?: string
    /** Whether sidebar is open (bindable) */
    open?: boolean
    /** Side of the screen */
    side?: "left" | "right"
    /** Breakpoint for responsive behavior (px) */
    breakpoint?: number
    /** Initial mobile open state */
    initialMobileOpen?: boolean
    /** CSS class for sidebar */
    class?: string
    /** CSS class for nav content */
    contentClass?: string
    /** Header slot */
    header?: Snippet
    /** Footer slot */
    footer?: Snippet
    /** Main content (alternative to menu prop) */
    children?: Snippet
  }

  // Mobile detection for default open state
  const isMobile = new IsMobile()

  let {
    id = `sidebar-${Math.random().toString(36).slice(2, 9)}`,
    menu,
    label = "Sidebar navigation",
    open = $bindable(!isMobile.current),
    side = "left",
    breakpoint = 768,
    initialMobileOpen = false,
    class: className,
    contentClass,
    header,
    footer,
    children,
  }: Props = $props()

  let sidebarEl = $state<HTMLElement | null>(null)

  // Provide context for child components (backward compatibility)
  setContext("sidebar", {
    get id() {
      return id
    },
    get breakpoint() {
      return breakpoint
    },
    close: () => {
      open = false
    },
  })

  // Initialize based on screen size
  function initializeState() {
    if (typeof window === "undefined") return
    const isMobile = window.innerWidth < breakpoint
    const initialOpen = isMobile ? initialMobileOpen : true
    sidebarState.register(id, initialOpen)
    open = initialOpen
  }

  // Sync local `open` prop with global sidebar state
  $effect(() => {
    const isOpen = sidebarState.isOpen(id)
    if (open !== isOpen) {
      open = isOpen
    }
  })

  // Sync global state when local `open` changes (e.g., via bind:open)
  $effect(() => {
    if (sidebarState.isOpen(id) !== open) {
      if (open) {
        sidebarState.open(id)
      } else {
        sidebarState.close(id)
      }
    }
  })

  // Auto-close sidebar when viewport transitions to mobile (not on manual toggle)
  let wasMobile = $state(isMobile.current)
  $effect(() => {
    const nowMobile = isMobile.current
    // Only close when transitioning FROM desktop TO mobile
    if (nowMobile && !wasMobile && open) {
      sidebarState.close(id)
    }
    wasMobile = nowMobile
  })

  // Close sidebar on backdrop/menu click (mobile)
  // Uses sidebarState.close() to avoid race condition with sync effects
  function handleSidebarClick(event: MouseEvent) {
    const target = event.target as HTMLElement
    const nav = sidebarEl?.querySelector("nav")
    const isMobile = window.innerWidth < breakpoint

    // On mobile, close when clicking link/button (unless data-keep-mobile-sidebar-open)
    if (
      isMobile &&
      target.closest("a, button") &&
      !target.closest("[data-keep-mobile-sidebar-open]")
    ) {
      ;(document.activeElement as HTMLElement)?.blur?.()
      sidebarState.close(id)
      return
    }

    // Close when clicking on sidebar backdrop (outside nav)
    if (target === sidebarEl || (nav && !nav.contains(target))) {
      ;(document.activeElement as HTMLElement)?.blur?.()
      sidebarState.close(id)
    }
  }

  // Update aria-current for current page links
  function updateCurrentPageLinks() {
    if (!sidebarEl) return
    const currentPath = window.location.pathname.replace(/\/$/, "")

    sidebarEl.querySelectorAll("a").forEach((link) => {
      if (link.hasAttribute("data-ignore-current")) return

      const linkUrl = new URL(link.href)
      const linkPath = linkUrl.pathname.replace(/\/$/, "")

      // Skip hash-only links (same path but with hash) - they shouldn't get aria-current
      const isHashOnly = linkPath === currentPath && linkUrl.hash

      if (linkPath === currentPath && !isHashOnly) {
        link.setAttribute("aria-current", "page")
      } else {
        link.removeAttribute("aria-current")
      }
    })
  }

  onMount(() => {
    initializeState()
    updateCurrentPageLinks()

    // Mark as initialized so CSS doesn't hide it during SSR
    sidebarEl?.setAttribute("data-sidebar-initialized", "")

    // Listen for navigation changes (Inertia)
    window.addEventListener("popstate", updateCurrentPageLinks)

    return () => {
      sidebarState.unregister(id)
      window.removeEventListener("popstate", updateCurrentPageLinks)
    }
  })
</script>

{#snippet renderItem(item: SidebarItem)}
  {@const link = analyzeLink(item.url)}
  {@const navOptions = {
    method: item.method || "get",
    preserveScroll: false,
    preserveState: item.method && item.method !== "get",
  }}
  <li>
    {#if link.href && link.useInertia && inertiaAction}
      <a
        href={link.href}
        use:inertiaAction={navOptions}
        aria-current={item.current ? "page" : undefined}
        data-keep-mobile-sidebar-open={item.keepMobileSidebarOpen || undefined}
        onclick={item.onclick}
      >
        {#if item.icon}
          <item.icon />
        {/if}
        <span>{item.label}</span>
      </a>
    {:else if link.href}
      <a
        href={link.href}
        rel={link.isExternal ? "noopener noreferrer" : undefined}
        target={link.isExternal ? "_blank" : undefined}
        aria-current={item.current ? "page" : undefined}
        data-keep-mobile-sidebar-open={item.keepMobileSidebarOpen || undefined}
        onclick={item.onclick}
      >
        {#if item.icon}
          <item.icon />
        {/if}
        <span>{item.label}</span>
      </a>
    {:else}
      <button
        type="button"
        data-keep-mobile-sidebar-open={item.keepMobileSidebarOpen || undefined}
        onclick={item.onclick}
      >
        {#if item.icon}
          <item.icon />
        {/if}
        <span>{item.label}</span>
      </button>
    {/if}
  </li>
{/snippet}

{#snippet renderSubmenu(submenu: SidebarSubmenu, index: number)}
  {@const submenuId = `${id}-submenu-${index}`}
  <li>
    <details id={submenuId} open={submenu.open}>
      <summary
        aria-controls="{submenuId}-content"
        data-keep-mobile-sidebar-open
      >
        {#if submenu.icon}
          <submenu.icon />
        {/if}
        {submenu.label}
      </summary>
      <ul id="{submenuId}-content">
        {#each submenu.items as item (item.label)}
          {@render renderItem(item)}
        {/each}
      </ul>
    </details>
  </li>
{/snippet}

{#snippet renderGroup(group: SidebarGroup, groupIndex: number)}
  {@const groupLabelId = group.label ? `${id}-group-${groupIndex}` : undefined}
  <div role="group" aria-labelledby={groupLabelId}>
    {#if group.label}
      <h3 id={groupLabelId}>{group.label}</h3>
    {/if}
    <ul>
      {#each group.items as item, itemIndex (item.label)}
        {#if item.type === "submenu"}
          {@render renderSubmenu(item, groupIndex * 100 + itemIndex)}
        {:else}
          {@render renderItem(item)}
        {/if}
      {/each}
    </ul>
  </div>
{/snippet}

{#snippet renderMenu()}
  {#if menu}
    {#each menu as entry, i (entry.type === "separator" ? `sep-${i}` : (entry.label ?? `group-${i}`))}
      {#if entry.type === "separator"}
        <hr />
      {:else if entry.type === "group"}
        {@render renderGroup(entry, i)}
      {/if}
    {/each}
  {:else if children}
    {@render children()}
  {/if}
{/snippet}

<aside
  bind:this={sidebarEl}
  {id}
  class={cn("sidebar", className)}
  data-side={side}
  aria-hidden={!open}
  inert={!open || undefined}
  onclick={handleSidebarClick}
>
  <nav aria-label={label}>
    {#if header}
      <header>
        {@render header()}
      </header>
    {/if}

    <section class={cn("scrollbar", contentClass)}>
      {@render renderMenu()}
    </section>

    {#if footer}
      <footer>
        {@render footer()}
      </footer>
    {/if}
  </nav>
</aside>
