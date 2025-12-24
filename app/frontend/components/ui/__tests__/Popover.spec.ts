/**
 * Popover component tests
 */

import { fireEvent, render, screen } from "@testing-library/svelte"
import { beforeAll, describe, expect, it, vi } from "vitest"

import Popover from "../Popover.svelte"

import { htmlSnippet, textSnippet } from "./test-utils"

// Mock ResizeObserver since jsdom doesn't support it
beforeAll(() => {
  globalThis.ResizeObserver = class ResizeObserver {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
    constructor(_callback: ResizeObserverCallback) {
      // Store callback if needed
    }
  }
})

describe("Popover", () => {
  const defaultTrigger = htmlSnippet("<span>Open</span>")

  describe("rendering", () => {
    it("renders popover container", () => {
      const { container } = render(Popover, {
        props: { id: "test", trigger: defaultTrigger },
      })
      expect(container.querySelector(".popover")).toBeInTheDocument()
    })

    it("renders trigger button", () => {
      render(Popover, { props: { id: "test", trigger: defaultTrigger } })
      expect(screen.getByRole("button")).toBeInTheDocument()
    })

    it("renders trigger content", () => {
      render(Popover, { props: { id: "test", trigger: defaultTrigger } })
      expect(screen.getByText("Open")).toBeInTheDocument()
    })
  })

  describe("trigger button", () => {
    it("has aria-expanded=false when closed", () => {
      render(Popover, { props: { id: "test", trigger: defaultTrigger } })
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "false",
      )
    })

    it("has aria-expanded=true when open", async () => {
      render(Popover, { props: { id: "test", trigger: defaultTrigger } })
      await fireEvent.click(screen.getByRole("button"))
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "true",
      )
    })

    it("has aria-controls pointing to popover", () => {
      render(Popover, { props: { id: "my-popover", trigger: defaultTrigger } })
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-controls",
        "my-popover-popover",
      )
    })

    it("applies triggerClass", () => {
      const { container } = render(Popover, {
        props: { id: "test", trigger: defaultTrigger, triggerClass: "w-full" },
      })
      expect(container.querySelector("button")).toHaveClass("w-full")
    })
  })

  describe("popover content", () => {
    it("is hidden when closed", () => {
      const { container } = render(Popover, {
        props: { id: "test", trigger: defaultTrigger },
      })
      expect(container.querySelector("[data-popover]")).toHaveAttribute(
        "aria-hidden",
        "true",
      )
    })

    it("is visible when open", async () => {
      const { container } = render(Popover, {
        props: { id: "test", trigger: defaultTrigger },
      })
      await fireEvent.click(screen.getByRole("button"))
      expect(container.querySelector("[data-popover]")).toHaveAttribute(
        "aria-hidden",
        "false",
      )
    })

    it("renders children content", async () => {
      render(Popover, {
        props: {
          id: "test",
          trigger: defaultTrigger,
          children: textSnippet("Popover content"),
        },
      })
      await fireEvent.click(screen.getByRole("button"))
      expect(screen.getByText("Popover content")).toBeInTheDocument()
    })
  })

  describe("open/close", () => {
    it("toggles open state on click", async () => {
      render(Popover, { props: { id: "test", trigger: defaultTrigger } })
      const button = screen.getByRole("button")

      await fireEvent.click(button)
      expect(button).toHaveAttribute("aria-expanded", "true")

      await fireEvent.click(button)
      expect(button).toHaveAttribute("aria-expanded", "false")
    })

    it("closes on Escape key", async () => {
      render(Popover, { props: { id: "test", trigger: defaultTrigger } })
      const button = screen.getByRole("button")

      await fireEvent.click(button)
      expect(button).toHaveAttribute("aria-expanded", "true")

      await fireEvent.keyDown(button, { key: "Escape" })
      expect(button).toHaveAttribute("aria-expanded", "false")
    })

    it("calls onopen callback when opened", async () => {
      const onopen = vi.fn()
      render(Popover, {
        props: { id: "test", trigger: defaultTrigger, onopen },
      })
      await fireEvent.click(screen.getByRole("button"))
      expect(onopen).toHaveBeenCalled()
    })

    it("calls onclose callback when closed", async () => {
      const onclose = vi.fn()
      render(Popover, {
        props: { id: "test", trigger: defaultTrigger, onclose },
      })
      await fireEvent.click(screen.getByRole("button")) // open
      await fireEvent.click(screen.getByRole("button")) // close
      expect(onclose).toHaveBeenCalled()
    })
  })

  describe("positioning", () => {
    it("sets data-side attribute", () => {
      const { container } = render(Popover, {
        props: { id: "test", trigger: defaultTrigger, side: "right" },
      })
      expect(container.querySelector("[data-popover]")).toHaveAttribute(
        "data-side",
        "right",
      )
    })

    it("sets data-align attribute", () => {
      const { container } = render(Popover, {
        props: { id: "test", trigger: defaultTrigger, align: "end" },
      })
      expect(container.querySelector("[data-popover]")).toHaveAttribute(
        "data-align",
        "end",
      )
    })

    it("defaults to bottom side", () => {
      const { container } = render(Popover, {
        props: { id: "test", trigger: defaultTrigger },
      })
      expect(container.querySelector("[data-popover]")).toHaveAttribute(
        "data-side",
        "bottom",
      )
    })
  })

  describe("match trigger width", () => {
    it("sets data-match-trigger-width when enabled", () => {
      const { container } = render(Popover, {
        props: { id: "test", trigger: defaultTrigger, matchTriggerWidth: true },
      })
      expect(container.querySelector("[data-popover]")).toHaveAttribute(
        "data-match-trigger-width",
        "true",
      )
    })
  })

  describe("custom styling", () => {
    it("applies custom class to container", () => {
      const { container } = render(Popover, {
        props: { id: "test", trigger: defaultTrigger, class: "w-64" },
      })
      expect(container.querySelector(".popover")).toHaveClass("w-64")
    })

    it("applies popoverClass to popover content", () => {
      const { container } = render(Popover, {
        props: { id: "test", trigger: defaultTrigger, popoverClass: "p-4" },
      })
      expect(container.querySelector("[data-popover]")).toHaveClass("p-4")
    })
  })

  describe("focus management", () => {
    it("returns focus to trigger when closed with Escape", async () => {
      render(Popover, { props: { id: "test", trigger: defaultTrigger } })
      const trigger = screen.getByRole("button")

      // Focus and open
      trigger.focus()
      await fireEvent.click(trigger)
      expect(trigger).toHaveAttribute("aria-expanded", "true")

      // Close with Escape - should return focus to trigger
      await fireEvent.keyDown(trigger, { key: "Escape" })
      expect(trigger).toHaveAttribute("aria-expanded", "false")
      expect(trigger).toHaveFocus()
    })

    it("returns focus to trigger when closed via click outside", async () => {
      render(Popover, {
        props: {
          id: "test",
          trigger: defaultTrigger,
          children: textSnippet("Content"),
        },
      })
      const trigger = screen.getByRole("button")

      trigger.focus()
      await fireEvent.click(trigger)
      expect(trigger).toHaveAttribute("aria-expanded", "true")

      // Click outside (on document body)
      await fireEvent.click(document.body)
      expect(trigger).toHaveFocus()
    })
  })

  describe("visibility", () => {
    it("shows popover content when open", async () => {
      render(Popover, {
        props: {
          id: "test",
          trigger: defaultTrigger,
          children: textSnippet("Popover content"),
        },
      })
      await fireEvent.click(screen.getByRole("button"))

      // Verify both ARIA state and content visibility
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "true",
      )
      expect(screen.getByText("Popover content")).toBeInTheDocument()
    })

    it("hides popover content when closed", () => {
      const { container } = render(Popover, {
        props: {
          id: "test",
          trigger: defaultTrigger,
          children: textSnippet("Content"),
        },
      })

      // Closed state - verify ARIA and hidden state
      expect(container.querySelector("[data-popover]")).toHaveAttribute(
        "aria-hidden",
        "true",
      )
      // Content should not be visible (hidden via aria-hidden and CSS)
      const popover = container.querySelector("[data-popover]")
      expect(popover).toHaveAttribute("aria-hidden", "true")
    })
  })
})
