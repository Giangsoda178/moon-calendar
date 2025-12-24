import { beforeEach, describe, expect, it } from "vitest"

import { type Placement, computePosition } from "./position"

/**
 * Tests matching Floating UI's computeCoordsFromPlacement.test.ts
 * Reference: https://github.com/floating-ui/floating-ui/blob/master/packages/core/test/computeCoordsFromPlacement.test.ts
 *
 * Uses same reference (100x100 at 0,0) and floating (50x50) dimensions
 * to ensure coordinate calculations match Floating UI exactly.
 */
describe("computePosition - Floating UI compatibility", () => {
  // Same dimensions as Floating UI tests
  const createFloatingUIElements = () => {
    const reference = {
      getBoundingClientRect: () => ({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        top: 0,
        left: 0,
        right: 100,
        bottom: 100,
        toJSON: () => ({}),
      }),
    } as HTMLElement

    const floating = {
      getBoundingClientRect: () => ({
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        top: 0,
        left: 0,
        right: 50,
        bottom: 50,
        toJSON: () => ({}),
      }),
    } as HTMLElement

    return { reference, floating }
  }

  beforeEach(() => {
    // Large viewport to avoid flip/shift interference
    Object.defineProperty(window, "innerWidth", {
      value: 2000,
      configurable: true,
    })
    Object.defineProperty(window, "innerHeight", {
      value: 2000,
      configurable: true,
    })
  })

  it("bottom: x=25, y=100", () => {
    const { reference, floating } = createFloatingUIElements()
    const result = computePosition(reference, floating, {
      placement: "bottom",
      flip: false,
      shift: false,
    })
    expect(result.x).toBe(25)
    expect(result.y).toBe(100)
  })

  it("bottom-start: x=0, y=100", () => {
    const { reference, floating } = createFloatingUIElements()
    const result = computePosition(reference, floating, {
      placement: "bottom-start",
      flip: false,
      shift: false,
    })
    expect(result.x).toBe(0)
    expect(result.y).toBe(100)
  })

  it("bottom-end: x=50, y=100", () => {
    const { reference, floating } = createFloatingUIElements()
    const result = computePosition(reference, floating, {
      placement: "bottom-end",
      flip: false,
      shift: false,
    })
    expect(result.x).toBe(50)
    expect(result.y).toBe(100)
  })

  it("top: x=25, y=-50", () => {
    const { reference, floating } = createFloatingUIElements()
    const result = computePosition(reference, floating, {
      placement: "top",
      flip: false,
      shift: false,
    })
    expect(result.x).toBe(25)
    expect(result.y).toBe(-50)
  })

  it("top-start: x=0, y=-50", () => {
    const { reference, floating } = createFloatingUIElements()
    const result = computePosition(reference, floating, {
      placement: "top-start",
      flip: false,
      shift: false,
    })
    expect(result.x).toBe(0)
    expect(result.y).toBe(-50)
  })

  it("top-end: x=50, y=-50", () => {
    const { reference, floating } = createFloatingUIElements()
    const result = computePosition(reference, floating, {
      placement: "top-end",
      flip: false,
      shift: false,
    })
    expect(result.x).toBe(50)
    expect(result.y).toBe(-50)
  })

  it("right: x=100, y=25", () => {
    const { reference, floating } = createFloatingUIElements()
    const result = computePosition(reference, floating, {
      placement: "right",
      flip: false,
      shift: false,
    })
    expect(result.x).toBe(100)
    expect(result.y).toBe(25)
  })

  it("right-start: x=100, y=0", () => {
    const { reference, floating } = createFloatingUIElements()
    const result = computePosition(reference, floating, {
      placement: "right-start",
      flip: false,
      shift: false,
    })
    expect(result.x).toBe(100)
    expect(result.y).toBe(0)
  })

  it("right-end: x=100, y=50", () => {
    const { reference, floating } = createFloatingUIElements()
    const result = computePosition(reference, floating, {
      placement: "right-end",
      flip: false,
      shift: false,
    })
    expect(result.x).toBe(100)
    expect(result.y).toBe(50)
  })

  it("left: x=-50, y=25", () => {
    const { reference, floating } = createFloatingUIElements()
    const result = computePosition(reference, floating, {
      placement: "left",
      flip: false,
      shift: false,
    })
    expect(result.x).toBe(-50)
    expect(result.y).toBe(25)
  })

  it("left-start: x=-50, y=0", () => {
    const { reference, floating } = createFloatingUIElements()
    const result = computePosition(reference, floating, {
      placement: "left-start",
      flip: false,
      shift: false,
    })
    expect(result.x).toBe(-50)
    expect(result.y).toBe(0)
  })

  it("left-end: x=-50, y=50", () => {
    const { reference, floating } = createFloatingUIElements()
    const result = computePosition(reference, floating, {
      placement: "left-end",
      flip: false,
      shift: false,
    })
    expect(result.x).toBe(-50)
    expect(result.y).toBe(50)
  })

  describe("offset behavior matching Floating UI", () => {
    it("positive offset increases distance from reference", () => {
      const { reference, floating } = createFloatingUIElements()

      const noOffset = computePosition(reference, floating, {
        placement: "bottom",
        offset: 0,
        flip: false,
        shift: false,
      })
      const withOffset = computePosition(reference, floating, {
        placement: "bottom",
        offset: 10,
        flip: false,
        shift: false,
      })

      expect(withOffset.y - noOffset.y).toBe(10)
    })

    it("negative offset decreases distance (overlaps reference)", () => {
      const { reference, floating } = createFloatingUIElements()

      const noOffset = computePosition(reference, floating, {
        placement: "bottom",
        offset: 0,
        flip: false,
        shift: false,
      })
      const withOffset = computePosition(reference, floating, {
        placement: "bottom",
        offset: -10,
        flip: false,
        shift: false,
      })

      expect(noOffset.y - withOffset.y).toBe(10)
    })

    it("offset applied correctly to right placement", () => {
      const { reference, floating } = createFloatingUIElements()
      const result = computePosition(reference, floating, {
        placement: "right",
        offset: 10,
        flip: false,
        shift: false,
      })
      expect(result.x).toBe(110) // 100 + 10
    })

    it("offset applied correctly to top placement", () => {
      const { reference, floating } = createFloatingUIElements()
      const result = computePosition(reference, floating, {
        placement: "top",
        offset: 10,
        flip: false,
        shift: false,
      })
      expect(result.y).toBe(-60) // -50 - 10
    })

    it("offset applied correctly to left placement", () => {
      const { reference, floating } = createFloatingUIElements()
      const result = computePosition(reference, floating, {
        placement: "left",
        offset: 10,
        flip: false,
        shift: false,
      })
      expect(result.x).toBe(-60) // -50 - 10
    })
  })

  describe("flip behavior matching Floating UI", () => {
    it("does not flip when flip is false (mainAxis disabled)", () => {
      Object.defineProperty(window, "innerHeight", {
        value: 120,
        configurable: true,
      })

      const { reference, floating } = createFloatingUIElements()
      // Floating would be at y=100, extends to y=150, but viewport is only 120
      const result = computePosition(reference, floating, {
        placement: "bottom",
        flip: false,
        shift: false,
      })

      expect(result.placement).toBe("bottom")
      expect(result.y).toBe(100)
    })

    it("flips when opposite side has less overflow", () => {
      // Reference at y=0, height=100
      // Floating height=50
      // Viewport height=140
      // Bottom: y=100, extends to 150, overflow = 150-140+padding = 10+8 = 18
      // Top: y=-50, extends from -50 to 0, overflow = 8-(-50) = 58
      // Since 58 > 18, should NOT flip (bottom is better)
      Object.defineProperty(window, "innerHeight", {
        value: 140,
        configurable: true,
      })
      const { reference, floating } = createFloatingUIElements()
      const result = computePosition(reference, floating, {
        placement: "bottom",
        flip: true,
        shift: false,
      })
      expect(result.placement).toBe("bottom") // Stays because bottom has less overflow

      // Now test when top is better
      // Viewport height = 200, reference pushed down to y=160
      Object.defineProperty(window, "innerHeight", {
        value: 200,
        configurable: true,
      })
      const refAtBottom = {
        getBoundingClientRect: () => ({
          x: 0,
          y: 160,
          width: 100,
          height: 100,
          top: 160,
          left: 0,
          right: 100,
          bottom: 260,
          toJSON: () => ({}),
        }),
      } as HTMLElement
      // Bottom: y=260, extends to 310, overflow = 310-200+8 = 118
      // Top: y=110, extends from 110 to 160, overflow = 8-110 = -102 (no overflow!)
      const result2 = computePosition(refAtBottom, floating, {
        placement: "bottom",
        flip: true,
        shift: false,
      })
      expect(result2.placement).toBe("top")
      expect(result2.y).toBe(110) // 160 - 50
    })

    it("keeps better position when both sides overflow", () => {
      // With a tiny viewport where both sides overflow
      Object.defineProperty(window, "innerHeight", {
        value: 120,
        configurable: true,
      })

      const { reference, floating } = createFloatingUIElements()
      // Bottom: y=100, extends to 150, overflow = 150-120+8 = 38
      // Top: y=-50, extends from -50 to 0, overflow = 8-(-50) = 58
      // Bottom has less overflow (38 < 58), so should stay at bottom
      const result = computePosition(reference, floating, {
        placement: "bottom",
        flip: true,
        shift: false,
      })

      expect(result.placement).toBe("bottom")
      expect(result.y).toBe(100)
    })
  })

  describe("shift behavior matching Floating UI", () => {
    it("does not shift on mainAxis (only crossAxis) for top/bottom", () => {
      // Shift only affects the cross axis (x for top/bottom placements)
      Object.defineProperty(window, "innerWidth", {
        value: 40,
        configurable: true,
      })

      const { reference, floating } = createFloatingUIElements()
      // bottom-center would place x=25, floating width 50, right edge at 75 > viewport 40
      const result = computePosition(reference, floating, {
        placement: "bottom",
        flip: false,
        shift: true,
        padding: 0,
      })

      // Should shift left so right edge = 40: x = 40 - 50 = -10
      expect(result.x).toBe(-10)
    })

    it("respects padding when shifting - shifts away from overflowing edge", () => {
      // Viewport 100, floating 50 at x=80 (right edge at 130)
      Object.defineProperty(window, "innerWidth", {
        value: 100,
        configurable: true,
      })

      const refNearRight = {
        getBoundingClientRect: () => ({
          x: 80,
          y: 0,
          width: 100,
          height: 100,
          top: 0,
          left: 80,
          right: 180,
          bottom: 100,
          toJSON: () => ({}),
        }),
      } as HTMLElement

      const floating = {
        getBoundingClientRect: () => ({
          x: 0,
          y: 0,
          width: 50,
          height: 50,
          top: 0,
          left: 0,
          right: 50,
          bottom: 50,
          toJSON: () => ({}),
        }),
      } as HTMLElement

      // bottom-start at x=80, floating width 50, right edge at 130
      // viewport = 100, padding = 8
      // overflow.right = 80 + 50 - 100 + 8 = 38
      // Should shift left by 38
      const result = computePosition(refNearRight, floating, {
        placement: "bottom-start",
        flip: false,
        shift: true,
        padding: 8,
      })

      // Right edge should be at 100 - 8 = 92
      // So x should be 92 - 50 = 42
      expect(result.x).toBe(42)
    })

    it("when floating is wider than viewport minus padding, prioritizes left edge", () => {
      // Edge case: floating is 50px, viewport is 50px, padding is 8
      // Can't satisfy both edges, should prioritize left (first check)
      Object.defineProperty(window, "innerWidth", {
        value: 50,
        configurable: true,
      })

      const { reference, floating } = createFloatingUIElements()
      const result = computePosition(reference, floating, {
        placement: "bottom-start",
        flip: false,
        shift: true,
        padding: 8,
      })

      // overflow.left = 8 - 0 = 8 > 0, shifts right to x=8
      expect(result.x).toBe(8)
    })
  })
})

// Mock getBoundingClientRect for elements
function createMockElement(rect: Partial<DOMRect>): HTMLElement {
  const defaultRect: DOMRect = {
    x: 0,
    y: 0,
    width: 100,
    height: 40,
    top: 0,
    right: 100,
    bottom: 40,
    left: 0,
    toJSON: () => ({}),
  }
  const mergedRect = { ...defaultRect, ...rect }
  // Ensure computed values are consistent
  mergedRect.right = mergedRect.left + mergedRect.width
  mergedRect.bottom = mergedRect.top + mergedRect.height
  mergedRect.x = mergedRect.left
  mergedRect.y = mergedRect.top

  return {
    getBoundingClientRect: () => mergedRect,
  } as HTMLElement
}

// Set viewport size
function setViewport(width: number, height: number) {
  Object.defineProperty(window, "innerWidth", {
    value: width,
    configurable: true,
  })
  Object.defineProperty(window, "innerHeight", {
    value: height,
    configurable: true,
  })
}

describe("computePosition", () => {
  beforeEach(() => {
    // Reset viewport to standard size
    setViewport(1024, 768)
  })

  describe("basic placement", () => {
    describe("bottom placement (default)", () => {
      it("positions below reference, aligned start", () => {
        const reference = createMockElement({
          left: 100,
          top: 50,
          width: 100,
          height: 40,
        })
        const floating = createMockElement({ width: 200, height: 100 })

        const result = computePosition(reference, floating, {
          placement: "bottom-start",
        })

        expect(result.x).toBe(100) // aligned to left edge of reference
        expect(result.y).toBe(50 + 40) // below reference (top + height)
        expect(result.placement).toBe("bottom-start")
      })

      it("positions below reference, aligned center", () => {
        const reference = createMockElement({
          left: 100,
          top: 50,
          width: 100,
          height: 40,
        })
        const floating = createMockElement({ width: 200, height: 100 })

        const result = computePosition(reference, floating, {
          placement: "bottom",
        })

        // Center: reference.left + reference.width/2 - floating.width/2
        // = 100 + 50 - 100 = 50
        expect(result.x).toBe(50)
        expect(result.y).toBe(90)
        expect(result.placement).toBe("bottom")
      })

      it("positions below reference, aligned end", () => {
        const reference = createMockElement({
          left: 100,
          top: 50,
          width: 100,
          height: 40,
        })
        const floating = createMockElement({ width: 200, height: 100 })

        // Disable flip and shift to test pure placement
        const result = computePosition(reference, floating, {
          placement: "bottom-end",
          flip: false,
          shift: false,
        })

        // End: reference.right - floating.width = 200 - 200 = 0
        expect(result.x).toBe(0)
        expect(result.y).toBe(90)
        expect(result.placement).toBe("bottom-end")
      })
    })

    describe("top placement", () => {
      it("positions above reference, aligned start", () => {
        const reference = createMockElement({
          left: 100,
          top: 200,
          width: 100,
          height: 40,
        })
        const floating = createMockElement({ width: 150, height: 80 })

        const result = computePosition(reference, floating, {
          placement: "top-start",
        })

        expect(result.x).toBe(100)
        expect(result.y).toBe(200 - 80) // reference.top - floating.height
        expect(result.placement).toBe("top-start")
      })

      it("positions above reference, aligned center", () => {
        const reference = createMockElement({
          left: 100,
          top: 200,
          width: 100,
          height: 40,
        })
        const floating = createMockElement({ width: 100, height: 80 })

        const result = computePosition(reference, floating, {
          placement: "top",
        })

        expect(result.x).toBe(100) // centered when same width
        expect(result.y).toBe(120)
        expect(result.placement).toBe("top")
      })

      it("positions above reference, aligned end", () => {
        const reference = createMockElement({
          left: 100,
          top: 200,
          width: 100,
          height: 40,
        })
        const floating = createMockElement({ width: 150, height: 80 })

        const result = computePosition(reference, floating, {
          placement: "top-end",
        })

        // reference.right - floating.width = 200 - 150 = 50
        expect(result.x).toBe(50)
        expect(result.y).toBe(120)
        expect(result.placement).toBe("top-end")
      })
    })

    describe("left placement", () => {
      it("positions left of reference, aligned start", () => {
        const reference = createMockElement({
          left: 300,
          top: 100,
          width: 100,
          height: 40,
        })
        const floating = createMockElement({ width: 150, height: 80 })

        const result = computePosition(reference, floating, {
          placement: "left-start",
        })

        expect(result.x).toBe(300 - 150) // reference.left - floating.width
        expect(result.y).toBe(100) // aligned to top of reference
        expect(result.placement).toBe("left-start")
      })

      it("positions left of reference, aligned center", () => {
        const reference = createMockElement({
          left: 300,
          top: 100,
          width: 100,
          height: 40,
        })
        const floating = createMockElement({ width: 150, height: 80 })

        const result = computePosition(reference, floating, {
          placement: "left",
        })

        expect(result.x).toBe(150)
        // Center: reference.top + reference.height/2 - floating.height/2
        // = 100 + 20 - 40 = 80
        expect(result.y).toBe(80)
        expect(result.placement).toBe("left")
      })

      it("positions left of reference, aligned end", () => {
        const reference = createMockElement({
          left: 300,
          top: 100,
          width: 100,
          height: 40,
        })
        const floating = createMockElement({ width: 150, height: 80 })

        const result = computePosition(reference, floating, {
          placement: "left-end",
        })

        expect(result.x).toBe(150)
        // reference.bottom - floating.height = 140 - 80 = 60
        expect(result.y).toBe(60)
        expect(result.placement).toBe("left-end")
      })
    })

    describe("right placement", () => {
      it("positions right of reference, aligned start", () => {
        const reference = createMockElement({
          left: 100,
          top: 100,
          width: 100,
          height: 40,
        })
        const floating = createMockElement({ width: 150, height: 80 })

        const result = computePosition(reference, floating, {
          placement: "right-start",
        })

        expect(result.x).toBe(200) // reference.right
        expect(result.y).toBe(100)
        expect(result.placement).toBe("right-start")
      })

      it("positions right of reference, aligned center", () => {
        const reference = createMockElement({
          left: 100,
          top: 100,
          width: 100,
          height: 40,
        })
        const floating = createMockElement({ width: 150, height: 80 })

        const result = computePosition(reference, floating, {
          placement: "right",
        })

        expect(result.x).toBe(200)
        expect(result.y).toBe(80)
        expect(result.placement).toBe("right")
      })

      it("positions right of reference, aligned end", () => {
        const reference = createMockElement({
          left: 100,
          top: 100,
          width: 100,
          height: 40,
        })
        const floating = createMockElement({ width: 150, height: 80 })

        const result = computePosition(reference, floating, {
          placement: "right-end",
        })

        expect(result.x).toBe(200)
        expect(result.y).toBe(60)
        expect(result.placement).toBe("right-end")
      })
    })
  })

  describe("offset", () => {
    it("adds gap below for bottom placement", () => {
      const reference = createMockElement({
        left: 100,
        top: 50,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 100, height: 100 })

      const withoutOffset = computePosition(reference, floating, {
        placement: "bottom-start",
        offset: 0,
      })
      const withOffset = computePosition(reference, floating, {
        placement: "bottom-start",
        offset: 8,
      })

      expect(withOffset.y).toBe(withoutOffset.y + 8)
    })

    it("adds gap above for top placement", () => {
      const reference = createMockElement({
        left: 100,
        top: 200,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 100, height: 80 })

      const withoutOffset = computePosition(reference, floating, {
        placement: "top-start",
        offset: 0,
      })
      const withOffset = computePosition(reference, floating, {
        placement: "top-start",
        offset: 8,
      })

      expect(withOffset.y).toBe(withoutOffset.y - 8)
    })

    it("adds gap left for left placement", () => {
      const reference = createMockElement({
        left: 300,
        top: 100,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 150, height: 80 })

      const withoutOffset = computePosition(reference, floating, {
        placement: "left-start",
        offset: 0,
      })
      const withOffset = computePosition(reference, floating, {
        placement: "left-start",
        offset: 8,
      })

      expect(withOffset.x).toBe(withoutOffset.x - 8)
    })

    it("adds gap right for right placement", () => {
      const reference = createMockElement({
        left: 100,
        top: 100,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 150, height: 80 })

      const withoutOffset = computePosition(reference, floating, {
        placement: "right-start",
        offset: 0,
      })
      const withOffset = computePosition(reference, floating, {
        placement: "right-start",
        offset: 8,
      })

      expect(withOffset.x).toBe(withoutOffset.x + 8)
    })

    it("defaults to 0 offset", () => {
      const reference = createMockElement({
        left: 100,
        top: 50,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 100, height: 100 })

      const result = computePosition(reference, floating, {
        placement: "bottom-start",
      })

      expect(result.y).toBe(90) // Exactly at reference bottom, no gap
    })
  })

  describe("flip", () => {
    it("flips from bottom to top when overflowing bottom of viewport", () => {
      setViewport(1024, 200) // Small viewport height
      const reference = createMockElement({
        left: 100,
        top: 150,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 100, height: 100 })

      const result = computePosition(reference, floating, {
        placement: "bottom-start",
        flip: true,
      })

      // Should flip to top since bottom would overflow
      expect(result.placement).toBe("top-start")
      expect(result.y).toBe(150 - 100) // Above reference
    })

    it("flips from top to bottom when overflowing top of viewport", () => {
      const reference = createMockElement({
        left: 100,
        top: 30,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 100, height: 100 })

      const result = computePosition(reference, floating, {
        placement: "top-start",
        flip: true,
      })

      // Should flip to bottom since top would be negative
      expect(result.placement).toBe("bottom-start")
      expect(result.y).toBe(70) // Below reference
    })

    it("flips from left to right when overflowing left of viewport", () => {
      const reference = createMockElement({
        left: 50,
        top: 100,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 150, height: 80 })

      const result = computePosition(reference, floating, {
        placement: "left-start",
        flip: true,
      })

      // Should flip to right since left would be negative
      expect(result.placement).toBe("right-start")
      expect(result.x).toBe(150) // Right of reference
    })

    it("flips from right to left when overflowing right of viewport", () => {
      setViewport(300, 768)
      const reference = createMockElement({
        left: 150,
        top: 100,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 150, height: 80 })

      const result = computePosition(reference, floating, {
        placement: "right-start",
        flip: true,
      })

      // Should flip to left since right would overflow
      expect(result.placement).toBe("left-start")
      expect(result.x).toBe(0) // Left of reference
    })

    it("does not flip when disabled", () => {
      setViewport(1024, 200)
      const reference = createMockElement({
        left: 100,
        top: 150,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 100, height: 100 })

      const result = computePosition(reference, floating, {
        placement: "bottom-start",
        flip: false,
      })

      expect(result.placement).toBe("bottom-start") // Stays at bottom even if overflow
    })

    it("does not flip when there is no overflow", () => {
      const reference = createMockElement({
        left: 100,
        top: 100,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 100, height: 100 })

      const result = computePosition(reference, floating, {
        placement: "bottom-start",
        flip: true,
      })

      expect(result.placement).toBe("bottom-start") // No flip needed
    })

    it("chooses better side when both overflow", () => {
      // Tiny viewport where both top and bottom overflow
      setViewport(1024, 150)
      // Reference in middle, floating is 100px tall, viewport is 150px
      const reference = createMockElement({
        left: 100,
        top: 60,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 100, height: 100 })

      // Bottom: y = 100, bottom edge = 200, viewport = 150, overflow = 50
      // Top: y = -40 (60 - 100), overflow from top = 40

      const result = computePosition(reference, floating, {
        placement: "bottom-start",
        flip: true,
      })

      // Top has less overflow (40) than bottom (50), so should flip
      expect(result.placement).toBe("top-start")
    })

    it("preserves alignment when flipping side (if cross-axis doesn't overflow)", () => {
      setViewport(1024, 200)
      // Use a smaller floating element and centered reference so cross-axis doesn't overflow
      const reference = createMockElement({
        left: 400,
        top: 150,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 150, height: 100 })

      const resultStart = computePosition(reference, floating, {
        placement: "bottom-start",
        shift: false,
      })
      const resultEnd = computePosition(reference, floating, {
        placement: "bottom-end",
        shift: false,
      })
      const resultCenter = computePosition(reference, floating, {
        placement: "bottom",
        shift: false,
      })

      expect(resultStart.placement).toBe("top-start")
      expect(resultEnd.placement).toBe("top-end")
      expect(resultCenter.placement).toBe("top")
    })
  })

  describe("shift", () => {
    it("shifts right when overflowing left of viewport", () => {
      const reference = createMockElement({
        left: 50,
        top: 100,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 200, height: 100 })

      // bottom-start would place floating at x=50, but it's 200px wide
      // Since reference is at x=50, floating left edge is at 50
      // That's fine, but let's test with center alignment

      const result = computePosition(reference, floating, {
        placement: "bottom", // center alignment
        shift: true,
        padding: 8,
      })

      // Center would be: 50 + 50 - 100 = 0, so floating starts at x=0
      // With padding=8, we need x >= 8, so should shift to 8
      expect(result.x).toBeGreaterThanOrEqual(8)
    })

    it("shifts left when overflowing right of viewport", () => {
      setViewport(400, 768)
      const reference = createMockElement({
        left: 300,
        top: 100,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 200, height: 100 })

      const result = computePosition(reference, floating, {
        placement: "bottom-start",
        shift: true,
        padding: 8,
      })

      // bottom-start at left=300 would put right edge at 500, viewport is 400
      // Should shift left to fit: 400 - 8 - 200 = 192
      expect(result.x).toBeLessThanOrEqual(400 - 8 - 200)
    })

    it("shifts down when overflowing top for left/right placement", () => {
      const reference = createMockElement({
        left: 200,
        top: 20,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 100, height: 100 })

      const result = computePosition(reference, floating, {
        placement: "right", // center alignment
        shift: true,
        padding: 8,
      })

      // Center would be: 20 + 20 - 50 = -10, which overflows top
      // Should shift down to at least padding (8)
      expect(result.y).toBeGreaterThanOrEqual(8)
    })

    it("shifts up when overflowing bottom for left/right placement", () => {
      setViewport(1024, 200)
      const reference = createMockElement({
        left: 200,
        top: 150,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 100, height: 100 })

      const result = computePosition(reference, floating, {
        placement: "right-start",
        shift: true,
        padding: 8,
      })

      // right-start at top=150 would put bottom at 250, viewport is 200
      // Should shift up
      expect(result.y + 100).toBeLessThanOrEqual(200 - 8)
    })

    it("does not shift when disabled", () => {
      const reference = createMockElement({
        left: 50,
        top: 100,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 200, height: 100 })

      const result = computePosition(reference, floating, {
        placement: "bottom",
        shift: false,
        padding: 8,
      })

      // Center: 50 + 50 - 100 = 0, should stay at 0 even though it violates padding
      expect(result.x).toBe(0)
    })

    it("respects padding option", () => {
      const reference = createMockElement({
        left: 20,
        top: 100,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 100, height: 100 })

      const result8 = computePosition(reference, floating, {
        placement: "bottom-start",
        shift: true,
        padding: 8,
      })

      const result20 = computePosition(reference, floating, {
        placement: "bottom-start",
        shift: true,
        padding: 20,
      })

      // x=20 is fine with padding 8 (20 >= 8)
      // x=20 violates padding 20, should shift to 20
      expect(result8.x).toBe(20) // No shift needed
      expect(result20.x).toBe(20) // Shifted to meet padding
    })
  })

  describe("combined flip and shift", () => {
    it("flips side and alignment, then shifts if still needed", () => {
      setViewport(400, 200)
      // Reference near bottom-right corner
      const reference = createMockElement({
        left: 300,
        top: 150,
        width: 80,
        height: 40,
      })
      const floating = createMockElement({ width: 150, height: 100 })

      const result = computePosition(reference, floating, {
        placement: "bottom-start",
        flip: true,
        shift: true,
        padding: 8,
      })

      // Should flip side to top (bottom overflows), and flip alignment to end (right overflows)
      // Since alignment flips, shift may not be needed
      expect(result.placement).toBe("top-end")
      expect(result.x).toBeLessThanOrEqual(400 - 8)
    })
  })

  describe("cross-axis flip (alignment flip)", () => {
    it("flips alignment from start to end when overflowing right (vertical side)", () => {
      setViewport(300, 768)
      // Reference near right edge - floating would overflow right with start alignment
      const reference = createMockElement({
        left: 250,
        top: 100,
        width: 40,
        height: 40,
      })
      const floating = createMockElement({ width: 150, height: 100 })

      const result = computePosition(reference, floating, {
        placement: "bottom-start",
        flip: true,
        shift: false, // Disable shift to test flip only
        padding: 8,
      })

      // bottom-start at x=250 would overflow right (250+150=400 > 300-8=292)
      // Should flip to bottom-end: x = reference.right - floating.width = 290 - 150 = 140
      expect(result.placement).toBe("bottom-end")
      expect(result.x).toBe(140)
    })

    it("flips alignment from end to start when overflowing left (vertical side)", () => {
      setViewport(400, 768)
      // Reference near left edge - floating would overflow left with end alignment
      const reference = createMockElement({
        left: 50,
        top: 100,
        width: 40,
        height: 40,
      })
      const floating = createMockElement({ width: 150, height: 100 })

      const result = computePosition(reference, floating, {
        placement: "bottom-end",
        flip: true,
        shift: false,
        padding: 8,
      })

      // bottom-end: x = reference.right - floating.width = 90 - 150 = -60 (overflows left)
      // Should flip to bottom-start: x = reference.left = 50
      expect(result.placement).toBe("bottom-start")
      expect(result.x).toBe(50)
    })

    it("flips alignment from start to end when overflowing bottom (horizontal side)", () => {
      setViewport(1024, 200)
      // Reference near bottom - floating would overflow bottom with start alignment
      const reference = createMockElement({
        left: 100,
        top: 150,
        width: 40,
        height: 40,
      })
      const floating = createMockElement({ width: 100, height: 100 })

      const result = computePosition(reference, floating, {
        placement: "right-start",
        flip: true,
        shift: false,
        padding: 8,
      })

      // right-start: y = reference.top = 150, bottom edge = 250 > 200-8=192 (overflows)
      // Should flip to right-end: y = reference.bottom - floating.height = 190 - 100 = 90
      expect(result.placement).toBe("right-end")
      expect(result.y).toBe(90)
    })

    it("flips alignment from end to start when overflowing top (horizontal side)", () => {
      setViewport(1024, 768)
      // Reference near top - floating would overflow top with end alignment
      const reference = createMockElement({
        left: 200,
        top: 50,
        width: 40,
        height: 40,
      })
      const floating = createMockElement({ width: 100, height: 100 })

      const result = computePosition(reference, floating, {
        placement: "right-end",
        flip: true,
        shift: false,
        padding: 8,
      })

      // right-end: y = reference.bottom - floating.height = 90 - 100 = -10 (overflows top)
      // Should flip to right-start: y = reference.top = 50
      expect(result.placement).toBe("right-start")
      expect(result.y).toBe(50)
    })

    it("preserves offset when flipping alignment", () => {
      setViewport(300, 768)
      const reference = createMockElement({
        left: 250,
        top: 100,
        width: 40,
        height: 40,
      })
      const floating = createMockElement({ width: 150, height: 100 })

      const result = computePosition(reference, floating, {
        placement: "bottom-start",
        flip: true,
        shift: false,
        offset: 10,
        padding: 8,
      })

      // Should flip alignment but preserve the 10px offset on main axis (y)
      expect(result.placement).toBe("bottom-end")
      expect(result.y).toBe(140 + 10) // reference.bottom + offset
    })

    it("does not flip center alignment", () => {
      setViewport(300, 768)
      const reference = createMockElement({
        left: 200,
        top: 100,
        width: 40,
        height: 40,
      })
      const floating = createMockElement({ width: 150, height: 100 })

      const result = computePosition(reference, floating, {
        placement: "bottom", // center alignment
        flip: true,
        shift: false,
        padding: 8,
      })

      // Center alignment should not flip (no opposite alignment concept)
      expect(result.placement).toBe("bottom")
    })

    it("flips both side and alignment when both overflow", () => {
      setViewport(300, 200)
      // Reference at bottom-right corner - both axes overflow
      const reference = createMockElement({
        left: 250,
        top: 150,
        width: 40,
        height: 40,
      })
      const floating = createMockElement({ width: 150, height: 100 })

      const result = computePosition(reference, floating, {
        placement: "bottom-start",
        flip: true,
        shift: false,
        padding: 8,
      })

      // Should flip side to top (bottom overflows) and alignment to end (right overflows)
      expect(result.placement).toBe("top-end")
    })

    it("keeps original alignment if flipped alignment also overflows", () => {
      // Edge case: both start and end alignments overflow, keep the one with less overflow
      setViewport(200, 768)
      // Floating is wider than viewport, both alignments overflow
      const reference = createMockElement({
        left: 80,
        top: 100,
        width: 40,
        height: 40,
      })
      const floating = createMockElement({ width: 250, height: 100 })

      const result = computePosition(reference, floating, {
        placement: "bottom-start",
        flip: true,
        shift: false,
        padding: 8,
      })

      // start: x=80, right edge=330, overflow = 330-200+8 = 138
      // end: x = 120-250 = -130, left edge = -130, overflow = 8-(-130) = 138
      // Both have same overflow, should keep original (start)
      // Actually end has less because we check left overflow for end alignment
      expect(result.placement).toBe("bottom-start")
    })
  })

  describe("edge cases", () => {
    it("handles zero-size reference", () => {
      const reference = createMockElement({
        left: 100,
        top: 100,
        width: 0,
        height: 0,
      })
      const floating = createMockElement({ width: 100, height: 50 })

      const result = computePosition(reference, floating, {
        placement: "bottom-start",
      })

      expect(result.x).toBe(100)
      expect(result.y).toBe(100)
    })

    it("handles very large floating element", () => {
      setViewport(1024, 768)
      const reference = createMockElement({
        left: 500,
        top: 400,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 2000, height: 1000 })

      const result = computePosition(reference, floating, {
        placement: "bottom-start",
        shift: true,
        padding: 8,
      })

      // Should shift as much as possible but can't fully contain
      expect(result.x).toBeLessThanOrEqual(500) // Shifted left
    })

    it("handles reference at viewport edge", () => {
      const reference = createMockElement({
        left: 0,
        top: 0,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 100, height: 50 })

      const result = computePosition(reference, floating, {
        placement: "bottom-start",
        shift: true,
        padding: 8,
      })

      expect(result.x).toBeGreaterThanOrEqual(8)
    })

    it("handles floating element at exact viewport size", () => {
      setViewport(200, 100)
      const reference = createMockElement({
        left: 50,
        top: 10,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 200, height: 100 })

      const result = computePosition(reference, floating, {
        placement: "bottom-start",
        shift: true,
        padding: 0,
      })

      // Floating is exact viewport size, should position at 0,0 or reference position
      expect(result.x).toBeGreaterThanOrEqual(0)
    })

    it("handles negative reference position (scrolled out of view)", () => {
      const reference = createMockElement({
        left: -50,
        top: -50,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 100, height: 50 })

      const result = computePosition(reference, floating, {
        placement: "bottom-start",
        shift: true,
        padding: 8,
      })

      // X should shift to be visible (shift works on cross-axis for bottom placement)
      expect(result.x).toBeGreaterThanOrEqual(8)
      // Y is on main axis, shift only works on cross-axis, so y stays at -10 (reference.bottom)
      // This is expected behavior - shift doesn't affect main axis for top/bottom placements
      expect(result.y).toBe(-10)
    })
  })

  describe("default options", () => {
    it("uses bottom-start as default placement", () => {
      const reference = createMockElement({
        left: 100,
        top: 50,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 150, height: 100 })

      const result = computePosition(reference, floating)

      expect(result.x).toBe(100) // start alignment
      expect(result.y).toBe(90) // bottom of reference
    })

    it("enables flip by default", () => {
      setViewport(1024, 150)
      const reference = createMockElement({
        left: 100,
        top: 100,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 100, height: 100 })

      const result = computePosition(reference, floating)

      // Should flip to top since bottom overflows
      expect(result.placement).toContain("top")
    })

    it("enables shift by default", () => {
      setViewport(300, 768)
      // Use a scenario where alignment flip doesn't help, so shift is needed
      // Reference centered, floating would overflow both sides equally
      const reference = createMockElement({
        left: 100,
        top: 50,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 250, height: 100 })

      const result = computePosition(reference, floating, { flip: false }) // Disable flip to test shift

      // Should shift to fit within viewport
      expect(result.x).toBeGreaterThanOrEqual(8) // Left edge respects padding
      expect(result.x + 250).toBeLessThanOrEqual(300 - 8) // Right edge respects padding
    })

    it("uses 8 as default padding", () => {
      const reference = createMockElement({
        left: 0,
        top: 50,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 100, height: 100 })

      const result = computePosition(reference, floating)

      // At left=0, with default padding=8, should shift to 8
      expect(result.x).toBeGreaterThanOrEqual(8)
    })

    it("uses 0 as default offset", () => {
      const reference = createMockElement({
        left: 100,
        top: 50,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 100, height: 100 })

      const result = computePosition(reference, floating, {
        shift: false,
        flip: false,
      })

      expect(result.y).toBe(90) // Exactly at reference bottom, no gap
    })
  })

  describe("all placement values", () => {
    const placements: Placement[] = [
      "top",
      "top-start",
      "top-end",
      "bottom",
      "bottom-start",
      "bottom-end",
      "left",
      "left-start",
      "left-end",
      "right",
      "right-start",
      "right-end",
    ]

    it.each(placements)("handles %s placement", (placement) => {
      const reference = createMockElement({
        left: 400,
        top: 300,
        width: 100,
        height: 40,
      })
      const floating = createMockElement({ width: 100, height: 80 })

      const result = computePosition(reference, floating, {
        placement,
        flip: false,
        shift: false,
      })

      expect(result.placement).toBe(placement)
      expect(typeof result.x).toBe("number")
      expect(typeof result.y).toBe("number")
      expect(Number.isFinite(result.x)).toBe(true)
      expect(Number.isFinite(result.y)).toBe(true)
    })
  })
})
