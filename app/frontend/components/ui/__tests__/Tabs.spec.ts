/**
 * Tabs component tests
 */

import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"

import Tabs from "../Tabs.svelte"

import { htmlSnippet } from "./test-utils"

describe("Tabs", () => {
  // Note: createRawSnippet requires a single root element, so we wrap buttons in a fragment-like div
  // The Tabs component renders this inside the tablist
  const defaultTabs = htmlSnippet(
    `<div><button>Tab 1</button><button>Tab 2</button><button>Tab 3</button></div>`,
  )

  describe("rendering", () => {
    it("renders tabs container", () => {
      const { container } = render(Tabs, {
        props: { id: "test", tabs: defaultTabs },
      })
      expect(container.querySelector(".tabs")).toBeInTheDocument()
    })

    it("renders tablist with role", () => {
      render(Tabs, { props: { id: "test", tabs: defaultTabs } })
      expect(screen.getByRole("tablist")).toBeInTheDocument()
    })

    it("renders tab buttons", () => {
      render(Tabs, { props: { id: "test", tabs: defaultTabs } })
      expect(screen.getAllByRole("tab")).toHaveLength(3)
    })

    it("sets horizontal orientation", () => {
      render(Tabs, { props: { id: "test", tabs: defaultTabs } })
      expect(screen.getByRole("tablist")).toHaveAttribute(
        "aria-orientation",
        "horizontal",
      )
    })
  })

  describe("selection", () => {
    it("first tab is selected by default", () => {
      render(Tabs, { props: { id: "test", tabs: defaultTabs } })
      const tabs = screen.getAllByRole("tab")
      expect(tabs[0]).toHaveAttribute("aria-selected", "true")
      expect(tabs[1]).toHaveAttribute("aria-selected", "false")
    })

    it("respects initial selected prop", () => {
      render(Tabs, { props: { id: "test", tabs: defaultTabs, selected: 1 } })
      const tabs = screen.getAllByRole("tab")
      expect(tabs[0]).toHaveAttribute("aria-selected", "false")
      expect(tabs[1]).toHaveAttribute("aria-selected", "true")
    })

    it("selects tab on click", async () => {
      render(Tabs, { props: { id: "test", tabs: defaultTabs } })
      const tabs = screen.getAllByRole("tab")
      await fireEvent.click(tabs[1])
      expect(tabs[1]).toHaveAttribute("aria-selected", "true")
    })

    it("calls onchange when tab changes", async () => {
      const onChange = vi.fn()
      render(Tabs, {
        props: { id: "test", tabs: defaultTabs, onchange: onChange },
      })
      await fireEvent.click(screen.getAllByRole("tab")[2])
      expect(onChange).toHaveBeenCalledWith(2)
    })
  })

  describe("tabindex management", () => {
    it("selected tab has tabindex 0", () => {
      render(Tabs, { props: { id: "test", tabs: defaultTabs } })
      const tabs = screen.getAllByRole("tab")
      expect(tabs[0]).toHaveAttribute("tabindex", "0")
    })

    it("unselected tabs have tabindex -1", () => {
      render(Tabs, { props: { id: "test", tabs: defaultTabs } })
      const tabs = screen.getAllByRole("tab")
      expect(tabs[1]).toHaveAttribute("tabindex", "-1")
      expect(tabs[2]).toHaveAttribute("tabindex", "-1")
    })
  })

  describe("ARIA attributes", () => {
    it("applies tab IDs", () => {
      render(Tabs, { props: { id: "demo", tabs: defaultTabs } })
      const tabs = screen.getAllByRole("tab")
      expect(tabs[0]).toHaveAttribute("id", "demo-tab-0")
      expect(tabs[1]).toHaveAttribute("id", "demo-tab-1")
    })

    it("applies aria-controls", () => {
      render(Tabs, { props: { id: "demo", tabs: defaultTabs } })
      const tabs = screen.getAllByRole("tab")
      expect(tabs[0]).toHaveAttribute("aria-controls", "demo-panel-0")
    })
  })

  describe("keyboard navigation", () => {
    it("moves focus right with ArrowRight", async () => {
      render(Tabs, { props: { id: "test", tabs: defaultTabs } })
      const tabs = screen.getAllByRole("tab")
      tabs[0].focus()
      await fireEvent.keyDown(screen.getByRole("tablist"), {
        key: "ArrowRight",
      })
      expect(tabs[1]).toHaveAttribute("aria-selected", "true")
    })

    it("moves focus left with ArrowLeft", async () => {
      render(Tabs, { props: { id: "test", tabs: defaultTabs, selected: 2 } })
      const tabs = screen.getAllByRole("tab")
      tabs[2].focus()
      await fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowLeft" })
      expect(tabs[1]).toHaveAttribute("aria-selected", "true")
    })

    it("wraps to first tab from last with ArrowRight", async () => {
      render(Tabs, { props: { id: "test", tabs: defaultTabs, selected: 2 } })
      const tabs = screen.getAllByRole("tab")
      tabs[2].focus()
      await fireEvent.keyDown(screen.getByRole("tablist"), {
        key: "ArrowRight",
      })
      expect(tabs[0]).toHaveAttribute("aria-selected", "true")
    })

    it("moves to first tab with Home", async () => {
      render(Tabs, { props: { id: "test", tabs: defaultTabs, selected: 2 } })
      const tabs = screen.getAllByRole("tab")
      tabs[2].focus()
      await fireEvent.keyDown(screen.getByRole("tablist"), { key: "Home" })
      expect(tabs[0]).toHaveAttribute("aria-selected", "true")
    })

    it("moves to last tab with End", async () => {
      render(Tabs, { props: { id: "test", tabs: defaultTabs, selected: 0 } })
      const tabs = screen.getAllByRole("tab")
      tabs[0].focus()
      await fireEvent.keyDown(screen.getByRole("tablist"), { key: "End" })
      expect(tabs[2]).toHaveAttribute("aria-selected", "true")
    })
  })

  describe("disabled tabs", () => {
    const tabsWithDisabled = htmlSnippet(
      `<div><button>Tab 1</button><button disabled>Tab 2</button><button>Tab 3</button></div>`,
    )

    it("skips disabled tab on keyboard navigation", async () => {
      render(Tabs, { props: { id: "test", tabs: tabsWithDisabled } })
      const tabs = screen.getAllByRole("tab")
      tabs[0].focus()
      await fireEvent.keyDown(screen.getByRole("tablist"), {
        key: "ArrowRight",
      })
      // Should skip disabled tab 2 and go to tab 3
      expect(tabs[2]).toHaveAttribute("aria-selected", "true")
    })

    it("does not select disabled tab on click", async () => {
      render(Tabs, { props: { id: "test", tabs: tabsWithDisabled } })
      const tabs = screen.getAllByRole("tab")
      await fireEvent.click(tabs[1])
      // Tab 1 should still be selected
      expect(tabs[0]).toHaveAttribute("aria-selected", "true")
    })
  })

  describe("custom styling", () => {
    it("applies custom class to container", () => {
      const { container } = render(Tabs, {
        props: { id: "test", tabs: defaultTabs, class: "mt-4" },
      })
      expect(container.querySelector(".mt-4")).toBeInTheDocument()
    })

    it("applies tablistClass to tablist", () => {
      const { container } = render(Tabs, {
        props: { id: "test", tabs: defaultTabs, tablistClass: "gap-2" },
      })
      expect(container.querySelector('[role="tablist"]')).toHaveClass("gap-2")
    })
  })
})
