<!--
  @component Combobox
  An accessible combobox (autocomplete) component with search filtering.

  @example Basic usage
  ```svelte
  <Combobox
    id="framework"
    options={[
      { value: "next", label: "Next.js" },
      { value: "svelte", label: "SvelteKit" },
      { value: "nuxt", label: "Nuxt.js" },
    ]}
    bind:value={selectedFramework}
  />
  ```

  @example With keywords for enhanced search
  Keywords allow users to find options by typing related terms.
  For example, typing "usa" or "dollar" will match "United States".
  ```svelte
  <Combobox
    id="country"
    options={[
      { value: "us", label: "United States", keywords: "usa america dollar" },
      { value: "uk", label: "United Kingdom", keywords: "britain pound sterling" },
      { value: "jp", label: "Japan", keywords: "yen tokyo" },
    ]}
    bind:value={selectedCountry}
  />
  ```

  @example With filterText for custom filter matching
  Use filterText when the displayed label differs from what users type.
  For example, an emoji label that should match text input.
  ```svelte
  <Combobox
    id="fruit"
    options={[
      { value: "apple", label: "🍎", filterText: "apple" },
      { value: "banana", label: "🍌", filterText: "banana" },
    ]}
    bind:value={selectedFruit}
  />
  ```

  @example With forceShow to always display an option
  Options with forceShow are always visible regardless of filter.
  Useful for "Create new..." or "Other" options.
  ```svelte
  <Combobox
    id="tag"
    options={[
      { value: "new", label: "+ Create new tag", forceShow: true },
      { value: "bug", label: "Bug" },
      { value: "feature", label: "Feature" },
    ]}
    bind:value={selectedTag}
  />
  ```

  @example With grouped options
  ```svelte
  <Combobox
    id="timezone"
    options={[
      {
        label: "Americas",
        options: [
          { value: "ny", label: "New York" },
          { value: "la", label: "Los Angeles" },
        ]
      },
      {
        label: "Europe",
        options: [
          { value: "london", label: "London" },
          { value: "paris", label: "Paris" },
        ]
      }
    ]}
    bind:value={selectedTimezone}
  />
  ```

  @example With footer snippet
  ```svelte
  <Combobox id="item" {options} bind:value>
    {#snippet footer()}
      <button onclick={() => createNew()}>+ Create new item</button>
    {/snippet}
  </Combobox>
  ```

  @example With custom styling
  Use class props to customize appearance with Tailwind classes.
  ```svelte
  <Combobox
    id="styled"
    {options}
    bind:value
    class="w-full"
    triggerClass="bg-primary text-white hover:bg-primary/90"
    popoverClass="w-64"
    optionClass="px-4 py-2 hover:bg-accent"
  />
  ```

  @example With conditional classes using cn()
  Build dynamic classes with cn() - supports booleans and object syntax.
  ```svelte
  <script>
    import { cn } from "@/utils"

    let isCompact = $state(false)
    let hasError = $state(false)

    // Pre-build classes for readability
    const triggerClass = cn(
      "transition-colors",                              // always applied
      hasError && "border-red-500 ring-red-500",        // applied when hasError is true
      { "py-1 text-sm": isCompact, "py-2": !isCompact } // object syntax: key applied when value is true
    )
  </script>

  <Combobox
    id="dynamic"
    {options}
    bind:value
    class={cn("w-full", isCompact && "max-w-xs")}
    {triggerClass}
  />
  ```
-->
<script lang="ts" module>
  /**
   * Represents a single selectable option in the combobox.
   */
  export type ComboboxOption = {
    /** Unique value submitted with the form */
    value: string
    /** Display text shown in the dropdown */
    label: string
    /**
     * Additional search terms for filtering.
     * Users can find this option by typing any of these keywords.
     * @example "usa america dollar" for a "United States" option
     */
    keywords?: string
    /**
     * Custom text used for filter matching instead of label.
     * Useful when label contains special characters or emojis.
     * @example "apple" for a "🍎" label
     */
    filterText?: string
    /**
     * When true, this option is always visible regardless of filter.
     * Useful for "Create new..." or action options.
     */
    forceShow?: boolean
    /** When true, option cannot be selected */
    disabled?: boolean
  }

  /**
   * Represents a group of options with a heading label.
   */
  export type ComboboxOptionGroup = {
    /** Group heading displayed above the options */
    label: string
    /** Options within this group */
    options: ComboboxOption[]
  }
</script>

<script lang="ts">
  import { ChevronsUpDown, Search } from "@lucide/svelte"
  import type { Snippet } from "svelte"

  import { cn } from "@/utils"

  type Props = {
    /** Unique identifier for the combobox (used for ARIA attributes) */
    id: string
    /** Array of options or option groups */
    options: ComboboxOption[] | ComboboxOptionGroup[]
    /** Currently selected value (bindable) */
    value?: string
    /** Whether the popover is open (bindable) */
    open?: boolean
    /** Placeholder text when no value selected */
    placeholder?: string
    /** Placeholder for the search input */
    searchPlaceholder?: string
    /** Message shown when no options match the filter */
    emptyMessage?: string
    /** Form field name for the hidden input */
    name?: string
    /** Callback when value changes */
    onchange?: (value: string) => void
    /** Optional footer content below the options list */
    footer?: Snippet
    /** CSS class for the root container */
    class?: string
    /** CSS class for the trigger button */
    triggerClass?: string
    /** CSS class for the popover container */
    popoverClass?: string
    /** CSS class for each option item */
    optionClass?: string
  }

  let {
    id,
    options,
    value = $bindable(""),
    open: isOpen = $bindable(false),
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    emptyMessage = "No results found.",
    name,
    onchange,
    footer,
    class: className,
    triggerClass,
    popoverClass = "w-48",
    optionClass,
  }: Props = $props()

  // Type guards
  const isGrouped = (opts: typeof options): opts is ComboboxOptionGroup[] =>
    opts.length > 0 && "options" in opts[0]

  const flatten = (opts: typeof options): ComboboxOption[] =>
    isGrouped(opts) ? opts.flatMap((g) => g.options) : opts

  // State
  let filter = $state("")
  let activeIndex = $state(-1)
  let triggerEl = $state<HTMLButtonElement | null>(null)
  let filterEl = $state<HTMLInputElement | null>(null)
  let popoverEl = $state<HTMLDivElement | null>(null)

  // Derived values
  const allOptions = $derived(flatten(options))

  const filtered = $derived.by(() => {
    const query = filter.trim().toLowerCase()
    if (!query) return options

    const matches = (opt: ComboboxOption) => {
      // Always show if forceShow is true
      if (opt.forceShow) return true
      // Match against filterText (if provided), label, or keywords
      const searchText =
        opt.filterText?.toLowerCase() ?? opt.label.toLowerCase()
      const keywords = opt.keywords?.toLowerCase() ?? ""
      return searchText.includes(query) || keywords.includes(query)
    }

    return isGrouped(options)
      ? options
          .map((g) => ({ ...g, options: g.options.filter(matches) }))
          .filter((g) => g.options.length)
      : options.filter(matches)
  })

  const filteredFlat = $derived(flatten(filtered))
  const displayLabel = $derived(
    allOptions.find((o) => o.value === value)?.label ?? placeholder,
  )
  const activeOptionId = $derived(
    activeIndex >= 0 && filteredFlat[activeIndex]
      ? `${id}-option-${filteredFlat[activeIndex].value}`
      : undefined,
  )

  // Actions
  function open() {
    isOpen = true
    activeIndex = filteredFlat.findIndex((o) => o.value === value)

    // Scroll to selected option immediately (before transition completes)
    // Use queueMicrotask to ensure DOM has updated with isOpen=true
    queueMicrotask(() => {
      if (value) {
        document
          .getElementById(`${id}-option-${value}`)
          ?.scrollIntoView({ block: "nearest" })
      }
    })

    // Focus search input after CSS transition completes
    popoverEl?.addEventListener("transitionend", () => filterEl?.focus(), {
      once: true,
    })
  }

  function close() {
    isOpen = false
    filter = ""
    activeIndex = -1
    triggerEl?.focus()
  }

  function select(val: string) {
    value = val
    onchange?.(val)
    close()
  }

  function scrollActiveIntoView() {
    if (activeIndex < 0 || !filteredFlat[activeIndex]) return
    document
      .getElementById(`${id}-option-${filteredFlat[activeIndex].value}`)
      ?.scrollIntoView({ block: "nearest" })
  }

  function handleKeydown(e: KeyboardEvent) {
    const len = filteredFlat.length
    if (!len && !["Escape", "Tab"].includes(e.key)) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        activeIndex = (activeIndex + 1) % len
        scrollActiveIntoView()
        break
      case "ArrowUp":
        e.preventDefault()
        activeIndex = activeIndex <= 0 ? len - 1 : activeIndex - 1
        scrollActiveIntoView()
        break
      case "Home":
        e.preventDefault()
        activeIndex = 0
        scrollActiveIntoView()
        break
      case "End":
        e.preventDefault()
        activeIndex = len - 1
        scrollActiveIntoView()
        break
      case "Enter":
        e.preventDefault()
        if (activeIndex >= 0 && !filteredFlat[activeIndex].disabled) {
          select(filteredFlat[activeIndex].value)
        }
        break
      case "Escape":
      case "Tab":
        e.preventDefault()
        close()
        break
    }
  }

  function handleTriggerKeydown(e: KeyboardEvent) {
    if (["Enter", " ", "ArrowDown"].includes(e.key)) {
      e.preventDefault()
      open()
    }
  }

  function handleMouseLeave() {
    const selectedIdx = filteredFlat.findIndex((o) => o.value === value)
    activeIndex = selectedIdx >= 0 ? selectedIdx : -1
  }

  // Reset active index when filter changes
  let lastFilter = ""
  $effect.pre(() => {
    if (filter !== lastFilter) {
      lastFilter = filter
      if (isOpen && filter) activeIndex = 0
    }
  })

  // Click outside to close
  $effect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      const t = e.target as Node
      if (!triggerEl?.contains(t) && !popoverEl?.contains(t)) close()
    }
    document.addEventListener("click", handler)
    return () => document.removeEventListener("click", handler)
  })

  // Helper to get global index for grouped options
  const getIndex = (val: string) =>
    filteredFlat.findIndex((o) => o.value === val)
</script>

{#snippet optionItem(option: ComboboxOption, index: number)}
  <div
    id="{id}-option-{option.value}"
    role="option"
    tabindex="-1"
    data-value={option.value}
    aria-selected={value === option.value}
    aria-disabled={option.disabled}
    class={cn(optionClass, activeIndex === index && "active")}
    onclick={() => !option.disabled && select(option.value)}
    onmousemove={() => (activeIndex = index)}
    onkeydown={() => {}}
  >
    {option.label}
  </div>
{/snippet}

<div {id} class={cn("select", className)}>
  <button
    type="button"
    class={cn("btn-outline w-full justify-between font-normal", triggerClass)}
    id="{id}-trigger"
    aria-haspopup="listbox"
    aria-expanded={isOpen}
    aria-controls="{id}-listbox"
    bind:this={triggerEl}
    onclick={() => (isOpen ? close() : open())}
    onkeydown={handleTriggerKeydown}
  >
    <span class="truncate">{displayLabel}</span>
    <ChevronsUpDown class="text-muted-foreground size-4 shrink-0 opacity-50" />
  </button>

  <div
    id="{id}-popover"
    data-popover=""
    aria-hidden={!isOpen}
    class={popoverClass}
    bind:this={popoverEl}
    onkeydown={handleKeydown}
  >
    <header>
      <Search class="size-4 shrink-0 opacity-50" />
      <input
        type="text"
        bind:value={filter}
        placeholder={searchPlaceholder}
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        aria-autocomplete="list"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="{id}-listbox"
        aria-labelledby="{id}-trigger"
        aria-activedescendant={activeOptionId}
        bind:this={filterEl}
      />
    </header>

    <div
      role="listbox"
      id="{id}-listbox"
      tabindex="-1"
      aria-orientation="vertical"
      aria-labelledby="{id}-trigger"
      data-empty={emptyMessage}
      onmouseleave={handleMouseLeave}
    >
      {#if isGrouped(filtered)}
        <div class="scrollbar max-h-64 overflow-y-auto">
          {#each filtered as group, groupIndex (group.label)}
            <div role="group" aria-labelledby="{id}-group-{groupIndex}">
              <span id="{id}-group-{groupIndex}" role="heading" aria-level="2"
                >{group.label}</span
              >
              {#each group.options as option (option.value)}
                {@render optionItem(option, getIndex(option.value))}
              {/each}
            </div>
          {/each}
        </div>
      {:else}
        {#each filteredFlat as option, i (option.value)}
          {@render optionItem(option, i)}
        {/each}
      {/if}

      {#if footer}
        <hr />
        <div onmouseenter={() => (activeIndex = -1)} role="listitem">
          {@render footer()}
        </div>
      {/if}
    </div>
  </div>

  <input type="hidden" name={name ?? `${id}-value`} {value} />
</div>
