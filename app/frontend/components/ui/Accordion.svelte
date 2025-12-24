<!--
  @component Accordion
  A vertically stacked set of interactive headings that reveal associated content.
  Supports data-driven mode (simple) or composition mode (flexible with AccordionItem).

  @example Data-driven mode (simple cases)
  ```svelte
  <script lang="ts">
    import Accordion from "@/components/ui/Accordion.svelte"

    const items = [
      { value: "a11y", title: "Is it accessible?", content: "Yes. It adheres to WAI-ARIA." },
      { value: "styled", title: "Is it styled?", content: "Yes. Default styles included." },
    ]
  </script>

  <Accordion {items} />
  ```

  @example Custom content via snippet
  ```svelte
  <Accordion {items}>
    {#snippet content(item)}
      <p class="text-primary">{item.content}</p>
    {/snippet}
  </Accordion>
  ```

  @example Composition mode (full control with AccordionItem)
  ```svelte
  <Accordion>
    <AccordionItem title="First">Content 1</AccordionItem>
    <AccordionItem value="second" title="Second">
      {#snippet trigger()}
        <span class="flex items-center gap-2"><Icon /> Custom</span>
      {/snippet}
      Content 2
    </AccordionItem>
  </Accordion>
  ```

  @example Multiple expand mode
  ```svelte
  <Accordion type="multiple" items={items} />
  ```

  @example With default open item
  ```svelte
  <Accordion value="item-2" items={items} />
  ```
-->
<script lang="ts" module>
  /** Accordion expand type */
  export type AccordionType = "single" | "multiple"

  /** Data item for data-driven mode */
  export interface AccordionItemData {
    /** Unique value for this item */
    value: string
    /** Title text for the trigger */
    title: string
    /** Content text (used if no content snippet provided) */
    content?: string
    /** Whether this item is disabled */
    disabled?: boolean
  }

  /** Context for accordion state management (used by AccordionItem) */
  export interface AccordionContext {
    type: AccordionType
    openItems: Set<string>
    toggle: (value: string) => void
  }
</script>

<script lang="ts">
  import { ChevronDown } from "@lucide/svelte"
  import type { Snippet } from "svelte"
  import { setContext } from "svelte"
  import { SvelteSet } from "svelte/reactivity"
  import { slide } from "svelte/transition"

  import { cn } from "@/utils"

  type Props = {
    /** Unique identifier for the accordion */
    id?: string
    /** Expand type: "single" (one item at a time) or "multiple" (many items) */
    type?: AccordionType
    /** Currently open item value(s) - string for single, string[] for multiple (bindable) */
    value?: string | string[]
    /** Callback when value changes */
    onchange?: (value: string | string[]) => void
    /** CSS class for the container */
    class?: string
    /** Data-driven mode: array of items */
    items?: AccordionItemData[]
    /** Custom content renderer for data-driven mode */
    content?: Snippet<[AccordionItemData]>
    /** Composition mode: AccordionItem children */
    children?: Snippet
  }

  let {
    id,
    type = "single",
    value = $bindable(),
    onchange,
    class: className,
    items,
    content,
    children,
  }: Props = $props()

  // Initialize value based on type if not provided
  if (value === undefined) {
    value = type === "single" ? "" : []
  }

  // Track open items using SvelteSet for reactivity
  const openItems = new SvelteSet<string>(
    Array.isArray(value) ? value : value ? [value] : [],
  )

  // Check if item is open
  function isOpen(itemValue: string): boolean {
    return openItems.has(itemValue)
  }

  // Toggle item open/close
  function toggle(itemValue: string) {
    if (type === "single") {
      if (openItems.has(itemValue)) {
        openItems.clear()
        value = ""
      } else {
        openItems.clear()
        openItems.add(itemValue)
        value = itemValue
      }
    } else {
      if (openItems.has(itemValue)) {
        openItems.delete(itemValue)
      } else {
        openItems.add(itemValue)
      }
      value = Array.from(openItems)
    }
    onchange?.(value)
  }

  // Handle toggle for data-driven items
  function handleToggle(itemValue: string, disabled?: boolean) {
    if (disabled) return
    toggle(itemValue)
  }

  // Handle keyboard for data-driven items
  function handleKeydown(
    e: KeyboardEvent,
    itemValue: string,
    disabled?: boolean,
  ) {
    if (disabled) return
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      toggle(itemValue)
    }
  }

  // Provide context to AccordionItem children (composition mode)
  setContext<AccordionContext>("accordion", {
    get type() {
      return type
    },
    get openItems() {
      return openItems
    },
    toggle,
  })
</script>

<div {id} class={cn("accordion grid gap-0", className)} role="region">
  {#if items && items.length > 0}
    <!-- Data-driven mode -->
    {#each items as item (item.value)}
      {@const open = isOpen(item.value)}
      <div
        class="accordion-item border-b last:border-b-0"
        data-state={open ? "open" : "closed"}
        data-disabled={item.disabled || undefined}
      >
        <h3 class="flex">
          <button
            type="button"
            class={cn(
              "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none focus-visible:ring-[3px]",
              !item.disabled && "hover:underline",
              item.disabled && "cursor-not-allowed opacity-50",
            )}
            aria-expanded={open}
            aria-controls="{item.value}-content"
            disabled={item.disabled}
            onclick={() => handleToggle(item.value, item.disabled)}
            onkeydown={(e) => handleKeydown(e, item.value, item.disabled)}
          >
            {item.title}
            <ChevronDown
              class={cn(
                "text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </button>
        </h3>

        {#if open}
          <div
            id="{item.value}-content"
            role="region"
            aria-labelledby="{item.value}-trigger"
            class="overflow-hidden"
            transition:slide={{ duration: 200 }}
          >
            <div class="pb-4 text-sm">
              {#if content}
                {@render content(item)}
              {:else}
                {item.content}
              {/if}
            </div>
          </div>
        {/if}
      </div>
    {/each}
  {:else if children}
    <!-- Composition mode with AccordionItem children -->
    {@render children()}
  {/if}
</div>
