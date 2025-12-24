/**
 * Combobox component tests
 */

import { fireEvent, render, screen } from "@testing-library/svelte"
import { beforeAll, describe, expect, it, vi } from "vitest"

import Combobox from "../Combobox.svelte"

// Mock ResizeObserver and scrollIntoView since jsdom doesn't support them
beforeAll(() => {
  globalThis.ResizeObserver = class ResizeObserver {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
    constructor(_callback: ResizeObserverCallback) {
      // Store callback if needed
    }
  }
  Element.prototype.scrollIntoView = vi.fn()
})

const defaultOptions = [
  { value: "next", label: "Next.js" },
  { value: "svelte", label: "SvelteKit" },
  { value: "nuxt", label: "Nuxt.js" },
]

const groupedOptions = [
  {
    label: "Frameworks",
    options: [
      { value: "next", label: "Next.js" },
      { value: "svelte", label: "SvelteKit" },
    ],
  },
  {
    label: "Libraries",
    options: [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue" },
    ],
  },
]

describe("Combobox", () => {
  describe("rendering", () => {
    it("renders trigger button", () => {
      render(Combobox, { props: { id: "test", options: defaultOptions } })
      expect(screen.getByRole("button")).toBeInTheDocument()
    })

    it("displays placeholder when no value", () => {
      render(Combobox, {
        props: {
          id: "test",
          options: defaultOptions,
          placeholder: "Select framework...",
        },
      })
      expect(screen.getByText("Select framework...")).toBeInTheDocument()
    })

    it("displays selected value label", () => {
      render(Combobox, {
        props: { id: "test", options: defaultOptions, value: "svelte" },
      })
      // The selected value is shown in the trigger button
      expect(screen.getByRole("button")).toHaveTextContent("SvelteKit")
    })

    it("has hidden input for form submission", () => {
      const { container } = render(Combobox, {
        props: { id: "test", options: defaultOptions, name: "framework" },
      })
      expect(
        container.querySelector('input[type="hidden"][name="framework"]'),
      ).toBeInTheDocument()
    })
  })

  describe("trigger button", () => {
    it("has aria-haspopup=listbox", () => {
      render(Combobox, { props: { id: "test", options: defaultOptions } })
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-haspopup",
        "listbox",
      )
    })

    it("has aria-expanded=false when closed", () => {
      render(Combobox, { props: { id: "test", options: defaultOptions } })
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "false",
      )
    })

    it("has aria-expanded=true when open", async () => {
      render(Combobox, { props: { id: "test", options: defaultOptions } })
      await fireEvent.click(screen.getByRole("button"))
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "true",
      )
    })
  })

  describe("popover content", () => {
    it("shows search input when open", async () => {
      render(Combobox, { props: { id: "test", options: defaultOptions } })
      await fireEvent.click(screen.getByRole("button"))
      expect(screen.getByRole("combobox")).toBeInTheDocument()
    })

    it("shows options when open", async () => {
      render(Combobox, { props: { id: "test", options: defaultOptions } })
      await fireEvent.click(screen.getByRole("button"))
      expect(
        screen.getByRole("option", { name: "Next.js" }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole("option", { name: "SvelteKit" }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole("option", { name: "Nuxt.js" }),
      ).toBeInTheDocument()
    })

    it("has listbox role", async () => {
      render(Combobox, { props: { id: "test", options: defaultOptions } })
      await fireEvent.click(screen.getByRole("button"))
      expect(screen.getByRole("listbox")).toBeInTheDocument()
    })
  })

  describe("selection", () => {
    it("selects option on click", async () => {
      render(Combobox, { props: { id: "test", options: defaultOptions } })
      await fireEvent.click(screen.getByRole("button"))
      await fireEvent.click(screen.getByRole("option", { name: "SvelteKit" }))
      // After selection, should show selected label in trigger
      expect(screen.getByRole("button")).toHaveTextContent("SvelteKit")
    })

    it("closes after selection", async () => {
      render(Combobox, { props: { id: "test", options: defaultOptions } })
      await fireEvent.click(screen.getByRole("button"))
      await fireEvent.click(screen.getByRole("option", { name: "Next.js" }))
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "false",
      )
    })

    it("calls onchange callback", async () => {
      const onchange = vi.fn()
      render(Combobox, {
        props: { id: "test", options: defaultOptions, onchange },
      })
      await fireEvent.click(screen.getByRole("button"))
      await fireEvent.click(screen.getByRole("option", { name: "Nuxt.js" }))
      expect(onchange).toHaveBeenCalledWith("nuxt")
    })

    it("marks selected option with aria-selected", async () => {
      render(Combobox, {
        props: { id: "test", options: defaultOptions, value: "svelte" },
      })
      await fireEvent.click(screen.getByRole("button"))
      expect(screen.getByRole("option", { name: "SvelteKit" })).toHaveAttribute(
        "aria-selected",
        "true",
      )
    })
  })

  describe("filtering", () => {
    it("filters options based on search input", async () => {
      render(Combobox, { props: { id: "test", options: defaultOptions } })
      await fireEvent.click(screen.getByRole("button"))
      const searchInput = screen.getByRole("combobox")
      await fireEvent.input(searchInput, { target: { value: "svelte" } })

      expect(
        screen.getByRole("option", { name: "SvelteKit" }),
      ).toBeInTheDocument()
      expect(
        screen.queryByRole("option", { name: "Next.js" }),
      ).not.toBeInTheDocument()
    })

    it("filters case-insensitively", async () => {
      render(Combobox, { props: { id: "test", options: defaultOptions } })
      await fireEvent.click(screen.getByRole("button"))
      const searchInput = screen.getByRole("combobox")
      await fireEvent.input(searchInput, { target: { value: "NEXT" } })

      expect(
        screen.getByRole("option", { name: "Next.js" }),
      ).toBeInTheDocument()
    })

    it("supports keyword search", async () => {
      const optionsWithKeywords = [
        { value: "us", label: "United States", keywords: "usa america" },
        { value: "uk", label: "United Kingdom", keywords: "britain england" },
      ]
      render(Combobox, { props: { id: "test", options: optionsWithKeywords } })
      await fireEvent.click(screen.getByRole("button"))
      const searchInput = screen.getByRole("combobox")
      await fireEvent.input(searchInput, { target: { value: "usa" } })

      expect(
        screen.getByRole("option", { name: "United States" }),
      ).toBeInTheDocument()
      expect(
        screen.queryByRole("option", { name: "United Kingdom" }),
      ).not.toBeInTheDocument()
    })
  })

  describe("keyboard navigation", () => {
    it("opens with Enter key", async () => {
      render(Combobox, { props: { id: "test", options: defaultOptions } })
      const button = screen.getByRole("button")
      await fireEvent.keyDown(button, { key: "Enter" })
      expect(button).toHaveAttribute("aria-expanded", "true")
    })

    it("opens with ArrowDown key", async () => {
      render(Combobox, { props: { id: "test", options: defaultOptions } })
      const button = screen.getByRole("button")
      await fireEvent.keyDown(button, { key: "ArrowDown" })
      expect(button).toHaveAttribute("aria-expanded", "true")
    })

    it("closes with Escape key", async () => {
      render(Combobox, { props: { id: "test", options: defaultOptions } })
      await fireEvent.click(screen.getByRole("button"))
      await fireEvent.keyDown(screen.getByRole("combobox"), { key: "Escape" })
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "false",
      )
    })
  })

  describe("grouped options", () => {
    it("renders group headings", async () => {
      render(Combobox, { props: { id: "test", options: groupedOptions } })
      await fireEvent.click(screen.getByRole("button"))
      expect(screen.getByText("Frameworks")).toBeInTheDocument()
      expect(screen.getByText("Libraries")).toBeInTheDocument()
    })

    it("renders options within groups", async () => {
      render(Combobox, { props: { id: "test", options: groupedOptions } })
      await fireEvent.click(screen.getByRole("button"))
      expect(
        screen.getByRole("option", { name: "Next.js" }),
      ).toBeInTheDocument()
      expect(screen.getByRole("option", { name: "React" })).toBeInTheDocument()
    })

    it("groups have group role", async () => {
      render(Combobox, { props: { id: "test", options: groupedOptions } })
      await fireEvent.click(screen.getByRole("button"))
      expect(screen.getAllByRole("group")).toHaveLength(2)
    })
  })

  describe("disabled options", () => {
    it("marks disabled options with aria-disabled", async () => {
      const optionsWithDisabled = [
        { value: "a", label: "A" },
        { value: "b", label: "B", disabled: true },
      ]
      render(Combobox, { props: { id: "test", options: optionsWithDisabled } })
      await fireEvent.click(screen.getByRole("button"))
      expect(screen.getByRole("option", { name: "B" })).toHaveAttribute(
        "aria-disabled",
        "true",
      )
    })
  })

  describe("custom styling", () => {
    it("applies custom class to container", () => {
      const { container } = render(Combobox, {
        props: { id: "test", options: defaultOptions, class: "w-full" },
      })
      expect(container.querySelector(".select")).toHaveClass("w-full")
    })

    it("applies triggerClass to trigger button", () => {
      const { container } = render(Combobox, {
        props: { id: "test", options: defaultOptions, triggerClass: "h-12" },
      })
      expect(container.querySelector("button")).toHaveClass("h-12")
    })
  })

  describe("filter reset", () => {
    it("clears filter when closed and reopened", async () => {
      render(Combobox, { props: { id: "test", options: defaultOptions } })

      // Open and filter
      await fireEvent.click(screen.getByRole("button"))
      const search = screen.getByRole("combobox")
      await fireEvent.input(search, { target: { value: "svelte" } })

      // Verify filtered state
      expect(
        screen.queryByRole("option", { name: "Next.js" }),
      ).not.toBeInTheDocument()
      expect(
        screen.getByRole("option", { name: "SvelteKit" }),
      ).toBeInTheDocument()

      // Close
      await fireEvent.keyDown(search, { key: "Escape" })
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "false",
      )

      // Reopen - all options should be visible again
      await fireEvent.click(screen.getByRole("button"))
      expect(
        screen.getByRole("option", { name: "Next.js" }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole("option", { name: "SvelteKit" }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole("option", { name: "Nuxt.js" }),
      ).toBeInTheDocument()
    })

    it("clears filter after selection", async () => {
      render(Combobox, { props: { id: "test", options: defaultOptions } })

      // Open and filter
      await fireEvent.click(screen.getByRole("button"))
      const search = screen.getByRole("combobox")
      await fireEvent.input(search, { target: { value: "svelte" } })

      // Select filtered option
      await fireEvent.click(screen.getByRole("option", { name: "SvelteKit" }))

      // Reopen - all options should be visible (filter was cleared on selection)
      await fireEvent.click(screen.getByRole("button"))
      expect(
        screen.getByRole("option", { name: "Next.js" }),
      ).toBeInTheDocument()
    })
  })

  describe("empty state", () => {
    it("shows data-empty attribute when no matches", async () => {
      render(Combobox, {
        props: {
          id: "test",
          options: defaultOptions,
          emptyMessage: "No frameworks found",
        },
      })

      await fireEvent.click(screen.getByRole("button"))
      const search = screen.getByRole("combobox")
      await fireEvent.input(search, { target: { value: "zzzzz" } })

      // No options should be visible
      expect(screen.queryByRole("option")).not.toBeInTheDocument()

      // Listbox should have data-empty attribute for CSS to display message
      const listbox = screen.getByRole("listbox")
      expect(listbox).toHaveAttribute("data-empty", "No frameworks found")
    })

    it("uses default empty message", async () => {
      render(Combobox, { props: { id: "test", options: defaultOptions } })

      await fireEvent.click(screen.getByRole("button"))
      await fireEvent.input(screen.getByRole("combobox"), {
        target: { value: "xyz" },
      })

      const listbox = screen.getByRole("listbox")
      expect(listbox).toHaveAttribute("data-empty", "No results found.")
    })
  })
})
