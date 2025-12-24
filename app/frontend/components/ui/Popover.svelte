<!--
  @component Popover
  Displays rich content in a floating panel triggered by a button.

  @example Basic usage with trigger snippet
  ```svelte
  <script lang="ts">
    import Popover from "@/components/ui/Popover.svelte"
  </script>

  <Popover id="my-popover">
    {#snippet trigger()}
      <span>Open popover</span>
    {/snippet}

    <p>Popover content here</p>
  </Popover>
  ```

  @example With title and description
  ```svelte
  <Popover id="dimensions" triggerClass="btn-outline">
    {#snippet trigger()}
      Open Settings
    {/snippet}

    <header class="grid gap-1.5">
      <h4 class="leading-none font-medium">Dimensions</h4>
      <p class="text-muted-foreground text-sm">Set the dimensions for the layer.</p>
    </header>
    <form class="form grid gap-2 mt-4">
      <div class="grid grid-cols-3 items-center gap-4">
        <label for="width">Width</label>
        <input type="text" id="width" value="100%" class="col-span-2 h-8" />
      </div>
    </form>
  </Popover>
  ```

  @example With controlled open state
  ```svelte
  <script lang="ts">
    import Popover from "@/components/ui/Popover.svelte"

    let open = $state(false)
  </script>

  <button onclick={() => open = true}>External trigger</button>

  <Popover id="controlled" bind:open>
    {#snippet trigger()}
      Open popover
    {/snippet}

    <p>Controlled popover</p>
    <button onclick={() => open = false}>Close</button>
  </Popover>
  ```

  @example With side and align options
  ```svelte
  <Popover id="positioned" side="right" align="start">
    {#snippet trigger()}
      Open right
    {/snippet}

    <p>Positioned content</p>
  </Popover>
  ```

  @example Match popover width to trigger
  ```svelte
  <Popover id="user-menu" matchTriggerWidth triggerClass="w-full">
    {#snippet trigger()}
      Select user...
    {/snippet}

    <ul>
      <li>User 1</li>
      <li>User 2</li>
    </ul>
  </Popover>
  ```
-->
<script lang="ts">
  import type { Snippet } from "svelte"

  import { popoverState } from "@/runes/popover-state.svelte"
  import { cn } from "@/utils"

  type Props = {
    /** Unique identifier for the popover */
    id: string
    /** Whether popover is open (bindable) */
    open?: boolean
    /** Side to position the popover */
    side?: "top" | "right" | "bottom" | "left"
    /** Alignment of the popover */
    align?: "start" | "center" | "end"
    /** Match popover width to trigger width */
    matchTriggerWidth?: boolean
    /** CSS class for the container */
    class?: string
    /** CSS class for the trigger button */
    triggerClass?: string
    /** CSS class for the popover content */
    popoverClass?: string
    /** Callback when popover opens */
    onopen?: () => void
    /** Callback when popover closes */
    onclose?: () => void
    /** Trigger button content */
    trigger: Snippet
    /** Popover content (default slot) */
    children?: Snippet
  }

  let {
    id,
    open = $bindable(false),
    side = "bottom",
    align = "start",
    matchTriggerWidth = false,
    class: className,
    triggerClass,
    popoverClass,
    onopen,
    onclose,
    trigger,
    children,
  }: Props = $props()

  let triggerEl = $state<HTMLButtonElement | null>(null)
  let popoverEl = $state<HTMLDivElement | null>(null)
  let triggerWidth = $state<number | null>(null)

  // Track trigger width for matchTriggerWidth (fallback for browsers without anchor-size support)
  $effect(() => {
    if (!matchTriggerWidth || !triggerEl) return

    const updateWidth = () => {
      triggerWidth = triggerEl?.offsetWidth ?? null
    }
    updateWidth()

    const observer = new ResizeObserver(updateWidth)
    observer.observe(triggerEl)
    return () => observer.disconnect()
  })

  function openPopover() {
    // Set this as active popover (auto-closes others via reactive state)
    popoverState.open(id)

    open = true
    onopen?.()

    // Focus first autofocus element after transition
    popoverEl?.addEventListener(
      "transitionend",
      () => {
        const autofocusEl = popoverEl?.querySelector<HTMLElement>("[autofocus]")
        autofocusEl?.focus()
      },
      { once: true },
    )
  }

  function closePopover(focusTrigger = true) {
    if (!open) return
    popoverState.close(id)
    open = false
    onclose?.()
    if (focusTrigger) {
      triggerEl?.focus()
    }
  }

  function handleTriggerClick() {
    if (open) {
      closePopover()
    } else {
      openPopover()
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && open) {
      e.preventDefault()
      closePopover()
    }
  }

  // Click outside to close
  $effect(() => {
    if (!open) return

    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (!triggerEl?.contains(target) && !popoverEl?.contains(target)) {
        closePopover(false)
      }
    }

    document.addEventListener("click", handler)
    return () => document.removeEventListener("click", handler)
  })

  // Reactively close when another popover becomes active
  $effect(() => {
    if (
      open &&
      popoverState.activeId !== null &&
      popoverState.activeId !== id
    ) {
      closePopover(false)
    }
  })
</script>

<div {id} class={cn("popover", className)} data-popover-initialized="true">
  <button
    type="button"
    id="{id}-trigger"
    class={cn("btn-outline", triggerClass)}
    aria-expanded={open}
    aria-controls="{id}-popover"
    bind:this={triggerEl}
    onclick={handleTriggerClick}
    onkeydown={handleKeydown}
  >
    {@render trigger()}
  </button>

  <div
    id="{id}-popover"
    data-popover
    data-side={side}
    data-align={align}
    data-match-trigger-width={matchTriggerWidth || undefined}
    aria-hidden={!open}
    class={popoverClass}
    style={matchTriggerWidth && triggerWidth
      ? `--trigger-width: ${triggerWidth}px`
      : undefined}
    bind:this={popoverEl}
    onkeydown={handleKeydown}
  >
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>
