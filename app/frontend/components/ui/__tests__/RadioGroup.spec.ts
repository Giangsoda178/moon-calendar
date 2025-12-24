/**
 * RadioGroup component tests
 */

import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"

import RadioGroup from "../RadioGroup.svelte"

const defaultOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
]

describe("RadioGroup", () => {
  describe("rendering", () => {
    it("renders fieldset with radiogroup role", () => {
      render(RadioGroup, { props: { name: "test", options: defaultOptions } })
      expect(screen.getByRole("radiogroup")).toBeInTheDocument()
    })

    it("renders all options as radio buttons", () => {
      render(RadioGroup, { props: { name: "test", options: defaultOptions } })
      expect(screen.getAllByRole("radio")).toHaveLength(3)
    })

    it("renders option labels", () => {
      render(RadioGroup, { props: { name: "test", options: defaultOptions } })
      expect(screen.getByText("Option 1")).toBeInTheDocument()
      expect(screen.getByText("Option 2")).toBeInTheDocument()
      expect(screen.getByText("Option 3")).toBeInTheDocument()
    })
  })

  describe("selection", () => {
    it("has no selection by default", () => {
      render(RadioGroup, { props: { name: "test", options: defaultOptions } })
      const radios = screen.getAllByRole("radio")
      radios.forEach((radio) => {
        expect(radio).not.toBeChecked()
      })
    })

    it("can have initial value", () => {
      render(RadioGroup, {
        props: { name: "test", options: defaultOptions, value: "option2" },
      })
      expect(screen.getByLabelText("Option 2")).toBeChecked()
    })

    it("selects option on click", async () => {
      render(RadioGroup, { props: { name: "test", options: defaultOptions } })
      const option1 = screen.getByLabelText("Option 1")
      await fireEvent.click(option1)
      expect(option1).toBeChecked()
    })

    it("only allows one selection", async () => {
      render(RadioGroup, { props: { name: "test", options: defaultOptions } })
      const option1 = screen.getByLabelText("Option 1")
      const option2 = screen.getByLabelText("Option 2")

      await fireEvent.click(option1)
      expect(option1).toBeChecked()
      expect(option2).not.toBeChecked()

      await fireEvent.click(option2)
      expect(option1).not.toBeChecked()
      expect(option2).toBeChecked()
    })
  })

  describe("disabled state", () => {
    it("disables all options when group is disabled", () => {
      render(RadioGroup, {
        props: { name: "test", options: defaultOptions, disabled: true },
      })
      screen.getAllByRole("radio").forEach((radio) => {
        expect(radio).toBeDisabled()
      })
    })

    it("disables individual options", () => {
      const optionsWithDisabled = [
        { value: "a", label: "A" },
        { value: "b", label: "B", disabled: true },
        { value: "c", label: "C" },
      ]
      render(RadioGroup, {
        props: { name: "test", options: optionsWithDisabled },
      })
      expect(screen.getByLabelText("A")).not.toBeDisabled()
      expect(screen.getByLabelText("B")).toBeDisabled()
      expect(screen.getByLabelText("C")).not.toBeDisabled()
    })
  })

  describe("validation state", () => {
    it("does not have aria-invalid when valid", () => {
      render(RadioGroup, { props: { name: "test", options: defaultOptions } })
      expect(screen.getByRole("radiogroup")).not.toHaveAttribute("aria-invalid")
    })

    it("has aria-invalid when invalid", () => {
      render(RadioGroup, {
        props: { name: "test", options: defaultOptions, invalid: true },
      })
      expect(screen.getByRole("radiogroup")).toHaveAttribute(
        "aria-invalid",
        "true",
      )
    })
  })

  describe("orientation", () => {
    it("has vertical layout by default", () => {
      const { container } = render(RadioGroup, {
        props: { name: "test", options: defaultOptions },
      })
      const fieldset = container.querySelector("fieldset")
      expect(fieldset).toHaveClass("flex-col")
    })

    it("can have horizontal layout", () => {
      const { container } = render(RadioGroup, {
        props: {
          name: "test",
          options: defaultOptions,
          orientation: "horizontal",
        },
      })
      const fieldset = container.querySelector("fieldset")
      expect(fieldset).toHaveClass("flex-row")
    })
  })

  describe("form integration", () => {
    it("all radios have same name", () => {
      const { container } = render(RadioGroup, {
        props: { name: "plan", options: defaultOptions },
      })
      const radios = container.querySelectorAll('input[name="plan"]')
      expect(radios).toHaveLength(3)
    })

    it("each radio has correct value", () => {
      const { container } = render(RadioGroup, {
        props: { name: "test", options: defaultOptions },
      })
      expect(
        container.querySelector('input[value="option1"]'),
      ).toBeInTheDocument()
      expect(
        container.querySelector('input[value="option2"]'),
      ).toBeInTheDocument()
      expect(
        container.querySelector('input[value="option3"]'),
      ).toBeInTheDocument()
    })
  })

  describe("custom styling", () => {
    it("applies custom class to fieldset", () => {
      const { container } = render(RadioGroup, {
        props: { name: "test", options: defaultOptions, class: "gap-6" },
      })
      expect(container.querySelector("fieldset")).toHaveClass("gap-6")
    })

    it("applies optionClass to labels", () => {
      const { container } = render(RadioGroup, {
        props: {
          name: "test",
          options: defaultOptions,
          optionClass: "p-4 border",
        },
      })
      const labels = container.querySelectorAll("label")
      labels.forEach((label) => {
        expect(label).toHaveClass("p-4")
        expect(label).toHaveClass("border")
      })
    })

    it("applies inputClass to radio inputs", () => {
      const { container } = render(RadioGroup, {
        props: {
          name: "test",
          options: defaultOptions,
          inputClass: "scale-110",
        },
      })
      const inputs = container.querySelectorAll("input")
      inputs.forEach((input) => {
        expect(input).toHaveClass("scale-110")
      })
    })
  })

  describe("id generation", () => {
    it("generates unique ids for each option", () => {
      render(RadioGroup, {
        props: { name: "test", options: defaultOptions, id: "group" },
      })
      expect(screen.getByLabelText("Option 1")).toHaveAttribute(
        "id",
        "group-option1",
      )
      expect(screen.getByLabelText("Option 2")).toHaveAttribute(
        "id",
        "group-option2",
      )
      expect(screen.getByLabelText("Option 3")).toHaveAttribute(
        "id",
        "group-option3",
      )
    })

    it("uses name as fallback for id prefix", () => {
      render(RadioGroup, { props: { name: "plan", options: defaultOptions } })
      expect(screen.getByLabelText("Option 1")).toHaveAttribute(
        "id",
        "radio-plan-option1",
      )
    })
  })
})
