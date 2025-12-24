<!--
  @component AccordionItem
  An individual collapsible item within an Accordion.
  Uses button trigger with ARIA attributes and Svelte `slide` transition for animation.
  Must be used as a child of Accordion component (uses context for state).

  @example Basic usage (must be inside Accordion)
  ```svelte
  <AccordionItem title="Question title">
    Answer content here.
  </AccordionItem>
  ```

  @example With custom trigger content
  ```svelte
  <AccordionItem value="custom">
    {#snippet trigger()}
      <span class="flex items-center gap-2">
        <Icon /> Custom Title
      </span>
    {/snippet}
    Custom content here.
  </AccordionItem>
  ```

  @example Disabled item
  ```svelte
  <AccordionItem title="Disabled Item" disabled>
    This content cannot be expanded.
  </AccordionItem>
  ```
-->
<script lang="ts">
  import { ChevronDown } from "@lucide/svelte"
  import type { Snippet } from "svelte"
  import { getContext } from "svelte"
  import { slide } from "svelte/transition"

  import type { AccordionContext } from "@/components/ui/Accordion.svelte"
  import { cn } from "@/utils"

  // Auto-generate unique ID for this item
  const uid = $props.id()

  type Props = {
    /** Unique value for this item (auto-generated if not provided) */
    value?: string
    /** Title text for the trigger button */
    title?: string
    /** Whether the item is disabled */
    disabled?: boolean
    /** CSS class for the item container */
    class?: string
    /** CSS class for the trigger button */
    triggerClass?: string
    /** CSS class for the content section */
    contentClass?: string
    /** Custom trigger content (overrides title) */
    trigger?: Snippet
    /** Content to show when expanded */
    children?: Snippet
  }

  let {
    value: propValue,
    title,
    disabled = false,
    class: className,
    triggerClass,
    contentClass,
    trigger,
    children,
  }: Props = $props()

  // Use provided value or fall back to generated uid
  const value = $derived(propValue ?? uid)

  // Get accordion context
  const ctx = getContext<AccordionContext>("accordion")

  // Derive open state from context
  const isOpen = $derived(ctx?.openItems.has(value) ?? false)

  // Handle toggle
  function handleToggle() {
    if (disabled || !ctx) return
    ctx.toggle(value)
  }

  // Handle keyboard
  function handleKeydown(e: KeyboardEvent) {
    if (disabled) return
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleToggle()
    }
  }
</script>

<div
  class={cn("accordion-item border-b last:border-b-0", className)}
  data-state={isOpen ? "open" : "closed"}
  data-disabled={disabled || undefined}
>
  <h3 class="flex">
    <button
      type="button"
      class={cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none focus-visible:ring-[3px]",
        !disabled && "hover:underline",
        disabled && "cursor-not-allowed opacity-50",
        triggerClass,
      )}
      aria-expanded={isOpen}
      aria-controls="{value}-content"
      {disabled}
      onclick={handleToggle}
      onkeydown={handleKeydown}
    >
      {#if trigger}
        {@render trigger()}
      {:else}
        {title}
      {/if}
      <ChevronDown
        class={cn(
          "text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200",
          isOpen && "rotate-180",
        )}
      />
    </button>
  </h3>

  {#if isOpen}
    <div
      id="{value}-content"
      role="region"
      aria-labelledby="{value}-trigger"
      class={cn("overflow-hidden", contentClass)}
      transition:slide={{ duration: 200 }}
    >
      <div class="pb-4 text-sm">
        {#if children}
          {@render children()}
        {/if}
      </div>
    </div>
  {/if}
</div>
