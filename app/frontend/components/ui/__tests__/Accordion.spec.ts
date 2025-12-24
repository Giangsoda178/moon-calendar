/**
 * Accordion component tests
 */

import { fireEvent, render, screen } from "@testing-library/svelte"
import { beforeAll, describe, expect, it, vi } from "vitest"

import Accordion from "../Accordion.svelte"

// Mock Web Animations API since jsdom doesn't support it (needed for transition:slide)
// The mock needs to immediately call onfinish to complete the transition
beforeAll(() => {
  Element.prototype.animate = vi.fn().mockImplementation(function () {
    const animation = {
      onfinish: null as (() => void) | null,
      cancel: vi.fn(),
      finish: vi.fn(),
      play: vi.fn(),
      pause: vi.fn(),
      reverse: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      currentTime: 0,
      playbackRate: 1,
      playState: "finished",
      finished: Promise.resolve(),
    }
    // Call onfinish immediately to complete transition synchronously
    queueMicrotask(() => {
      if (animation.onfinish) animation.onfinish()
    })
    return animation
  })
})

const defaultItems = [
  { value: "item-1", title: "Item 1", content: "Content 1" },
  { value: "item-2", title: "Item 2", content: "Content 2" },
  { value: "item-3", title: "Item 3", content: "Content 3" },
]

describe("Accordion", () => {
  describe("rendering", () => {
    it("renders accordion container", () => {
      const { container } = render(Accordion, {
        props: { items: defaultItems },
      })
      expect(container.querySelector(".accordion")).toBeInTheDocument()
    })

    it("has region role on container", () => {
      const { container } = render(Accordion, {
        props: { items: defaultItems },
      })
      expect(
        container.querySelector('.accordion[role="region"]'),
      ).toBeInTheDocument()
    })

    it("renders all items", () => {
      render(Accordion, { props: { items: defaultItems } })
      expect(screen.getByText("Item 1")).toBeInTheDocument()
      expect(screen.getByText("Item 2")).toBeInTheDocument()
      expect(screen.getByText("Item 3")).toBeInTheDocument()
    })

    it("renders item triggers as buttons", () => {
      render(Accordion, { props: { items: defaultItems } })
      expect(screen.getAllByRole("button")).toHaveLength(3)
    })
  })

  describe("single mode (default)", () => {
    it("all items closed by default", () => {
      render(Accordion, { props: { items: defaultItems } })
      // Content should not be visible when closed - only container region exists
      expect(screen.queryByText("Content 1")).not.toBeInTheDocument()
      expect(screen.queryByText("Content 2")).not.toBeInTheDocument()
      // Only 1 region (the accordion container)
      expect(screen.getAllByRole("region")).toHaveLength(1)
    })

    it("opens item on click", async () => {
      render(Accordion, { props: { items: defaultItems } })
      await fireEvent.click(screen.getByText("Item 1"))
      expect(screen.getByText("Content 1")).toBeInTheDocument()
      // Now 2 regions: container + opened content panel
      expect(screen.getAllByRole("region")).toHaveLength(2)
    })

    it("closes previously open item when opening another", async () => {
      render(Accordion, { props: { items: defaultItems } })
      await fireEvent.click(screen.getByText("Item 1"))
      expect(screen.getByText("Content 1")).toBeInTheDocument()

      await fireEvent.click(screen.getByText("Item 2"))
      expect(screen.queryByText("Content 1")).not.toBeInTheDocument()
      expect(screen.getByText("Content 2")).toBeInTheDocument()
      // Still 2 regions: container + one opened content panel
      expect(screen.getAllByRole("region")).toHaveLength(2)
    })

    it("closes item when clicking the same trigger", async () => {
      render(Accordion, { props: { items: defaultItems } })
      await fireEvent.click(screen.getByText("Item 1"))
      expect(screen.getByText("Content 1")).toBeInTheDocument()

      await fireEvent.click(screen.getByText("Item 1"))
      expect(screen.queryByText("Content 1")).not.toBeInTheDocument()
      // Back to 1 region (container only)
      expect(screen.getAllByRole("region")).toHaveLength(1)
    })
  })

  describe("multiple mode", () => {
    it("allows multiple items open", async () => {
      render(Accordion, { props: { items: defaultItems, type: "multiple" } })
      await fireEvent.click(screen.getByText("Item 1"))
      await fireEvent.click(screen.getByText("Item 2"))

      expect(screen.getByText("Content 1")).toBeInTheDocument()
      expect(screen.getByText("Content 2")).toBeInTheDocument()
      // 3 regions: container + 2 opened content panels
      expect(screen.getAllByRole("region")).toHaveLength(3)
    })

    it("can close individual items", async () => {
      render(Accordion, { props: { items: defaultItems, type: "multiple" } })
      await fireEvent.click(screen.getByText("Item 1"))
      await fireEvent.click(screen.getByText("Item 2"))

      await fireEvent.click(screen.getByText("Item 1"))
      expect(screen.queryByText("Content 1")).not.toBeInTheDocument()
      expect(screen.getByText("Content 2")).toBeInTheDocument()
      // 2 regions: container + 1 opened content panel
      expect(screen.getAllByRole("region")).toHaveLength(2)
    })
  })

  describe("default value", () => {
    it("respects initial value prop (single mode)", () => {
      render(Accordion, { props: { items: defaultItems, value: "item-2" } })
      expect(screen.getByText("Content 2")).toBeInTheDocument()
      // 2 regions: container + 1 opened content panel
      expect(screen.getAllByRole("region")).toHaveLength(2)
    })

    it("respects initial value prop (multiple mode)", () => {
      render(Accordion, {
        props: {
          items: defaultItems,
          type: "multiple",
          value: ["item-1", "item-3"],
        },
      })
      expect(screen.getByText("Content 1")).toBeInTheDocument()
      expect(screen.getByText("Content 3")).toBeInTheDocument()
      // 3 regions: container + 2 opened content panels
      expect(screen.getAllByRole("region")).toHaveLength(3)
    })
  })

  describe("onchange callback", () => {
    it("calls onchange when item toggled (single mode)", async () => {
      const onchange = vi.fn()
      render(Accordion, { props: { items: defaultItems, onchange } })
      await fireEvent.click(screen.getByText("Item 1"))
      expect(onchange).toHaveBeenCalledWith("item-1")
      expect(screen.getAllByRole("region")).toHaveLength(2)
    })

    it("calls onchange with empty string when item closed (single mode)", async () => {
      const onchange = vi.fn()
      render(Accordion, { props: { items: defaultItems, onchange } })
      await fireEvent.click(screen.getByText("Item 1"))
      await fireEvent.click(screen.getByText("Item 1"))
      expect(onchange).toHaveBeenLastCalledWith("")
      expect(screen.getAllByRole("region")).toHaveLength(1)
    })

    it("calls onchange with array (multiple mode)", async () => {
      const onchange = vi.fn()
      render(Accordion, {
        props: { items: defaultItems, type: "multiple", onchange },
      })
      await fireEvent.click(screen.getByText("Item 1"))
      expect(onchange).toHaveBeenCalledWith(["item-1"])

      await fireEvent.click(screen.getByText("Item 2"))
      expect(onchange).toHaveBeenCalledWith(["item-1", "item-2"])
      expect(screen.getAllByRole("region")).toHaveLength(3)
    })
  })

  describe("disabled items", () => {
    it("renders disabled items with disabled attribute", () => {
      const itemsWithDisabled = [
        { value: "a", title: "A", content: "Content A" },
        { value: "b", title: "B", content: "Content B", disabled: true },
      ]
      render(Accordion, { props: { items: itemsWithDisabled } })
      const disabledButton = screen.getByText("B").closest("button")
      expect(disabledButton).toBeDisabled()
      expect(screen.getAllByRole("region")).toHaveLength(1)
    })

    it("does not open disabled items on click", async () => {
      const itemsWithDisabled = [
        { value: "a", title: "A", content: "Content A" },
        { value: "b", title: "B", content: "Content B", disabled: true },
      ]
      render(Accordion, { props: { items: itemsWithDisabled } })
      await fireEvent.click(screen.getByText("B"))
      expect(screen.queryByText("Content B")).not.toBeInTheDocument()
      expect(screen.getAllByRole("region")).toHaveLength(1)
    })
  })

  describe("accessibility", () => {
    it("triggers have aria-expanded", () => {
      render(Accordion, { props: { items: defaultItems } })
      const buttons = screen.getAllByRole("button")
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("aria-expanded")
      })
    })

    it("aria-expanded=true when open", async () => {
      render(Accordion, { props: { items: defaultItems } })
      await fireEvent.click(screen.getByText("Item 1"))
      expect(screen.getByText("Item 1").closest("button")).toHaveAttribute(
        "aria-expanded",
        "true",
      )
    })

    it("aria-expanded=false when closed", () => {
      render(Accordion, { props: { items: defaultItems } })
      expect(screen.getByText("Item 1").closest("button")).toHaveAttribute(
        "aria-expanded",
        "false",
      )
    })

    it("triggers have aria-controls", () => {
      render(Accordion, { props: { items: defaultItems } })
      const button = screen.getByText("Item 1").closest("button")
      expect(button).toHaveAttribute("aria-controls", "item-1-content")
    })

    it("content panel has region role when open", async () => {
      render(Accordion, { props: { items: defaultItems } })
      await fireEvent.click(screen.getByText("Item 1"))
      // Accordion container has region role, and opened content panel also has region role
      const regions = screen.getAllByRole("region")
      // One for the accordion container, one for the open content panel
      expect(regions.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe("keyboard navigation", () => {
    it("opens item with Enter key", async () => {
      render(Accordion, { props: { items: defaultItems } })
      const button = screen.getByText("Item 1").closest("button")!
      await fireEvent.keyDown(button, { key: "Enter" })
      expect(screen.getByText("Content 1")).toBeInTheDocument()
      expect(screen.getAllByRole("region")).toHaveLength(2)
    })

    it("opens item with Space key", async () => {
      render(Accordion, { props: { items: defaultItems } })
      const button = screen.getByText("Item 1").closest("button")!
      await fireEvent.keyDown(button, { key: " " })
      expect(screen.getByText("Content 1")).toBeInTheDocument()
      expect(screen.getAllByRole("region")).toHaveLength(2)
    })
  })

  describe("custom styling", () => {
    it("applies custom class to container", () => {
      const { container } = render(Accordion, {
        props: { items: defaultItems, class: "max-w-md" },
      })
      expect(container.querySelector(".accordion")).toHaveClass("max-w-md")
    })

    it("uses provided ID", () => {
      const { container } = render(Accordion, {
        props: { id: "faq-accordion", items: defaultItems },
      })
      expect(container.querySelector("#faq-accordion")).toBeInTheDocument()
    })
  })
})
