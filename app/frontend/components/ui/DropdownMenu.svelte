<!--
  @component DropdownMenu
  A menu component triggered by a button, for actions or navigation.

  @example Basic usage
  ```svelte
  <script lang="ts">
    import DropdownMenu from "@/components/ui/DropdownMenu.svelte"
  </script>

  <DropdownMenu id="my-menu" triggerClass="btn-outline">
    {#snippet trigger()}
      Open Menu
    {/snippet}

    <div role="menuitem">Profile</div>
    <div role="menuitem">Settings</div>
    <hr />
    <div role="menuitem">Logout</div>
  </DropdownMenu>
  ```

  @example With groups and shortcuts
  ```svelte
  <DropdownMenu id="account-menu" triggerClass="btn-outline" popoverClass="min-w-56">
    {#snippet trigger()}
      My Account
    {/snippet}

    <div role="group" aria-labelledby="account-options">
      <div role="heading" aria-level="2" id="account-options">My Account</div>
      <div role="menuitem">
        Profile
        <span class="text-muted-foreground ml-auto text-xs">⇧⌘P</span>
      </div>
      <div role="menuitem">Settings</div>
    </div>
    <hr />
    <div role="menuitem">Logout</div>
  </DropdownMenu>
  ```

  @example Icon-only trigger (for breadcrumbs)
  ```svelte
  <script lang="ts">
    import { Ellipsis } from "@lucide/svelte"
  </script>

  <DropdownMenu
    id="more-menu"
    triggerClass="flex size-9 h-4 w-4 items-center justify-center hover:text-foreground"
  >
    {#snippet trigger()}
      <Ellipsis class="size-4" />
    {/snippet}

    <div role="menuitem">Option 1</div>
    <div role="menuitem">Option 2</div>
  </DropdownMenu>
  ```

  @example Match trigger width (for user menus)
  ```svelte
  <DropdownMenu
    id="user-menu"
    class="min-w-48"
    triggerClass="btn-outline h-12 w-full justify-start"
    matchTriggerWidth
  >
    {#snippet trigger()}
      <span>User Menu</span>
    {/snippet}

    <div role="menuitem">Profile</div>
    <div role="menuitem">Settings</div>
    <div role="menuitem">Logout</div>
  </DropdownMenu>
  ```
-->
<script lang="ts">
  import type { Snippet } from "svelte"

  import { cn } from "@/utils"
  import { type Placement, computePosition } from "@/utils/position"

  type Props = {
    /** Unique identifier for the dropdown */
    id: string
    /** Whether dropdown is open (bindable) */
    open?: boolean
    /** Popover alignment relative to trigger */
    align?: "start" | "center" | "end"
    /** Popover side relative to trigger */
    side?: "top" | "bottom" | "left" | "right"
    /** Match popover width to trigger width */
    matchTriggerWidth?: boolean
    /** CSS class for the container */
    class?: string
    /** CSS class for the trigger button */
    triggerClass?: string
    /** CSS class for the popover */
    popoverClass?: string
    /** CSS class for the menu */
    menuClass?: string
    /** Trigger button content */
    trigger: Snippet
    /** Menu items (default slot) */
    children?: Snippet
  }

  let {
    id,
    open = $bindable(false),
    align,
    side,
    matchTriggerWidth = false,
    class: className,
    triggerClass,
    popoverClass,
    menuClass,
    trigger,
    children,
  }: Props = $props()

  let menuItems: HTMLElement[] = $state([])
  let activeIndex = $state(-1)
  let menuEl = $state<HTMLDivElement | null>(null)
  let popoverEl = $state<HTMLDivElement | null>(null)
  let triggerEl = $state<HTMLButtonElement | null>(null)

  // Convert props to placement
  function getPlacement(): Placement {
    const s = side || "bottom"
    const a = align || "start"
    if (a === "center") return s
    return `${s}-${a}`
  }

  // Update popover position
  function updatePosition() {
    if (!triggerEl || !popoverEl) return

    const { x, y, placement } = computePosition(triggerEl, popoverEl, {
      placement: getPlacement(),
      offset: 4,
      padding: 8,
    })

    // Set data-side for CSS (e.g., transform-origin)
    popoverEl.dataset.side = placement.split("-")[0] as
      | "top"
      | "bottom"
      | "left"
      | "right"

    // Apply position (and min-width if matching trigger)
    popoverEl.style.left = `${x}px`
    popoverEl.style.top = `${y}px`
    if (matchTriggerWidth) {
      // Use minWidth so popoverClass can set a larger width if desired
      popoverEl.style.minWidth = `${triggerEl.offsetWidth}px`
    }
  }

  // Get focusable menu items
  function updateMenuItems() {
    if (!menuEl) return
    menuItems = Array.from(
      menuEl.querySelectorAll<HTMLElement>('[role^="menuitem"]'),
    ).filter(
      (item) =>
        !item.hasAttribute("disabled") &&
        item.getAttribute("aria-disabled") !== "true",
    )
  }

  function openMenu(initialSelection?: "first" | "last") {
    open = true
    try {
      popoverEl?.showPopover()
    } catch {
      // InvalidStateError if already open - safe to ignore
    }
    updateMenuItems()
    if (initialSelection === "first" && menuItems.length > 0) {
      activeIndex = 0
    } else if (initialSelection === "last" && menuItems.length > 0) {
      activeIndex = menuItems.length - 1
    }

    // Position after DOM update
    requestAnimationFrame(() => {
      if (open && popoverEl) {
        updatePosition()
      }
    })
  }

  function closeMenu(focusTrigger = true) {
    open = false
    try {
      popoverEl?.hidePopover()
    } catch {
      // InvalidStateError if already hidden - safe to ignore
    }
    activeIndex = -1
    if (focusTrigger) triggerEl?.focus()
  }

  function setActiveItem(index: number) {
    if (activeIndex >= 0 && menuItems[activeIndex]) {
      menuItems[activeIndex].classList.remove("active")
    }
    activeIndex = index
    if (activeIndex >= 0 && menuItems[activeIndex]) {
      menuItems[activeIndex].classList.add("active")
    }
  }

  function handleTriggerClick() {
    if (open) {
      closeMenu()
    } else {
      openMenu()
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      if (open) closeMenu()
      return
    }

    if (!open) {
      if (["Enter", " "].includes(e.key)) {
        e.preventDefault()
        openMenu()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        openMenu("first")
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        openMenu("last")
      }
      return
    }

    if (menuItems.length === 0) return

    let nextIndex = activeIndex

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        nextIndex =
          activeIndex === -1
            ? 0
            : Math.min(activeIndex + 1, menuItems.length - 1)
        break
      case "ArrowUp":
        e.preventDefault()
        nextIndex =
          activeIndex === -1
            ? menuItems.length - 1
            : Math.max(activeIndex - 1, 0)
        break
      case "Home":
        e.preventDefault()
        nextIndex = 0
        break
      case "End":
        e.preventDefault()
        nextIndex = menuItems.length - 1
        break
      case "Enter":
      case " ":
        e.preventDefault()
        menuItems[activeIndex]?.click()
        closeMenu()
        return
    }

    if (nextIndex !== activeIndex) {
      setActiveItem(nextIndex)
    }
  }

  // Use event delegation for hover highlighting
  // Only respond to mouse/pen, not touch (touch devices don't have hover)
  function handleMenuPointerOver(e: PointerEvent) {
    // Ignore touch events - touch doesn't have hover concept
    if (e.pointerType === "touch") return

    const target = (e.target as HTMLElement).closest('[role^="menuitem"]')
    if (target && menuItems.includes(target as HTMLElement)) {
      const index = menuItems.indexOf(target as HTMLElement)
      if (index !== activeIndex) {
        setActiveItem(index)
      }
    }
  }

  function handleMenuPointerLeave(e: PointerEvent) {
    // Ignore touch events
    if (e.pointerType === "touch") return
    setActiveItem(-1)
  }

  function handleMenuClick(e: MouseEvent) {
    if ((e.target as HTMLElement).closest('[role^="menuitem"]')) {
      closeMenu()
    }
  }

  // Click outside to close
  $effect(() => {
    if (!open) return

    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (!triggerEl?.contains(target) && !popoverEl?.contains(target)) {
        closeMenu(false)
      }
    }

    document.addEventListener("click", handler)
    return () => document.removeEventListener("click", handler)
  })

  // Close on scroll outside popover (fixed positioned popover doesn't follow trigger)
  $effect(() => {
    if (!open) return

    const handler = (e: Event) => {
      // Don't close if scrolling inside the popover
      if (popoverEl?.contains(e.target as Node)) return
      closeMenu(false)
    }

    window.addEventListener("scroll", handler, { capture: true, passive: true })
    return () =>
      window.removeEventListener("scroll", handler, { capture: true })
  })
</script>

<div {id} class={cn("dropdown-menu", className)}>
  <button
    type="button"
    id="{id}-trigger"
    class={triggerClass}
    aria-haspopup="menu"
    aria-controls="{id}-menu"
    aria-expanded={open}
    bind:this={triggerEl}
    onclick={handleTriggerClick}
    onkeydown={handleKeydown}
  >
    {@render trigger()}
  </button>

  <div
    id="{id}-popover"
    popover="manual"
    data-popover
    data-floating-ui
    aria-hidden={!open}
    class={popoverClass}
    bind:this={popoverEl}
  >
    <div
      role="menu"
      id="{id}-menu"
      class={menuClass}
      aria-labelledby="{id}-trigger"
      tabindex="-1"
      bind:this={menuEl}
      onpointerover={handleMenuPointerOver}
      onpointerleave={handleMenuPointerLeave}
      onclick={handleMenuClick}
      onkeydown={handleKeydown}
    >
      {#if children}
        {@render children()}
      {/if}
    </div>
  </div>
</div>
