/**
 * BottomSheet component tests
 */

import { fireEvent, render, screen } from "@testing-library/svelte"
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

import BottomSheet from "../../mobile/BottomSheet.svelte"
import { pointerDown, pointerMove, pointerUp, textSnippet } from "../test-utils"

// Mock window dimensions and pointer capture methods
beforeAll(() => {
  Object.defineProperty(window, "innerHeight", {
    value: 800,
    configurable: true,
  })
  // Mock pointer capture methods since jsdom doesn't support them
  Element.prototype.setPointerCapture = vi.fn()
  Element.prototype.releasePointerCapture = vi.fn()
  // Mock element.animate for Svelte transitions (jsdom doesn't support Web Animations API)
  Element.prototype.animate = vi.fn(
    () =>
      ({
        finished: Promise.resolve(),
        cancel: vi.fn(),
        play: vi.fn(),
        pause: vi.fn(),
        reverse: vi.fn(),
      }) as unknown as Animation,
  )
})

// Use fake timers to test animated close (which uses setTimeout)
beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe("BottomSheet", () => {
  const defaultChildren = textSnippet("Sheet content")

  describe("rendering", () => {
    it("does not render when closed", () => {
      const { container } = render(BottomSheet, {
        props: { open: false, children: defaultChildren },
      })
      expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument()
    })

    it("renders when open", () => {
      const { container } = render(BottomSheet, {
        props: { open: true, children: defaultChildren },
      })
      expect(container.querySelector('[role="dialog"]')).toBeInTheDocument()
    })

    it("renders backdrop when open", () => {
      const { container } = render(BottomSheet, {
        props: { open: true, children: defaultChildren },
      })
      expect(
        container.querySelector('[aria-label="Close sheet"]'),
      ).toBeInTheDocument()
    })

    it("renders children content", () => {
      render(BottomSheet, { props: { open: true, children: defaultChildren } })
      expect(screen.getByText("Sheet content")).toBeInTheDocument()
    })
  })

  describe("accessibility", () => {
    it("has dialog role", () => {
      const { container } = render(BottomSheet, {
        props: { open: true, children: defaultChildren },
      })
      expect(container.querySelector('[role="dialog"]')).toBeInTheDocument()
    })

    it("has aria-modal=true", () => {
      const { container } = render(BottomSheet, {
        props: { open: true, children: defaultChildren },
      })
      expect(container.querySelector('[role="dialog"]')).toHaveAttribute(
        "aria-modal",
        "true",
      )
    })

    it("has aria-labelledby when title provided", () => {
      const { container } = render(BottomSheet, {
        props: { open: true, title: "Options", children: defaultChildren },
      })
      expect(container.querySelector('[role="dialog"]')).toHaveAttribute(
        "aria-labelledby",
        "bottom-sheet-title",
      )
    })

    it("has aria-describedby when description provided", () => {
      const { container } = render(BottomSheet, {
        props: {
          open: true,
          description: "Choose an option",
          children: defaultChildren,
        },
      })
      expect(container.querySelector('[role="dialog"]')).toHaveAttribute(
        "aria-describedby",
        "bottom-sheet-description",
      )
    })

    it("does not have aria-labelledby when no title", () => {
      const { container } = render(BottomSheet, {
        props: { open: true, children: defaultChildren },
      })
      expect(container.querySelector('[role="dialog"]')).not.toHaveAttribute(
        "aria-labelledby",
      )
    })
  })

  describe("header", () => {
    it("renders title when provided", () => {
      render(BottomSheet, {
        props: { open: true, title: "Options", children: defaultChildren },
      })
      expect(screen.getByText("Options")).toBeInTheDocument()
    })

    it("renders description when provided", () => {
      render(BottomSheet, {
        props: {
          open: true,
          title: "Options",
          description: "Choose an option",
          children: defaultChildren,
        },
      })
      expect(screen.getByText("Choose an option")).toBeInTheDocument()
    })

    it("title has correct id", () => {
      render(BottomSheet, {
        props: { open: true, title: "Options", children: defaultChildren },
      })
      expect(screen.getByText("Options")).toHaveAttribute(
        "id",
        "bottom-sheet-title",
      )
    })

    it("description has correct id", () => {
      render(BottomSheet, {
        props: {
          open: true,
          description: "Choose an option",
          children: defaultChildren,
        },
      })
      expect(screen.getByText("Choose an option")).toHaveAttribute(
        "id",
        "bottom-sheet-description",
      )
    })
  })

  describe("close button", () => {
    it("does not show close button by default", () => {
      render(BottomSheet, { props: { open: true, children: defaultChildren } })
      expect(
        screen.queryByRole("button", { name: "Close" }),
      ).not.toBeInTheDocument()
    })

    it("shows close button when showCloseButton=true", () => {
      render(BottomSheet, {
        props: { open: true, showCloseButton: true, children: defaultChildren },
      })
      expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()
    })

    it("calls onclose when close button clicked", async () => {
      const onclose = vi.fn()
      render(BottomSheet, {
        props: {
          open: true,
          showCloseButton: true,
          onclose,
          children: defaultChildren,
        },
      })
      await fireEvent.click(screen.getByRole("button", { name: "Close" }))
      // Advance timers to complete the close animation (300ms)
      await vi.advanceTimersByTimeAsync(350)
      expect(onclose).toHaveBeenCalled()
    })
  })

  describe("backdrop click", () => {
    it("closes on backdrop click by default", async () => {
      const onclose = vi.fn()
      const { container } = render(BottomSheet, {
        props: { open: true, onclose, children: defaultChildren },
      })
      await fireEvent.click(
        container.querySelector('[aria-label="Close sheet"]')!,
      )
      // Advance timers to complete the close animation (300ms)
      await vi.advanceTimersByTimeAsync(350)
      expect(onclose).toHaveBeenCalled()
    })

    it("does not close on backdrop click when closeOnBackdropClick=false", async () => {
      const onclose = vi.fn()
      const { container } = render(BottomSheet, {
        props: {
          open: true,
          closeOnBackdropClick: false,
          onclose,
          children: defaultChildren,
        },
      })
      await fireEvent.click(
        container.querySelector('[aria-label="Close sheet"]')!,
      )
      expect(onclose).not.toHaveBeenCalled()
    })
  })

  describe("keyboard", () => {
    it("closes on Escape key", async () => {
      const onclose = vi.fn()
      const { container } = render(BottomSheet, {
        props: { open: true, onclose, children: defaultChildren },
      })
      await fireEvent.keyDown(
        container.querySelector('[aria-label="Close sheet"]')!,
        { key: "Escape" },
      )
      // Advance timers to complete the close animation (300ms)
      await vi.advanceTimersByTimeAsync(350)
      expect(onclose).toHaveBeenCalled()
    })
  })

  describe("drag handle", () => {
    it("renders drag handle indicator", () => {
      const { container } = render(BottomSheet, {
        props: { open: true, children: defaultChildren },
      })
      // Drag handle has cursor-grab class
      expect(container.querySelector(".cursor-grab")).toBeInTheDocument()
    })

    it("has touch-none for proper gesture handling", () => {
      const { container } = render(BottomSheet, {
        props: { open: true, children: defaultChildren },
      })
      expect(container.querySelector(".touch-none")).toBeInTheDocument()
    })
  })

  describe("drag to dismiss", () => {
    it("starts drag on pointer down", async () => {
      const { container } = render(BottomSheet, {
        props: { open: true, children: defaultChildren },
      })
      const handle = container.querySelector(".cursor-grab")!
      await pointerDown(handle as HTMLElement, 100, 100)
      // Component should be in dragging state (no transition)
      const sheet = container.querySelector('[role="dialog"]')
      expect(sheet).toHaveStyle({ transition: "none" })
    })

    it.skip("closes on fast swipe down (requires pointer capture)", async () => {
      /**
       * This test requires full pointer capture support which jsdom doesn't provide.
       * The component calculates velocity as: velocityY = (e.clientY - lastY) / dt
       * Close threshold: velocityY > 0.5 px/ms (e.g., 50px in 100ms)
       *
       * To properly test this, you would need:
       * 1. vi.useFakeTimers() to control timing
       * 2. Real pointer capture support (use Playwright E2E)
       *
       * The drag-to-dismiss functionality should be tested via E2E with Playwright.
       */
      const onclose = vi.fn()
      const { container } = render(BottomSheet, {
        props: { open: true, onclose, children: defaultChildren },
      })
      const handle = container.querySelector(".cursor-grab") as HTMLElement

      // Simulate fast swipe (200px in ~100ms = 2 px/ms velocity)
      await pointerDown(handle, 100, 100)
      await pointerMove(handle, 100, 300)
      await pointerUp(handle, 100, 300)

      // Should trigger close due to velocity/distance
      expect(onclose).toHaveBeenCalled()
    })
  })

  describe("snap points", () => {
    it("uses default snap points", () => {
      const { container } = render(BottomSheet, {
        props: { open: true, children: defaultChildren },
      })
      const sheet = container.querySelector('[role="dialog"]')
      // Default snap is 0.5 * 800 = 400px
      expect(sheet).toHaveStyle({ height: "400px" })
    })

    it("respects custom snap points", () => {
      const { container } = render(BottomSheet, {
        props: {
          open: true,
          snapPoints: [0.3, 0.6],
          children: defaultChildren,
        },
      })
      const sheet = container.querySelector('[role="dialog"]')
      // First snap point: 0.3 * 800 = 240px
      expect(sheet).toHaveStyle({ height: "240px" })
    })

    it("respects initialSnap", () => {
      const { container } = render(BottomSheet, {
        props: {
          open: true,
          snapPoints: [0.3, 0.6],
          initialSnap: 1,
          children: defaultChildren,
        },
      })
      const sheet = container.querySelector('[role="dialog"]')
      // Second snap point: 0.6 * 800 = 480px
      expect(sheet).toHaveStyle({ height: "480px" })
    })

    it.skip("snaps to nearest point after drag (requires pointer capture)", async () => {
      /**
       * Snap point transition testing requires pointer capture support.
       *
       * The component calculates snap behavior:
       * 1. On drag end, finds nearest snap point based on final position
       * 2. Animates to that snap point
       * 3. If dragged past 40% of snap height OR velocity > 0.5 px/ms, closes
       *
       * This test would verify:
       * - Dragging up from 0.3 snap to halfway toward 0.6 snap
       * - Release should snap to 0.6 (nearest point)
       *
       * Use Playwright E2E for reliable gesture testing.
       */
      const { container } = render(BottomSheet, {
        props: {
          open: true,
          snapPoints: [0.3, 0.6, 0.9],
          initialSnap: 0,
          children: defaultChildren,
        },
      })
      const sheet = container.querySelector('[role="dialog"]')!
      const handle = container.querySelector(".cursor-grab") as HTMLElement

      // Initial: 0.3 * 800 = 240px
      expect(sheet).toHaveStyle({ height: "240px" })

      // Would need to drag up and verify snap to next point
      await pointerDown(handle, 100, 100)
      await pointerMove(handle, 100, -100) // Drag up
      await pointerUp(handle, 100, -100)

      // Should snap to 0.6 * 800 = 480px (nearest point)
      // This assertion would work with proper pointer capture
      // expect(sheet).toHaveStyle({ height: "480px" })
    })
  })

  describe("body scroll lock", () => {
    it("locks body scroll when open", () => {
      render(BottomSheet, { props: { open: true, children: defaultChildren } })
      expect(document.body.style.overflow).toBe("hidden")
    })
  })

  describe("custom styling", () => {
    it("applies custom class to sheet", () => {
      const { container } = render(BottomSheet, {
        props: { open: true, class: "custom-sheet", children: defaultChildren },
      })
      expect(container.querySelector('[role="dialog"]')).toHaveClass(
        "custom-sheet",
      )
    })
  })

  describe("header snippet", () => {
    it("renders custom header when provided", () => {
      const header = textSnippet("Custom Header")
      render(BottomSheet, {
        props: { open: true, header, children: defaultChildren },
      })
      expect(screen.getByText("Custom Header")).toBeInTheDocument()
    })

    it("custom header replaces default header", () => {
      const header = textSnippet("Custom Header")
      render(BottomSheet, {
        props: {
          open: true,
          header,
          title: "Default Title",
          children: defaultChildren,
        },
      })
      expect(screen.queryByText("Default Title")).not.toBeInTheDocument()
      expect(screen.getByText("Custom Header")).toBeInTheDocument()
    })
  })
})
