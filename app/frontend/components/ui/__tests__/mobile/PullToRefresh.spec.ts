/**
 * PullToRefresh component tests
 */

import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"

import PullToRefresh from "../../mobile/PullToRefresh.svelte"
import { textSnippet } from "../test-utils"

// Helper to create touch events
function createTouchEvent(type: string, clientY: number) {
  return {
    touches: [{ clientY }],
    preventDefault: vi.fn(),
  }
}

describe("PullToRefresh", () => {
  const defaultChildren = textSnippet("Scrollable content")
  const defaultOnrefresh = vi.fn()

  describe("rendering", () => {
    it("renders container", () => {
      const { container } = render(PullToRefresh, {
        props: { onrefresh: defaultOnrefresh, children: defaultChildren },
      })
      expect(container.querySelector(".relative")).toBeInTheDocument()
    })

    it("renders children content", () => {
      render(PullToRefresh, {
        props: { onrefresh: defaultOnrefresh, children: defaultChildren },
      })
      expect(screen.getByText("Scrollable content")).toBeInTheDocument()
    })

    it("renders scrollable container", () => {
      const { container } = render(PullToRefresh, {
        props: { onrefresh: defaultOnrefresh, children: defaultChildren },
      })
      expect(container.querySelector(".overflow-y-auto")).toBeInTheDocument()
    })
  })

  describe("pull indicator", () => {
    it("indicator starts hidden (opacity 0)", () => {
      const { container } = render(PullToRefresh, {
        props: { onrefresh: defaultOnrefresh, children: defaultChildren },
      })
      const indicator = container.querySelector(".absolute.inset-x-0")
      expect(indicator).toHaveStyle({ opacity: "0" })
    })

    it("indicator has height 0 initially", () => {
      const { container } = render(PullToRefresh, {
        props: { onrefresh: defaultOnrefresh, children: defaultChildren },
      })
      const indicator = container.querySelector(".absolute.inset-x-0")
      expect(indicator).toHaveStyle({ height: "0px" })
    })
  })

  describe("touch gesture", () => {
    it("starts tracking on touchstart", async () => {
      const { container } = render(PullToRefresh, {
        props: { onrefresh: defaultOnrefresh, children: defaultChildren },
      })
      const scrollEl = container.querySelector(".overflow-y-auto")!

      await fireEvent.touchStart(scrollEl, createTouchEvent("touchstart", 100))
      // Component should be ready to track pull
    })

    it("updates pull distance on touchmove", async () => {
      const { container } = render(PullToRefresh, {
        props: { onrefresh: defaultOnrefresh, children: defaultChildren },
      })
      const scrollEl = container.querySelector(
        ".overflow-y-auto",
      ) as HTMLElement

      // Mock scrollTop to 0 (at top of scroll)
      Object.defineProperty(scrollEl, "scrollTop", {
        value: 0,
        configurable: true,
      })

      await fireEvent.touchStart(scrollEl, createTouchEvent("touchstart", 100))
      await fireEvent.touchMove(scrollEl, createTouchEvent("touchmove", 200))

      // Transform should be applied (pullDistance * resistance factor)
      expect(scrollEl.style.transform).toMatch(/translateY\(\d+px\)/)
    })
  })

  describe("refresh trigger", () => {
    it("calls onrefresh when threshold reached and released", async () => {
      const onrefresh = vi.fn()
      const { container } = render(PullToRefresh, {
        props: { onrefresh, children: defaultChildren },
      })
      const scrollEl = container.querySelector(
        ".overflow-y-auto",
      ) as HTMLElement

      // Mock scrollTop to 0
      Object.defineProperty(scrollEl, "scrollTop", {
        value: 0,
        configurable: true,
      })

      await fireEvent.touchStart(scrollEl, createTouchEvent("touchstart", 0))
      // Pull down past threshold (default 70px, with 0.5 resistance = need 140px)
      await fireEvent.touchMove(scrollEl, createTouchEvent("touchmove", 200))
      await fireEvent.touchEnd(scrollEl)

      expect(onrefresh).toHaveBeenCalled()
    })

    it("does not call onrefresh when threshold not reached", async () => {
      const onrefresh = vi.fn()
      const { container } = render(PullToRefresh, {
        props: { onrefresh, children: defaultChildren },
      })
      const scrollEl = container.querySelector(
        ".overflow-y-auto",
      ) as HTMLElement

      // Mock scrollTop to 0
      Object.defineProperty(scrollEl, "scrollTop", {
        value: 0,
        configurable: true,
      })

      await fireEvent.touchStart(scrollEl, createTouchEvent("touchstart", 100))
      // Small pull that doesn't reach threshold
      await fireEvent.touchMove(scrollEl, createTouchEvent("touchmove", 120))
      await fireEvent.touchEnd(scrollEl)

      expect(onrefresh).not.toHaveBeenCalled()
    })

    it("handles async onrefresh", async () => {
      const onrefresh = vi.fn().mockResolvedValue(undefined)
      const { container } = render(PullToRefresh, {
        props: { onrefresh, children: defaultChildren },
      })
      const scrollEl = container.querySelector(
        ".overflow-y-auto",
      ) as HTMLElement

      // Mock scrollTop to 0
      Object.defineProperty(scrollEl, "scrollTop", {
        value: 0,
        configurable: true,
      })

      await fireEvent.touchStart(scrollEl, createTouchEvent("touchstart", 0))
      await fireEvent.touchMove(scrollEl, createTouchEvent("touchmove", 200))
      await fireEvent.touchEnd(scrollEl)

      expect(onrefresh).toHaveBeenCalled()
    })
  })

  describe("threshold prop", () => {
    it("respects custom threshold", async () => {
      const onrefresh = vi.fn()
      const { container } = render(PullToRefresh, {
        props: { onrefresh, threshold: 100, children: defaultChildren },
      })
      const scrollEl = container.querySelector(
        ".overflow-y-auto",
      ) as HTMLElement

      // Mock scrollTop to 0
      Object.defineProperty(scrollEl, "scrollTop", {
        value: 0,
        configurable: true,
      })

      await fireEvent.touchStart(scrollEl, createTouchEvent("touchstart", 0))
      // Pull to 100px (with 0.5 resistance, actual distance = 50px, below 100px threshold)
      await fireEvent.touchMove(scrollEl, createTouchEvent("touchmove", 100))
      await fireEvent.touchEnd(scrollEl)

      // Should not trigger with small pull
      expect(onrefresh).not.toHaveBeenCalled()
    })
  })

  describe("scroll position check", () => {
    it("does not pull when not at scroll top", async () => {
      const onrefresh = vi.fn()
      const { container } = render(PullToRefresh, {
        props: { onrefresh, children: defaultChildren },
      })
      const scrollEl = container.querySelector(
        ".overflow-y-auto",
      ) as HTMLElement

      // Mock scrollTop to non-zero (not at top)
      Object.defineProperty(scrollEl, "scrollTop", {
        value: 100,
        configurable: true,
      })

      await fireEvent.touchStart(scrollEl, createTouchEvent("touchstart", 0))
      await fireEvent.touchMove(scrollEl, createTouchEvent("touchmove", 200))
      await fireEvent.touchEnd(scrollEl)

      expect(onrefresh).not.toHaveBeenCalled()
    })
  })

  describe("custom styling", () => {
    it("applies custom class to container", () => {
      const { container } = render(PullToRefresh, {
        props: {
          onrefresh: defaultOnrefresh,
          class: "custom-ptr",
          children: defaultChildren,
        },
      })
      expect(container.querySelector(".custom-ptr")).toBeInTheDocument()
    })
  })

  describe("layout", () => {
    it("container takes full height", () => {
      const { container } = render(PullToRefresh, {
        props: { onrefresh: defaultOnrefresh, children: defaultChildren },
      })
      expect(container.querySelector(".h-full")).toBeInTheDocument()
    })

    it("has overflow-hidden on outer container", () => {
      const { container } = render(PullToRefresh, {
        props: { onrefresh: defaultOnrefresh, children: defaultChildren },
      })
      expect(container.querySelector(".overflow-hidden")).toBeInTheDocument()
    })

    it("has touch-action pan-y for proper gesture handling", () => {
      const { container } = render(PullToRefresh, {
        props: { onrefresh: defaultOnrefresh, children: defaultChildren },
      })
      const outerContainer = container.querySelector(".relative")
      // Check inline style attribute
      expect(outerContainer?.getAttribute("style")).toContain("touch-action")
    })
  })

  describe("pull resistance", () => {
    it("applies resistance to pull distance", async () => {
      const { container } = render(PullToRefresh, {
        props: { onrefresh: defaultOnrefresh, children: defaultChildren },
      })
      const scrollEl = container.querySelector(
        ".overflow-y-auto",
      ) as HTMLElement

      // Mock scrollTop to 0
      Object.defineProperty(scrollEl, "scrollTop", {
        value: 0,
        configurable: true,
      })

      await fireEvent.touchStart(scrollEl, createTouchEvent("touchstart", 0))
      await fireEvent.touchMove(scrollEl, createTouchEvent("touchmove", 100))

      // With 0.5 resistance, 100px pull should result in 50px translateY
      expect(scrollEl.style.transform).toBe("translateY(50px)")
    })
  })

  describe("upward scroll", () => {
    it("resets pull distance when scrolling up", async () => {
      const { container } = render(PullToRefresh, {
        props: { onrefresh: defaultOnrefresh, children: defaultChildren },
      })
      const scrollEl = container.querySelector(
        ".overflow-y-auto",
      ) as HTMLElement

      // Mock scrollTop to 0
      Object.defineProperty(scrollEl, "scrollTop", {
        value: 0,
        configurable: true,
      })

      await fireEvent.touchStart(scrollEl, createTouchEvent("touchstart", 100))
      // Scroll up (negative diff)
      await fireEvent.touchMove(scrollEl, createTouchEvent("touchmove", 50))

      // Should not have any transform
      expect(scrollEl.style.transform).toBe("translateY(0px)")
    })
  })
})
