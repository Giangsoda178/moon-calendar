<!--
  @component BottomSheet
  Slide-up modal from bottom with drag-to-dismiss and snap points.
  Follows Basecoat Dialog styling patterns.

  @example Basic usage
  ```svelte
  <script lang="ts">
    let sheetOpen = $state(false)
  </script>

  <button onclick={() => sheetOpen = true}>Open Sheet</button>

  <BottomSheet bind:open={sheetOpen}>
    <p class="p-4">Sheet content here</p>
  </BottomSheet>
  ```

  @example With header
  ```svelte
  <BottomSheet bind:open={sheetOpen} title="Options">
    <div class="p-4">
      <button>Option 1</button>
      <button>Option 2</button>
    </div>
  </BottomSheet>
  ```

  @example Custom snap points
  ```svelte
  <BottomSheet bind:open={sheetOpen} snapPoints={[0.3, 0.6, 0.95]}>
    <p class="p-4">Custom height sheet</p>
  </BottomSheet>
  ```
-->
<script lang="ts">
  import { X } from "@lucide/svelte"
  import type { Snippet } from "svelte"
  import { cubicOut } from "svelte/easing"
  import { fade, fly } from "svelte/transition"

  import { cn } from "@/utils"

  // iOS Animation Constants
  const OPEN_ANIMATION_MS = 400 // iOS-style smooth entry
  const CLOSE_ANIMATION_MS = 300 // Slightly faster exit

  // iOS Physics Constants
  const RUBBER_BAND_LIMIT = 80 // Max stretch in px for over-drag
  const RUBBER_BAND_COEFF = 0.4 // Resistance coefficient (0-1)
  const VELOCITY_THRESHOLD = 0.3 // px/ms for fast swipe dismissal
  const MOMENTUM_THRESHOLD = 0.15 // px/ms for snap point navigation

  // Rubber-band physics: asymptotic resistance for over-drag (pulling up past bounds)
  function rubberBand(distance: number, limit: number, coeff: number): number {
    if (distance >= 0) return distance // Normal drag down - no resistance
    // Over-drag up: apply asymptotic resistance (approaches limit, never exceeds)
    const absDistance = Math.abs(distance)
    const rubberBanded = limit * (1 - Math.exp((-absDistance * coeff) / limit))
    return -rubberBanded
  }

  type Props = {
    /** Whether sheet is open (bindable) */
    open?: boolean
    /** Sheet title (optional) */
    title?: string
    /** Sheet description (optional) */
    description?: string
    /** Snap points as viewport height percentages (0-1) */
    snapPoints?: number[]
    /** Initial snap point index */
    initialSnap?: number
    /** Close when backdrop clicked */
    closeOnBackdropClick?: boolean
    /** Show close X button */
    showCloseButton?: boolean
    /** Callback when closed */
    onclose?: () => void
    /** Additional CSS classes for sheet */
    class?: string
    /** Header slot */
    header?: Snippet
    /** Main content */
    children: Snippet
  }

  let {
    open = $bindable(false),
    title,
    description,
    snapPoints = [0.5, 0.95],
    initialSnap = 0,
    closeOnBackdropClick = true,
    showCloseButton = false,
    onclose,
    class: className,
    header,
    children,
  }: Props = $props()

  // Drag state - managed inline for reliability
  let isDragging = $state(false)
  let startY = $state(0)
  let dragDelta = $state(0)
  let lastY = $state(0)
  let lastTime = $state(0)
  let velocityY = $state(0)

  let sheetEl = $state<HTMLDivElement | null>(null)
  let contentEl = $state<HTMLDivElement | null>(null)
  let sheetHeight = $state(0)
  // Note: initialSnap is intentionally captured at mount - snap index managed internally after open
  let currentSnapIndex = $state(initialSnap)
  let isClosing = $state(false) // For animated close
  let hasOverflow = $state(false) // Track if content is scrollable
  let isAtScrollTop = $state(true) // Track if scrolled to top

  // Calculate sheet height on mount/resize
  $effect(() => {
    if (!sheetEl || !open) return

    const updateHeight = () => {
      sheetHeight = window.innerHeight
    }

    updateHeight()
    window.addEventListener("resize", updateHeight)

    return () => window.removeEventListener("resize", updateHeight)
  })

  // Track content overflow and scroll position
  $effect(() => {
    if (!contentEl || !open) return

    const checkOverflow = () => {
      hasOverflow = contentEl!.scrollHeight > contentEl!.clientHeight
      isAtScrollTop = contentEl!.scrollTop <= 0
    }

    const handleScroll = () => {
      isAtScrollTop = contentEl!.scrollTop <= 0
    }

    checkOverflow()
    contentEl.addEventListener("scroll", handleScroll)

    // Use ResizeObserver to detect content changes
    const observer = new ResizeObserver(checkOverflow)
    observer.observe(contentEl)

    return () => {
      contentEl?.removeEventListener("scroll", handleScroll)
      observer.disconnect()
    }
  })

  // Lock body scroll when open and reset state on open/close
  $effect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      // Reset to initial state when opening
      currentSnapIndex = initialSnap
      isClosing = false
      dragDelta = 0
      isDragging = false
    } else {
      document.body.style.overflow = ""
      // Reset all state when closed
      currentSnapIndex = initialSnap
      dragDelta = 0
      isDragging = false
      isClosing = false
    }

    return () => {
      document.body.style.overflow = ""
    }
  })

  // Current snap height in pixels
  let snapHeight = $derived(snapPoints[currentSnapIndex] * sheetHeight)

  // Whether over-drag (upward) should apply rubber-band effect
  // Only allow over-drag when there IS scrollable content AND at scroll top
  // This provides visual feedback that there's more content above/below
  let allowOverDrag = $derived(hasOverflow && isAtScrollTop)

  // Transform during drag with rubber-band physics for over-drag
  let translateY = $derived.by(() => {
    if (isClosing) return snapHeight // Animate off-screen
    if (!isDragging) return 0
    // Apply rubber-band physics only when over-drag is allowed
    // For upward drag (negative delta), only apply resistance if allowOverDrag
    if (dragDelta < 0 && !allowOverDrag) {
      return 0 // Block upward over-drag when content is scrollable and not at top
    }
    return rubberBand(dragDelta, RUBBER_BAND_LIMIT, RUBBER_BAND_COEFF)
  })

  function handlePointerDown(e: PointerEvent) {
    // Don't initiate drag if clicking interactive element
    const target = e.target as HTMLElement
    if (target.closest('button, a, input, select, textarea, [role="button"]')) {
      return
    }

    if (e.button !== 0) return

    isDragging = true
    startY = e.clientY
    dragDelta = 0
    lastY = e.clientY
    lastTime = Date.now()
    velocityY = 0
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDragging) return

    const now = Date.now()
    const dt = Math.max(now - lastTime, 1)

    dragDelta = e.clientY - startY
    velocityY = (e.clientY - lastY) / dt

    lastY = e.clientY
    lastTime = now
  }

  function handlePointerUp(e: PointerEvent) {
    if (!isDragging) return

    // Capture values before resetting
    const finalDelta = dragDelta
    const finalVelocity = velocityY

    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)

    // iOS-style velocity-based gesture handling
    // Only allow snap point expansion if content has overflow (needs more space)
    const canExpand = hasOverflow && snapPoints.length > 1

    if (finalVelocity > VELOCITY_THRESHOLD) {
      // Fast swipe down = close immediately
      animateClose()
    } else if (finalVelocity < -MOMENTUM_THRESHOLD && canExpand) {
      // Fast swipe up = go to next larger snap point (only if content overflows)
      if (currentSnapIndex < snapPoints.length - 1) {
        currentSnapIndex++
      }
    } else if (finalVelocity > MOMENTUM_THRESHOLD && snapPoints.length > 1) {
      // Medium swipe down = go to smaller snap or close
      if (currentSnapIndex > 0) {
        currentSnapIndex--
      } else if (finalDelta > snapHeight * 0.3) {
        animateClose()
      }
    } else {
      // No significant velocity - use position threshold
      if (finalDelta > snapHeight * 0.4) {
        animateClose()
      }
      // Otherwise spring back to current snap (handled by CSS transition)
    }

    // Reset drag state
    isDragging = false
    dragDelta = 0
    velocityY = 0
  }

  function handlePointerCancel(e: PointerEvent) {
    if (!isDragging) return
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    isDragging = false
    dragDelta = 0
    velocityY = 0
  }

  function animateClose() {
    isClosing = true
    // Animate off-screen, then close
    setTimeout(() => {
      open = false
      isClosing = false
      onclose?.()
    }, CLOSE_ANIMATION_MS)
  }

  function close() {
    // Animated close for all dismissal methods (iOS-style smooth animation)
    animateClose()
  }

  function handleBackdropClick() {
    if (closeOnBackdropClick) {
      animateClose()
    }
  }
</script>

{#if open}
  <!-- Backdrop - iOS style with subtle blur and smooth fade -->
  <div
    class={cn(
      "fixed inset-0 z-40",
      "bg-black/30 backdrop-blur-[8px]", // iOS-style: light dim + subtle blur
    )}
    transition:fade={{ duration: OPEN_ANIMATION_MS, easing: cubicOut }}
    onclick={handleBackdropClick}
    onkeydown={(e) => e.key === "Escape" && animateClose()}
    aria-label="Close sheet"
    role="button"
    tabindex="-1"
  ></div>

  <!-- Sheet - iOS style with frosted glass and smooth slide-up -->
  <div
    bind:this={sheetEl}
    class={cn(
      // Base layout
      "pb-safe fixed inset-x-0 bottom-0 z-50 flex flex-col",
      // iOS-style appearance: frosted glass with blur (~20px like iOS)
      "bg-background/98 backdrop-blur-[20px]",
      "border-border/50 rounded-t-xl border-t",
      // Shadow - iOS style: large blur, low opacity
      "shadow-[0_-8px_30px_rgba(0,0,0,0.12)]",
      "dark:shadow-[0_-8px_30px_rgba(0,0,0,0.4)]",
      className,
    )}
    in:fly={{ y: 500, duration: OPEN_ANIMATION_MS, easing: cubicOut }}
    style:height="{snapHeight}px"
    style:transform="translateY({translateY}px)"
    style:transition={isDragging
      ? "none"
      : "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1), height 0.4s cubic-bezier(0.32, 0.72, 0, 1)"}
    role="dialog"
    aria-modal="true"
    aria-labelledby={title ? "bottom-sheet-title" : undefined}
    aria-describedby={description ? "bottom-sheet-description" : undefined}
  >
    <!-- Combined drag header zone (min 64px) - iOS style full header draggable -->
    <div
      class="flex shrink-0 cursor-grab touch-none flex-col select-none active:cursor-grabbing"
      style="min-height: 64px"
      onpointerdown={handlePointerDown}
      onpointermove={handlePointerMove}
      onpointerup={handlePointerUp}
      onpointercancel={handlePointerCancel}
    >
      <!-- Grip indicator - iOS style: thin, subtle, with drag feedback -->
      <div class="flex items-center justify-center py-2.5">
        <div
          class={cn(
            "h-1 w-9 rounded-full transition-colors",
            "bg-muted-foreground/25",
            isDragging && "bg-muted-foreground/40",
          )}
          aria-hidden="true"
        ></div>
      </div>

      <!-- Header content (if any) -->
      {#if header}
        <div class="px-4 pb-3">
          {@render header()}
        </div>
      {:else if title || description}
        <div class="px-4 pb-3">
          {#if title}
            <h2
              id="bottom-sheet-title"
              class="text-base leading-tight font-semibold tracking-tight"
            >
              {title}
            </h2>
          {/if}
          {#if description}
            <p
              id="bottom-sheet-description"
              class="text-muted-foreground mt-1 text-sm leading-snug"
            >
              {description}
            </p>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Close button -->
    {#if showCloseButton}
      <button
        type="button"
        class="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
        onclick={close}
        aria-label="Close"
      >
        <X class="size-4" />
      </button>
    {/if}

    <!-- Content -->
    <div
      bind:this={contentEl}
      class="flex-1 overflow-y-auto overscroll-contain px-4 pb-4"
    >
      {@render children()}
    </div>
  </div>
{/if}
