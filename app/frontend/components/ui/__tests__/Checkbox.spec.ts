/**
 * Checkbox component tests
 */

import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"

import Checkbox from "../Checkbox.svelte"

describe("Checkbox", () => {
  describe("rendering", () => {
    it("renders checkbox input", () => {
      render(Checkbox)
      expect(screen.getByRole("checkbox")).toBeInTheDocument()
    })

    it("renders as checkbox type", () => {
      const { container } = render(Checkbox)
      expect(
        container.querySelector('input[type="checkbox"]'),
      ).toBeInTheDocument()
    })

    it("applies input base class", () => {
      const { container } = render(Checkbox)
      expect(container.querySelector(".input")).toBeInTheDocument()
    })
  })

  describe("checked state", () => {
    it("is unchecked by default", () => {
      render(Checkbox)
      expect(screen.getByRole("checkbox")).not.toBeChecked()
    })

    it("can be checked initially", () => {
      render(Checkbox, { props: { checked: true } })
      expect(screen.getByRole("checkbox")).toBeChecked()
    })

    it("toggles checked state on click", async () => {
      render(Checkbox)
      const checkbox = screen.getByRole("checkbox")
      expect(checkbox).not.toBeChecked()
      await fireEvent.click(checkbox)
      expect(checkbox).toBeChecked()
    })
  })

  describe("validation state", () => {
    it("does not have aria-invalid when valid", () => {
      render(Checkbox)
      expect(screen.getByRole("checkbox")).not.toHaveAttribute("aria-invalid")
    })

    it("has aria-invalid when invalid", () => {
      render(Checkbox, { props: { invalid: true } })
      expect(screen.getByRole("checkbox")).toHaveAttribute(
        "aria-invalid",
        "true",
      )
    })
  })

  describe("native attributes", () => {
    it("applies disabled state", () => {
      render(Checkbox, { props: { disabled: true } })
      expect(screen.getByRole("checkbox")).toBeDisabled()
    })

    it("applies required attribute", () => {
      render(Checkbox, { props: { required: true } })
      expect(screen.getByRole("checkbox")).toBeRequired()
    })

    it("applies name attribute", () => {
      const { container } = render(Checkbox, { props: { name: "terms" } })
      expect(container.querySelector('input[name="terms"]')).toBeInTheDocument()
    })

    it("applies id attribute", () => {
      render(Checkbox, { props: { id: "agree-checkbox" } })
      expect(screen.getByRole("checkbox")).toHaveAttribute(
        "id",
        "agree-checkbox",
      )
    })

    it("applies value attribute for form submission", () => {
      const { container } = render(Checkbox, { props: { value: "1" } })
      expect(container.querySelector("input")).toHaveAttribute("value", "1")
    })
  })

  describe("custom styling", () => {
    it("applies custom class", () => {
      const { container } = render(Checkbox, { props: { class: "mr-2" } })
      expect(container.querySelector(".mr-2")).toBeInTheDocument()
    })

    it("preserves input class when custom class added", () => {
      const { container } = render(Checkbox, { props: { class: "custom" } })
      const checkbox = container.querySelector("input")
      expect(checkbox).toHaveClass("input")
      expect(checkbox).toHaveClass("custom")
    })
  })
})
