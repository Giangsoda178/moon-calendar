<!--
  @component Command
  Fast, composable command menu for quick navigation and actions.
  Supports keyboard navigation, filtering, and dialog mode.

  Data-driven construction via `items` prop:
  - Groups: `{ type: "group", label: "Group Name", items: [...] }`
  - Items: `{ label: "Item", icon?: Component, filterText?: "search terms", keywords?: "synonyms", shortcut?: "⌘K", disabled?: boolean, onclick?: () => void }`
  - Separators: `{ type: "separator" }`

  @example Data-driven command menu
  ```svelte
  <script>
    import { Calendar, Settings, User } from "@lucide/svelte"

    const items = [
      {
        type: "group",
        label: "Suggestions",
        items: [
          { label: "Calendar", icon: Calendar, filterText: "calendar event", onclick: () => console.log("Calendar") },
          { label: "Settings", icon: Settings, shortcut: "⌘S" },
        ]
      },
      { type: "separator" },
      { label: "Profile", icon: User, filterText: "profile account" },
    ]
  </script>

  <Command {items} class="rounded-lg border shadow-md" />
  ```

  @example Using filterText and keywords for enhanced search
  - `filterText`: Primary search text when label differs from searchable text (e.g., emoji labels)
  - `keywords`: Additional synonyms/related terms users might search by
  ```svelte
  <script>
    const items = [
      // filterText: matches "united states" even though label shows flag
      { label: "🇺🇸 US", filterText: "united states", keywords: "usa america dollar" },
      // keywords: typing "config" or "preferences" finds this item
      { label: "Settings", keywords: "config preferences options" },
    ]
  </script>
  ```

  @example Dialog mode with keyboard shortcut
  ```svelte
  <script>
    let open = $state(false)
    const items = [
      { label: "Home", onclick: () => goto("/") },
      { label: "Settings", onclick: () => goto("/settings") },
    ]
  </script>

  <Button variant="outline" onclick={() => (open = true)}>
    Open Command <Kbd>⌘K</Kbd>
  </Button>

  <Command dialog bind:open shortcut="cmd+k" {items} />
  ```

  Shortcut format: `"[modifiers+]key"` where modifiers can be:
  - `cmd` or `meta` - Command key (Mac) / Windows key
  - `ctrl` - Control key
  - `alt` or `opt` - Alt/Option key
  - `shift` - Shift key

  Examples: `"cmd+k"`, `"ctrl+shift+p"`, `"escape"`, `"shift+/"`, `"f1"`
-->
<script lang="ts">
  import { type IconProps, Search } from "@lucide/svelte"
  import type { Component, Snippet } from "svelte"
  import { onDestroy, onMount } from "svelte"

  import { cn } from "@/utils"
  import { matchesShortcut, parseShortcut } from "@/utils/keyboard-shortcut"

  export type CommandItem = {
    type?: "item"
    /** Display label */
    label: string
    /** Lucide icon component */
    icon?: Component<IconProps>
    /** Primary search text when label differs from searchable text (e.g., emoji labels). Defaults to label. */
    filterText?: string
    /** Additional synonyms/related terms users might search by (space-separated) */
    keywords?: string
    /** Keyboard shortcut display */
    shortcut?: string
    /** Whether item is disabled */
    disabled?: boolean
    /** Click handler */
    onclick?: () => void
    /** Keep dialog open on click */
    keepOpen?: boolean
  }

  export type CommandGroup = {
    type: "group"
    /** Group label */
    label: string
    /** Group items */
    items: CommandItem[]
  }

  export type CommandSeparator = {
    type: "separator"
  }

  export type CommandItems = (CommandItem | CommandGroup | CommandSeparator)[]

  type Props = {
    /** Unique ID for the command menu */
    id?: string
    /** Data-driven items array */
    items?: CommandItems
    /** Render as dialog (modal) */
    dialog?: boolean
    /** Whether dialog is open (bindable, only for dialog mode) */
    open?: boolean
    /** Keyboard shortcut (e.g., "cmd+k", "ctrl+shift+p", "escape") */
    shortcut?: string
    /** Placeholder text for search input */
    placeholder?: string
    /** CSS class for container */
    class?: string
    /** Children slot for custom content (alternative to items prop) */
    children?: Snippet
  }

  let {
    id = `command-${Math.random().toString(36).slice(2, 9)}`,
    items,
    dialog = false,
    open = $bindable(false),
    shortcut,
    placeholder = "Type a command or search...",
    class: className,
    children,
  }: Props = $props()

  let dialogEl = $state<HTMLDialogElement | null>(null)
  let inputEl = $state<HTMLInputElement | null>(null)
  let menuEl = $state<HTMLDivElement | null>(null)
  let inputValue = $state("")
  let activeIndex = $state(-1)
  let keyboardVisible = $state(false)

  // Get all menu items
  function getAllItems(): HTMLElement[] {
    if (!menuEl) return []
    return Array.from(menuEl.querySelectorAll<HTMLElement>('[role="menuitem"]'))
  }

  // Get navigable items (visible and not disabled)
  function getNavigableItems(): HTMLElement[] {
    return getAllItems().filter(
      (item) =>
        item.getAttribute("aria-hidden") !== "true" &&
        item.getAttribute("aria-disabled") !== "true",
    )
  }

  // Set active item with visual highlight
  function setActiveItem(index: number) {
    const navItems = getNavigableItems()
    navItems.forEach((item) => item.classList.remove("active"))

    if (index >= 0 && index < navItems.length) {
      activeIndex = index
      navItems[index].classList.add("active")
      navItems[index].scrollIntoView({ block: "nearest" })
    } else {
      activeIndex = -1
    }
  }

  // Filter items based on search input
  function filterItems() {
    const searchTerm = inputValue.toLowerCase().trim()
    const allItems = getAllItems()
    const separators =
      menuEl?.querySelectorAll('hr[role="separator"], hr') ?? []
    const groups = menuEl?.querySelectorAll('[role="group"]') ?? []

    // Reset all visibility
    allItems.forEach((item) => {
      if (item.hasAttribute("data-force")) {
        item.setAttribute("aria-hidden", "false")
        return
      }

      const filterText = (
        item.dataset.filter ||
        item.textContent ||
        ""
      ).toLowerCase()
      const keywords = (item.dataset.keywords || "").toLowerCase()
      const matches =
        !searchTerm ||
        filterText.includes(searchTerm) ||
        keywords.includes(searchTerm)

      item.setAttribute("aria-hidden", String(!matches))
    })

    // Hide separators when filtering
    separators.forEach((sep) => {
      ;(sep as HTMLElement).style.display = searchTerm ? "none" : ""
    })

    // Hide empty groups
    groups.forEach((group) => {
      const visibleItems = group.querySelectorAll(
        '[role="menuitem"]:not([aria-hidden="true"])',
      )
      ;(group as HTMLElement).style.display =
        visibleItems.length === 0 ? "none" : ""
    })

    // Reset active index to first visible item
    const navigable = getNavigableItems()
    if (navigable.length > 0) {
      setActiveItem(0)
    } else {
      activeIndex = -1
    }
  }

  // Handle keyboard navigation
  function handleKeydown(event: KeyboardEvent) {
    const navItems = getNavigableItems()

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        if (navItems.length > 0) {
          setActiveItem(
            activeIndex < navItems.length - 1 ? activeIndex + 1 : activeIndex,
          )
        }
        break
      case "ArrowUp":
        event.preventDefault()
        if (navItems.length > 0) {
          setActiveItem(activeIndex > 0 ? activeIndex - 1 : 0)
        }
        break
      case "Enter":
        event.preventDefault()
        if (activeIndex >= 0 && activeIndex < navItems.length) {
          navItems[activeIndex].click()
        }
        break
      case "Home":
        event.preventDefault()
        if (navItems.length > 0) setActiveItem(0)
        break
      case "End":
        event.preventDefault()
        if (navItems.length > 0) setActiveItem(navItems.length - 1)
        break
    }
  }

  // Handle mouse hover on items
  function handleMouseMove(event: MouseEvent) {
    const target = event.target as HTMLElement
    const menuItem = target.closest('[role="menuitem"]') as HTMLElement | null
    if (menuItem && menuItem.getAttribute("aria-disabled") !== "true") {
      const navItems = getNavigableItems()
      const index = navItems.indexOf(menuItem)
      if (index !== -1 && index !== activeIndex) {
        setActiveItem(index)
      }
    }
  }

  // Handle item click - close dialog if in dialog mode
  function handleMenuClick(event: MouseEvent) {
    const target = event.target as HTMLElement
    const menuItem = target.closest('[role="menuitem"]') as HTMLElement | null
    if (
      dialog &&
      menuItem &&
      !menuItem.hasAttribute("data-keep-open") &&
      menuItem.getAttribute("aria-disabled") !== "true"
    ) {
      open = false
    }
  }

  // Dialog mode: sync open state
  $effect(() => {
    if (!dialog || !dialogEl) return

    if (open && !dialogEl.open) {
      dialogEl.showModal()
      document.body.style.overflow = "hidden"
      inputValue = ""
      requestAnimationFrame(() => {
        inputEl?.focus()
        filterItems()
      })
    } else if (!open && dialogEl.open) {
      dialogEl.close()
    }
  })

  // Dialog mode: handle close
  function handleDialogClose() {
    open = false
    document.body.style.overflow = ""
  }

  // Dialog mode: handle backdrop click
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === dialogEl) {
      open = false
    }
  }

  // Dialog mode: global keyboard shortcut
  const parsedShortcut = $derived(shortcut ? parseShortcut(shortcut) : null)

  function handleGlobalKeydown(event: KeyboardEvent) {
    if (parsedShortcut && matchesShortcut(event, parsedShortcut)) {
      event.preventDefault()
      open = !open
    }
  }

  // Touch device detection (virtual keyboard only on touch devices)
  function isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0
  }

  // Handle input focus - keyboard will show on touch devices
  function handleInputFocus() {
    if (isTouchDevice()) {
      keyboardVisible = true
    }
  }

  // Handle input blur - keyboard will hide
  function handleInputBlur() {
    keyboardVisible = false
  }

  onMount(() => {
    if (dialog && shortcut) {
      document.addEventListener("keydown", handleGlobalKeydown)
    }
    // Initial filter for standalone mode
    if (!dialog) {
      requestAnimationFrame(filterItems)
    }
  })

  onDestroy(() => {
    if (dialog && shortcut) {
      document.removeEventListener("keydown", handleGlobalKeydown)
    }
  })
</script>

{#snippet renderItem(item: CommandItem, itemIndex: number, groupIndex?: number)}
  {@const itemId =
    groupIndex !== undefined
      ? `${id}-group-${groupIndex}-item-${itemIndex}`
      : `${id}-item-${itemIndex}`}
  <div
    id={itemId}
    role="menuitem"
    tabindex="-1"
    data-filter={item.filterText || item.label}
    data-keywords={item.keywords}
    aria-disabled={item.disabled || undefined}
    data-keep-open={item.keepOpen || undefined}
    onclick={item.onclick}
    onkeydown={() => {}}
  >
    {#if item.icon}
      <item.icon class="size-4" />
    {/if}
    <span>{item.label}</span>
    {#if item.shortcut}
      <kbd class="kbd ml-auto">{item.shortcut}</kbd>
    {/if}
  </div>
{/snippet}

{#snippet renderItems()}
  {#if items}
    {#each items as entry, i (entry.type === "group" ? `group-${i}` : entry.type === "separator" ? `sep-${i}` : entry.label)}
      {#if entry.type === "separator"}
        <hr />
      {:else if entry.type === "group"}
        {@const groupId = `${id}-group-${i}`}
        <div role="group" aria-labelledby={groupId}>
          <span role="heading" id={groupId} aria-level="2">{entry.label}</span>
          {#each entry.items as item, j (item.label)}
            {@render renderItem(item, j, i)}
          {/each}
        </div>
      {:else}
        {@render renderItem(entry, i)}
      {/if}
    {/each}
  {:else if children}
    {@render children()}
  {/if}
{/snippet}

{#snippet commandContent()}
  <div class={cn("command", !dialog && className)}>
    <header>
      <Search class="size-4 shrink-0 opacity-50" />
      <input
        bind:this={inputEl}
        bind:value={inputValue}
        type="text"
        role="combobox"
        aria-expanded="true"
        aria-controls="{id}-menu"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        {placeholder}
        onkeydown={handleKeydown}
        oninput={filterItems}
        onfocus={handleInputFocus}
        onblur={handleInputBlur}
      />
    </header>

    <div
      bind:this={menuEl}
      id="{id}-menu"
      role="menu"
      tabindex="-1"
      onmousemove={handleMouseMove}
      onclick={handleMenuClick}
      onkeydown={() => {}}
    >
      {@render renderItems()}

      {#if inputValue && getNavigableItems().length === 0}
        <div class="text-muted-foreground py-6 text-center text-sm">
          No results found.
        </div>
      {/if}
    </div>
  </div>
{/snippet}

{#if dialog}
  <dialog
    bind:this={dialogEl}
    {id}
    class={cn("command-dialog", className)}
    aria-label="Command menu"
    data-keyboard-visible={keyboardVisible || undefined}
    onclick={handleBackdropClick}
    onclose={handleDialogClose}
  >
    {@render commandContent()}
  </dialog>
{:else}
  {@render commandContent()}
{/if}
