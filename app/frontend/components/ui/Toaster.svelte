<!--
  @component Toaster
  A toast notification container that displays toast messages.
  Features: auto-dismiss with pause on hover, swipe to dismiss, close button.

  @example
  ```svelte
  <Toaster />
  <Toaster align="start" />
  <Toaster align="center" />
  ```
-->
<script lang="ts">
  import {
    CircleAlert,
    CircleCheck,
    CircleX,
    Info,
    LoaderCircle,
    X,
  } from "@lucide/svelte"
  import { SvelteMap } from "svelte/reactivity"

  import { type Toast, toast } from "@/runes/toast.svelte"

  type Props = {
    align?: "start" | "center" | "end"
  }

  let { align = "end" }: Props = $props()

  // Track pause state for hover-to-pause feature
  let isPaused = $state(false)

  // Store timeout state per toast: { timeoutId, remaining (ms), startTime }
  // Using SvelteMap for reactive tracking of timeout additions/removals
  const timeouts = new SvelteMap<
    string,
    { timeoutId: number; remaining: number; startTime: number }
  >()

  const icons = {
    success: CircleCheck,
    error: CircleX,
    info: Info,
    warning: CircleAlert,
    loading: LoaderCircle,
  }

  // ============================================
  // TIMER MANAGEMENT
  // Handles auto-dismiss with pause/resume support
  // ============================================

  /** Start or resume a toast's auto-dismiss timer. duration=-1 means no auto-dismiss (loading state) */
  function startTimer(t: Toast) {
    if (t.duration === -1) return // Loading toasts don't auto-dismiss
    const existing = timeouts.get(t.id)
    const remaining = existing?.remaining ?? t.duration
    if (remaining <= 0) return toast.dismiss(t.id)

    const timeoutId = window.setTimeout(() => {
      toast.dismiss(t.id)
      timeouts.delete(t.id)
    }, remaining)
    timeouts.set(t.id, { timeoutId, remaining, startTime: Date.now() })
  }

  /** Pause a timer and calculate remaining time for later resume */
  function pauseTimer(id: string) {
    const state = timeouts.get(id)
    if (!state) return
    window.clearTimeout(state.timeoutId)
    state.remaining -= Date.now() - state.startTime
  }

  /** Pause all timers on hover to let user read/interact */
  function handleMouseEnter() {
    isPaused = true
    for (const id of timeouts.keys()) pauseTimer(id)
  }

  /** Resume all paused timers when mouse leaves */
  function handleMouseLeave() {
    isPaused = false
    for (const t of toast.toasts) if (timeouts.has(t.id)) startTimer(t)
  }

  // ============================================
  // SWIPE TO DISMISS
  // Uses Svelte 5 {@attach} directive for pointer event handling
  // Returns cleanup function for event listener removal
  // ============================================

  /**
   * Svelte action factory for swipe-to-dismiss behavior.
   * Used with {@attach swipeable(id)} in the template.
   * @param id - Toast ID to dismiss on successful swipe
   * @returns Svelte action that handles pointer events
   */
  function swipeable(id: string) {
    return (node: HTMLElement) => {
      let startX = 0
      const THRESHOLD = 100 // Pixels required to trigger dismiss

      function onPointerDown(e: PointerEvent) {
        // Don't capture if clicking on interactive elements (buttons, links)
        const target = e.target as HTMLElement
        if (target.closest("button, a")) return

        node.setPointerCapture(e.pointerId) // Capture all pointer events
        startX = e.clientX
        node.style.transition = "none" // Disable transition during drag
      }

      function onPointerMove(e: PointerEvent) {
        if (!node.hasPointerCapture(e.pointerId)) return
        const offset = e.clientX - startX
        node.style.transform = `translateX(${offset}px)`
        // Fade out as user swipes further (1.5x threshold for full fade)
        node.style.opacity = String(
          Math.max(0, 1 - Math.abs(offset) / (THRESHOLD * 1.5)),
        )
      }

      function onPointerUp(e: PointerEvent) {
        if (!node.hasPointerCapture(e.pointerId)) return
        const offset = e.clientX - startX
        node.style.transition = "transform 0.2s ease-out, opacity 0.2s ease-out"

        if (Math.abs(offset) >= THRESHOLD) {
          toast.dismiss(id) // Swipe successful - dismiss
        } else {
          // Snap back to original position
          node.style.transform = ""
          node.style.opacity = ""
        }
      }

      node.addEventListener("pointerdown", onPointerDown)
      node.addEventListener("pointermove", onPointerMove)
      node.addEventListener("pointerup", onPointerUp)
      node.addEventListener("pointercancel", onPointerUp)

      // Cleanup: remove event listeners when toast is removed
      return () => {
        node.removeEventListener("pointerdown", onPointerDown)
        node.removeEventListener("pointermove", onPointerMove)
        node.removeEventListener("pointerup", onPointerUp)
        node.removeEventListener("pointercancel", onPointerUp)
      }
    }
  }

  // Runs whenever toast.toasts changes (add/remove) or isPaused changes
  // Only starts timer if toast doesn't already have one and not paused
  $effect(() => {
    for (const t of toast.toasts) {
      if (!timeouts.has(t.id) && !isPaused) startTimer(t)
    }
  })

  // The `() => () =>` pattern returns a cleanup function that runs on unmount
  $effect(() => () => {
    for (const { timeoutId } of timeouts.values())
      window.clearTimeout(timeoutId)
  })
</script>

<div
  id="toaster"
  class="toaster"
  data-align={align}
  role="region"
  aria-label="Notifications"
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
>
  {#each toast.toasts as t (t.id)}
    {@const Icon = icons[t.category]}
    <div
      class="toast group touch-pan-y"
      role={t.category === "error" ? "alert" : "status"}
      data-category={t.category}
      {@attach swipeable(t.id)}
    >
      <div class="toast-content relative select-none">
        <Icon class={t.category === "loading" ? "animate-spin" : ""} />
        <section>
          <h2>{t.title}</h2>
          {#if t.description}<p>{t.description}</p>{/if}
        </section>
        {#if t.action || t.cancel}
          <footer>
            {#if t.action}
              {#if t.action.href}
                <a
                  href={t.action.href}
                  class="btn h-6 rounded-md px-2.5 text-xs"
                  onclick={() => toast.dismiss(t.id)}
                >
                  {t.action.label}
                </a>
              {:else}
                <button
                  type="button"
                  class="btn h-6 rounded-md px-2.5 text-xs"
                  onclick={() => {
                    t.action?.onclick?.()
                    toast.dismiss(t.id)
                  }}
                >
                  {t.action.label}
                </button>
              {/if}
            {/if}
            {#if t.cancel}
              <button
                type="button"
                class="bg-muted text-muted-foreground hover:bg-muted/80 h-6 rounded-md px-2.5 text-xs font-medium"
                onclick={() => {
                  t.cancel?.onclick?.()
                  toast.dismiss(t.id)
                }}
              >
                {t.cancel.label}
              </button>
            {/if}
          </footer>
        {/if}
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground hover:bg-muted bg-popover absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full border opacity-0 shadow-sm transition-all group-hover:opacity-100"
          onclick={() => toast.dismiss(t.id)}
        >
          <X class="size-3.5" />
        </button>
      </div>
    </div>
  {/each}
</div>
