/**
 * Minimal popover positioning utility.
 * Inspired by Floating UI but simplified for our use case.
 *
 * Features:
 * - Fixed positioning relative to viewport
 * - Flip to opposite side when overflowing
 * - Shift along axis to stay within viewport
 * - Offset gap between trigger and popover
 */

export type Side = "top" | "bottom" | "left" | "right"
export type Alignment = "start" | "center" | "end"
export type Placement = Side | `${Side}-${Alignment}`

export interface PositionOptions {
  /** Placement relative to reference element */
  placement?: Placement
  /** Gap between reference and floating element */
  offset?: number
  /** Padding from viewport edges for shift */
  padding?: number
  /** Whether to flip when overflowing */
  flip?: boolean
  /** Whether to shift when overflowing */
  shift?: boolean
}

export interface PositionResult {
  x: number
  y: number
  placement: Placement
}

// Parse placement into side and alignment
function parsePlacement(placement: Placement): {
  side: Side
  alignment: Alignment
} {
  const parts = placement.split("-") as [Side, Alignment?]
  return {
    side: parts[0],
    alignment: parts[1] || "center",
  }
}

// Get opposite side
function getOppositeSide(side: Side): Side {
  const opposites: Record<Side, Side> = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  }
  return opposites[side]
}

// Get opposite alignment
function getOppositeAlignment(alignment: Alignment): Alignment {
  if (alignment === "start") return "end"
  if (alignment === "end") return "start"
  return "center"
}

// Check if side is vertical
function isVertical(side: Side): boolean {
  return side === "top" || side === "bottom"
}

// Calculate base position for a given placement
function computeCoords(
  reference: DOMRect,
  floating: DOMRect,
  side: Side,
  alignment: Alignment,
): { x: number; y: number } {
  let x: number
  let y: number

  // Position on the correct side
  switch (side) {
    case "top":
      x = reference.left + reference.width / 2 - floating.width / 2
      y = reference.top - floating.height
      break
    case "bottom":
      x = reference.left + reference.width / 2 - floating.width / 2
      y = reference.bottom
      break
    case "left":
      x = reference.left - floating.width
      y = reference.top + reference.height / 2 - floating.height / 2
      break
    case "right":
      x = reference.right
      y = reference.top + reference.height / 2 - floating.height / 2
      break
  }

  // Apply alignment
  if (isVertical(side)) {
    // Horizontal alignment for top/bottom
    switch (alignment) {
      case "start":
        x = reference.left
        break
      case "end":
        x = reference.right - floating.width
        break
      // center is default from above
    }
  } else {
    // Vertical alignment for left/right
    switch (alignment) {
      case "start":
        y = reference.top
        break
      case "end":
        y = reference.bottom - floating.height
        break
      // center is default from above
    }
  }

  return { x, y }
}

// Check overflow on each side of viewport
function getOverflow(
  x: number,
  y: number,
  floating: DOMRect,
  padding: number,
): { top: number; bottom: number; left: number; right: number } {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  return {
    top: padding - y,
    bottom: y + floating.height - viewport.height + padding,
    left: padding - x,
    right: x + floating.width - viewport.width + padding,
  }
}

/**
 * Compute position for a floating element relative to a reference element.
 * Uses fixed positioning (viewport-relative coordinates).
 */
export function computePosition(
  reference: HTMLElement,
  floating: HTMLElement,
  options: PositionOptions = {},
): PositionResult {
  const {
    placement = "bottom-start",
    offset: offsetValue = 0,
    padding = 8,
    flip: shouldFlip = true,
    shift: shouldShift = true,
  } = options

  const referenceRect = reference.getBoundingClientRect()
  const floatingRect = floating.getBoundingClientRect()

  let { side, alignment } = parsePlacement(placement)

  // Calculate initial position
  let { x, y } = computeCoords(referenceRect, floatingRect, side, alignment)

  // Apply offset
  switch (side) {
    case "top":
      y -= offsetValue
      break
    case "bottom":
      y += offsetValue
      break
    case "left":
      x -= offsetValue
      break
    case "right":
      x += offsetValue
      break
  }

  // Flip if overflowing
  if (shouldFlip) {
    const overflow = getOverflow(x, y, floatingRect, padding)
    const mainAxisOverflow = isVertical(side)
      ? side === "top"
        ? overflow.top
        : overflow.bottom
      : side === "left"
        ? overflow.left
        : overflow.right

    // Flip main axis (side) if overflowing
    if (mainAxisOverflow > 0) {
      const oppositeSide = getOppositeSide(side)
      const flippedCoords = computeCoords(
        referenceRect,
        floatingRect,
        oppositeSide,
        alignment,
      )

      // Apply offset for flipped position
      let flippedX = flippedCoords.x
      let flippedY = flippedCoords.y
      switch (oppositeSide) {
        case "top":
          flippedY -= offsetValue
          break
        case "bottom":
          flippedY += offsetValue
          break
        case "left":
          flippedX -= offsetValue
          break
        case "right":
          flippedX += offsetValue
          break
      }

      const flippedOverflow = getOverflow(
        flippedX,
        flippedY,
        floatingRect,
        padding,
      )
      const flippedMainAxisOverflow = isVertical(oppositeSide)
        ? oppositeSide === "top"
          ? flippedOverflow.top
          : flippedOverflow.bottom
        : oppositeSide === "left"
          ? flippedOverflow.left
          : flippedOverflow.right

      // Use flipped position if it has less overflow
      if (flippedMainAxisOverflow < mainAxisOverflow) {
        side = oppositeSide
        x = flippedX
        y = flippedY
      }
    }

    // Flip cross axis (alignment) if overflowing
    if (alignment !== "center") {
      const crossOverflow = getOverflow(x, y, floatingRect, padding)
      const crossAxisOverflow = isVertical(side)
        ? alignment === "start"
          ? crossOverflow.right
          : crossOverflow.left
        : alignment === "start"
          ? crossOverflow.bottom
          : crossOverflow.top

      if (crossAxisOverflow > 0) {
        const oppositeAlignment = getOppositeAlignment(alignment)
        const flippedCoords = computeCoords(
          referenceRect,
          floatingRect,
          side,
          oppositeAlignment,
        )

        const flippedOverflow = getOverflow(
          flippedCoords.x,
          flippedCoords.y,
          floatingRect,
          padding,
        )
        const flippedCrossAxisOverflow = isVertical(side)
          ? oppositeAlignment === "start"
            ? flippedOverflow.right
            : flippedOverflow.left
          : oppositeAlignment === "start"
            ? flippedOverflow.bottom
            : flippedOverflow.top

        // Use flipped alignment if it has less overflow
        // Only update cross-axis coordinate (alignment doesn't affect main axis)
        if (flippedCrossAxisOverflow < crossAxisOverflow) {
          alignment = oppositeAlignment
          if (isVertical(side)) {
            x = flippedCoords.x // Horizontal alignment change
          } else {
            y = flippedCoords.y // Vertical alignment change
          }
        }
      }
    }
  }

  // Shift to stay within viewport
  if (shouldShift) {
    const overflow = getOverflow(x, y, floatingRect, padding)

    if (isVertical(side)) {
      // Shift horizontally
      if (overflow.left > 0) {
        x += overflow.left
      } else if (overflow.right > 0) {
        x -= overflow.right
      }
    } else {
      // Shift vertically
      if (overflow.top > 0) {
        y += overflow.top
      } else if (overflow.bottom > 0) {
        y -= overflow.bottom
      }
    }
  }

  // Construct final placement string
  const finalPlacement: Placement =
    alignment === "center" ? side : `${side}-${alignment}`

  return { x, y, placement: finalPlacement }
}
