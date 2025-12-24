/**
 * Reusable drag gesture handler using Pointer Events.
 * Tracks drag state, delta, and velocity for gesture-based UI.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { useDrag } from "@/runes/use-drag.svelte"
 *
 *   const drag = useDrag({ axis: "y" })
 * </script>
 *
 * <div
 *   onpointerdown={drag.handlers.onPointerDown}
 *   onpointermove={drag.handlers.onPointerMove}
 *   onpointerup={drag.handlers.onPointerUp}
 *   style:transform="translateY({drag.delta.y}px)"
 * >
 *   Draggable content
 * </div>
 * ```
 */
export function useDrag(options: { axis?: "x" | "y" | "both" } = {}) {
  let isDragging = $state(false)
  let startPos = $state({ x: 0, y: 0 })
  let delta = $state({ x: 0, y: 0 })
  let velocity = $state({ x: 0, y: 0 })

  let lastTime = 0
  let lastDelta = { x: 0, y: 0 }

  function onPointerDown(e: PointerEvent) {
    // Only handle primary pointer (touch or left mouse)
    if (e.button !== 0) return

    isDragging = true
    startPos = { x: e.clientX, y: e.clientY }
    delta = { x: 0, y: 0 }
    velocity = { x: 0, y: 0 }
    lastTime = Date.now()
    lastDelta = { x: 0, y: 0 }

    // Capture pointer to track outside element
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging) return

    const now = Date.now()
    const dt = Math.max(now - lastTime, 1) // Prevent division by zero

    const newDelta = {
      x: options.axis === "y" ? 0 : e.clientX - startPos.x,
      y: options.axis === "x" ? 0 : e.clientY - startPos.y,
    }

    // Calculate velocity (pixels per millisecond)
    velocity = {
      x: (newDelta.x - lastDelta.x) / dt,
      y: (newDelta.y - lastDelta.y) / dt,
    }

    delta = newDelta
    lastTime = now
    lastDelta = { ...newDelta }
  }

  function onPointerUp(e: PointerEvent) {
    if (!isDragging) return

    isDragging = false
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
  }

  function onPointerCancel(e: PointerEvent) {
    if (!isDragging) return

    isDragging = false
    delta = { x: 0, y: 0 }
    velocity = { x: 0, y: 0 }
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
  }

  function reset() {
    isDragging = false
    delta = { x: 0, y: 0 }
    velocity = { x: 0, y: 0 }
  }

  return {
    get isDragging() {
      return isDragging
    },
    get delta() {
      return delta
    },
    get velocity() {
      return velocity
    },
    reset,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
    },
  }
}
