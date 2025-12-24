/**
 * Select component tests
 */

import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import { beforeAll, describe, expect, it, vi } from "vitest"

import Select from "../Select.svelte"

// Mock scrollIntoView since jsdom doesn't support it
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

const defaultOptions = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "orange", label: "Orange" },
]

const groupedOptions = [
  {
    label: "Fruits",
    options: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
    ],
  },
  {
    label: "Vegetables",
    options: [
      { value: "carrot", label: "Carrot" },
      { value: "broccoli", label: "Broccoli" },
    ],
  },
]

describe("Select", () => {
  describe("rendering", () => {
    it("renders trigger button", () => {
      render(Select, { props: { id: "test", options: defaultOptions } })
      expect(screen.getByRole("button")).toBeInTheDocument()
    })

    it("displays placeholder when no value selected", () => {
      render(Select, {
        props: {
          id: "test",
          options: defaultOptions,
          placeholder: "Choose...",
        },
      })
      expect(screen.getByText("Choose...")).toBeInTheDocument()
    })

    it("displays selected value label", () => {
      render(Select, {
        props: { id: "test", options: defaultOptions, value: "banana" },
      })
      expect(screen.getByRole("button")).toHaveTextContent("Banana")
    })

    it("has hidden input for form submission", () => {
      const { container } = render(Select, {
        props: { id: "test", options: defaultOptions, name: "fruit" },
      })
      expect(
        container.querySelector('input[type="hidden"][name="fruit"]'),
      ).toBeInTheDocument()
    })
  })

  describe("trigger button", () => {
    it("has aria-haspopup=listbox", () => {
      render(Select, { props: { id: "test", options: defaultOptions } })
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-haspopup",
        "listbox",
      )
    })

    it("has aria-expanded=false when closed", () => {
      render(Select, { props: { id: "test", options: defaultOptions } })
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "false",
      )
    })

    it("has aria-expanded=true when open", async () => {
      render(Select, { props: { id: "test", options: defaultOptions } })
      await fireEvent.click(screen.getByRole("button"))
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "true",
      )
    })
  })

  describe("opening/closing", () => {
    it("opens on click", async () => {
      render(Select, { props: { id: "test", options: defaultOptions } })
      await fireEvent.click(screen.getByRole("button"))
      expect(screen.getByRole("listbox")).toBeInTheDocument()
    })

    it("shows options when open", async () => {
      render(Select, { props: { id: "test", options: defaultOptions } })
      await fireEvent.click(screen.getByRole("button"))
      expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument()
      expect(screen.getByRole("option", { name: "Banana" })).toBeInTheDocument()
      expect(screen.getByRole("option", { name: "Orange" })).toBeInTheDocument()
    })

    it("closes on escape key", async () => {
      render(Select, { props: { id: "test", options: defaultOptions } })
      const trigger = screen.getByRole("button")
      await fireEvent.click(trigger)
      expect(screen.getByRole("listbox")).toBeInTheDocument()
      await fireEvent.keyDown(trigger, { key: "Escape" })
      await waitFor(() => {
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
      })
    })
  })

  describe("selection", () => {
    it("selects option on click", async () => {
      render(Select, { props: { id: "test", options: defaultOptions } })
      await fireEvent.click(screen.getByRole("button"))
      await fireEvent.click(screen.getByRole("option", { name: "Banana" }))
      // After selection, trigger button should display selected label
      expect(screen.getByRole("button")).toHaveTextContent("Banana")
    })

    it("closes after selection", async () => {
      render(Select, { props: { id: "test", options: defaultOptions } })
      await fireEvent.click(screen.getByRole("button"))
      await fireEvent.click(screen.getByRole("option", { name: "Apple" }))
      await waitFor(() => {
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
      })
    })

    it("calls onchange callback", async () => {
      const onChange = vi.fn()
      render(Select, {
        props: { id: "test", options: defaultOptions, onchange: onChange },
      })
      await fireEvent.click(screen.getByRole("button"))
      await fireEvent.click(screen.getByRole("option", { name: "Orange" }))
      expect(onChange).toHaveBeenCalledWith("orange")
    })
  })

  describe("keyboard navigation", () => {
    it("opens with Enter key", async () => {
      render(Select, { props: { id: "test", options: defaultOptions } })
      const trigger = screen.getByRole("button")
      await fireEvent.keyDown(trigger, { key: "Enter" })
      expect(screen.getByRole("listbox")).toBeInTheDocument()
    })

    it("opens with Space key", async () => {
      render(Select, { props: { id: "test", options: defaultOptions } })
      const trigger = screen.getByRole("button")
      await fireEvent.keyDown(trigger, { key: " " })
      expect(screen.getByRole("listbox")).toBeInTheDocument()
    })

    it("opens with ArrowDown key", async () => {
      render(Select, { props: { id: "test", options: defaultOptions } })
      const trigger = screen.getByRole("button")
      await fireEvent.keyDown(trigger, { key: "ArrowDown" })
      expect(screen.getByRole("listbox")).toBeInTheDocument()
    })
  })

  describe("disabled state", () => {
    it("disables trigger when disabled", () => {
      render(Select, {
        props: { id: "test", options: defaultOptions, disabled: true },
      })
      expect(screen.getByRole("button")).toBeDisabled()
    })

    it("does not open when disabled", async () => {
      render(Select, {
        props: { id: "test", options: defaultOptions, disabled: true },
      })
      await fireEvent.click(screen.getByRole("button"))
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
    })
  })

  describe("disabled options", () => {
    it("marks disabled options with aria-disabled", async () => {
      const optionsWithDisabled = [
        { value: "a", label: "A" },
        { value: "b", label: "B", disabled: true },
        { value: "c", label: "C" },
      ]
      render(Select, { props: { id: "test", options: optionsWithDisabled } })
      await fireEvent.click(screen.getByRole("button"))
      expect(screen.getByRole("option", { name: "B" })).toHaveAttribute(
        "aria-disabled",
        "true",
      )
    })

    it("skips disabled options with ArrowDown keyboard navigation", async () => {
      const options = [
        { value: "a", label: "A" },
        { value: "b", label: "B", disabled: true },
        { value: "c", label: "C" },
      ]
      render(Select, { props: { id: "test", options } })

      const trigger = screen.getByRole("button")
      await fireEvent.click(trigger)

      // Navigate down - should go A -> C (skip B because it's disabled)
      await fireEvent.keyDown(trigger, { key: "ArrowDown" }) // Active: A (index 0 in enabledOptions)
      expect(screen.getByRole("option", { name: "A" })).toHaveClass("active")

      await fireEvent.keyDown(trigger, { key: "ArrowDown" }) // Active: C (index 1 in enabledOptions, skips disabled B)
      expect(screen.getByRole("option", { name: "C" })).toHaveClass("active")
      expect(screen.getByRole("option", { name: "B" })).not.toHaveClass(
        "active",
      )
    })

    it("cannot select disabled option with click", async () => {
      const onchange = vi.fn()
      const options = [
        { value: "a", label: "A" },
        { value: "b", label: "B", disabled: true },
      ]
      render(Select, { props: { id: "test", options, onchange } })

      const trigger = screen.getByRole("button")
      await fireEvent.click(trigger)

      // Click directly on disabled option
      await fireEvent.click(screen.getByRole("option", { name: "B" }))
      expect(onchange).not.toHaveBeenCalled()
    })

    it("cannot select disabled option with Enter after hover", async () => {
      const onchange = vi.fn()
      const options = [
        { value: "a", label: "A" },
        { value: "b", label: "B", disabled: true },
      ]
      render(Select, { props: { id: "test", options, onchange } })

      const trigger = screen.getByRole("button")
      await fireEvent.click(trigger)

      // Even if mouse hovers disabled, Enter should not select
      await fireEvent.mouseMove(screen.getByRole("option", { name: "B" }))
      await fireEvent.keyDown(trigger, { key: "Enter" })

      // Should not have called onchange with disabled option
      expect(onchange).not.toHaveBeenCalledWith("b")
    })
  })

  describe("grouped options", () => {
    it("renders option groups", async () => {
      render(Select, { props: { id: "test", options: groupedOptions } })
      await fireEvent.click(screen.getByRole("button"))
      expect(screen.getByText("Fruits")).toBeInTheDocument()
      expect(screen.getByText("Vegetables")).toBeInTheDocument()
    })

    it("renders options within groups", async () => {
      render(Select, { props: { id: "test", options: groupedOptions } })
      await fireEvent.click(screen.getByRole("button"))
      expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument()
      expect(screen.getByRole("option", { name: "Carrot" })).toBeInTheDocument()
    })

    it("groups have group role", async () => {
      render(Select, { props: { id: "test", options: groupedOptions } })
      await fireEvent.click(screen.getByRole("button"))
      expect(screen.getAllByRole("group")).toHaveLength(2)
    })
  })

  describe("custom styling", () => {
    it("applies custom class to container", () => {
      const { container } = render(Select, {
        props: { id: "test", options: defaultOptions, class: "w-64" },
      })
      expect(container.querySelector(".w-64")).toBeInTheDocument()
    })

    it("applies triggerClass to trigger button", () => {
      const { container } = render(Select, {
        props: { id: "test", options: defaultOptions, triggerClass: "h-12" },
      })
      expect(container.querySelector("button")).toHaveClass("h-12")
    })
  })
})
