<!--
  @component Select
  A dropdown select component for choosing from a list of options.

  @example Basic usage
  ```svelte
  <script lang="ts">
    import Select from "@/components/ui/Select.svelte"

    let value = $state("")
  </script>

  <Select
    id="fruit"
    options={[
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "orange", label: "Orange" },
    ]}
    bind:value
  />
  ```

  @example With groups
  ```svelte
  <Select
    id="food"
    options={[
      {
        label: "Fruits",
        options: [
          { value: "apple", label: "Apple" },
          { value: "banana", label: "Banana" },
        ]
      },
      {
        label: "Vegetables",
        options: [
          { value: "carrot", label: "Carrot" },
          { value: "broccoli", label: "Broccoli" },
        ]
      }
    ]}
    bind:value
  />
  ```

  @example Disabled
  ```svelte
  <Select
    id="disabled"
    options={[{ value: "disabled", label: "Disabled" }]}
    disabled
  />
  ```
-->
<script lang="ts" module>
  import type { Icon as IconType } from "@lucide/svelte"

  /** Single selectable option */
  export type SelectOption = {
    value: string
    label: string
    disabled?: boolean
    /** Lucide icon component */
    icon?: typeof IconType
  }

  /** Group of options with a heading */
  export type SelectOptionGroup = {
    label: string
    options: SelectOption[]
  }
</script>

<script lang="ts">
  import { ChevronDown } from "@lucide/svelte"

  import { popoverState } from "@/runes/popover-state.svelte"
  import { cn } from "@/utils"

  type Props = {
    /** Unique identifier for the select */
    id: string
    /** Array of options or option groups */
    options: SelectOption[] | SelectOptionGroup[]
    /** Currently selected value (bindable) */
    value?: string
    /** Whether the popover is open (bindable) */
    open?: boolean
    /** Placeholder text when no value selected */
    placeholder?: string
    /** Form field name for the hidden input */
    name?: string
    /** Whether the select is disabled */
    disabled?: boolean
    /** Callback when value changes */
    onchange?: (value: string) => void
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
    name,
    disabled = false,
    onchange,
    class: className,
    triggerClass,
    popoverClass,
    optionClass,
  }: Props = $props()

  // Type guards
  const isGrouped = (opts: typeof options): opts is SelectOptionGroup[] =>
    opts.length > 0 && "options" in opts[0]

  const flatten = (opts: typeof options): SelectOption[] =>
    isGrouped(opts) ? opts.flatMap((g) => g.options) : opts

  // State
  let activeIndex = $state(-1)
  let triggerEl = $state<HTMLButtonElement | null>(null)
  let popoverEl = $state<HTMLDivElement | null>(null)
  let listboxEl = $state<HTMLDivElement | null>(null)

  // Derived values
  const allOptions = $derived(flatten(options))
  const enabledOptions = $derived(allOptions.filter((o) => !o.disabled))
  const selectedOption = $derived(allOptions.find((o) => o.value === value))
  const displayLabel = $derived(selectedOption?.label ?? placeholder)
  const activeOptionId = $derived(
    activeIndex >= 0 && enabledOptions[activeIndex]
      ? `${id}-option-${enabledOptions[activeIndex].value}`
      : undefined,
  )

  // Actions
  function open() {
    if (disabled) return

    // Set this as active popover (auto-closes others via reactive state)
    popoverState.open(id)

    isOpen = true
    activeIndex = enabledOptions.findIndex((o) => o.value === value)

    // Scroll to selected option
    queueMicrotask(() => {
      if (value) {
        document
          .getElementById(`${id}-option-${value}`)
          ?.scrollIntoView({ block: "nearest" })
      }
    })
  }

  function close(focusTrigger = true) {
    popoverState.close(id)
    isOpen = false
    activeIndex = -1
    if (focusTrigger) triggerEl?.focus()
  }

  function select(val: string) {
    value = val
    onchange?.(val)
    close()
  }

  function scrollActiveIntoView() {
    if (activeIndex < 0 || !enabledOptions[activeIndex]) return
    document
      .getElementById(`${id}-option-${enabledOptions[activeIndex].value}`)
      ?.scrollIntoView({ block: "nearest" })
  }

  function handleTriggerClick() {
    if (isOpen) {
      close()
    } else {
      open()
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (disabled) return

    // Handle trigger keydown when closed
    if (!isOpen) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault()
        open()
      }
      return
    }

    const len = enabledOptions.length
    if (!len && e.key !== "Escape") return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        activeIndex = activeIndex < len - 1 ? activeIndex + 1 : activeIndex
        scrollActiveIntoView()
        break
      case "ArrowUp":
        e.preventDefault()
        activeIndex = activeIndex > 0 ? activeIndex - 1 : 0
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
      case " ":
        e.preventDefault()
        if (activeIndex >= 0 && !enabledOptions[activeIndex].disabled) {
          select(enabledOptions[activeIndex].value)
        }
        break
      case "Escape":
        e.preventDefault()
        close()
        break
    }
  }

  function handleMouseLeave() {
    const selectedIdx = enabledOptions.findIndex((o) => o.value === value)
    activeIndex = selectedIdx >= 0 ? selectedIdx : -1
  }

  // Click outside to close
  $effect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      const t = e.target as Node
      if (!triggerEl?.contains(t) && !popoverEl?.contains(t)) close(false)
    }
    document.addEventListener("click", handler)
    return () => document.removeEventListener("click", handler)
  })

  // Reactively close when another popover becomes active
  $effect(() => {
    if (
      isOpen &&
      popoverState.activeId !== null &&
      popoverState.activeId !== id
    ) {
      close(false)
    }
  })

  // Helper to get index in enabled options
  const getEnabledIndex = (val: string) =>
    enabledOptions.findIndex((o) => o.value === val)
</script>

{#snippet optionItem(option: SelectOption)}
  {@const index = getEnabledIndex(option.value)}
  <div
    id="{id}-option-{option.value}"
    role="option"
    tabindex="-1"
    data-value={option.value}
    aria-selected={value === option.value}
    aria-disabled={option.disabled}
    class={cn(optionClass, activeIndex === index && "active")}
    onclick={() => !option.disabled && select(option.value)}
    onmousemove={() => !option.disabled && (activeIndex = index)}
    onkeydown={() => {}}
  >
    {#if option.icon}
      <span class="flex items-center gap-2">
        <option.icon class="text-muted-foreground size-4" />
        {option.label}
      </span>
    {:else}
      {option.label}
    {/if}
  </div>
{/snippet}

<div {id} class={cn("select", disabled && "cursor-not-allowed", className)}>
  <button
    type="button"
    class={cn("btn-outline justify-between font-normal", triggerClass)}
    id="{id}-trigger"
    aria-haspopup="listbox"
    aria-expanded={isOpen}
    aria-controls="{id}-listbox"
    {disabled}
    bind:this={triggerEl}
    onclick={handleTriggerClick}
    onkeydown={handleKeydown}
  >
    <span class="flex items-center gap-2 truncate">
      {#if selectedOption?.icon}
        <selectedOption.icon class="text-muted-foreground size-4" />
      {/if}
      {displayLabel}
    </span>
    <ChevronDown class="text-muted-foreground size-4 shrink-0 opacity-50" />
  </button>

  <div
    id="{id}-popover"
    data-popover
    aria-hidden={!isOpen}
    class={popoverClass}
    bind:this={popoverEl}
  >
    <div
      role="listbox"
      id="{id}-listbox"
      tabindex="-1"
      aria-orientation="vertical"
      aria-labelledby="{id}-trigger"
      aria-activedescendant={activeOptionId}
      bind:this={listboxEl}
      onmouseleave={handleMouseLeave}
      onkeydown={handleKeydown}
    >
      {#if isGrouped(options)}
        {#each options as group, groupIndex (group.label)}
          <div role="group" aria-labelledby="{id}-group-{groupIndex}">
            <span id="{id}-group-{groupIndex}" role="heading" aria-level="2">
              {group.label}
            </span>
            {#each group.options as option (option.value)}
              {@render optionItem(option)}
            {/each}
          </div>
        {/each}
      {:else}
        {#each allOptions as option (option.value)}
          {@render optionItem(option)}
        {/each}
      {/if}
    </div>
  </div>

  <input type="hidden" name={name ?? `${id}-value`} {value} />
</div>
