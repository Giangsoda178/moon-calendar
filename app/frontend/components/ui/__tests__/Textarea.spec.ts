/**
 * Textarea component tests
 */

import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"

import Textarea from "../Textarea.svelte"

describe("Textarea", () => {
  describe("rendering", () => {
    it("renders textarea element", () => {
      render(Textarea)
      expect(screen.getByRole("textbox")).toBeInTheDocument()
    })

    it("applies textarea base class", () => {
      const { container } = render(Textarea)
      expect(container.querySelector(".textarea")).toBeInTheDocument()
    })
  })

  describe("value handling", () => {
    it("accepts initial value", () => {
      render(Textarea, { props: { value: "Hello world" } })
      expect(screen.getByRole("textbox")).toHaveValue("Hello world")
    })

    it("updates value on input", async () => {
      render(Textarea, { props: { value: "" } })
      const textarea = screen.getByRole("textbox")
      await fireEvent.input(textarea, { target: { value: "New text" } })
      expect(textarea).toHaveValue("New text")
    })

    it("handles multiline text", () => {
      const multilineText = "Line 1\nLine 2\nLine 3"
      render(Textarea, { props: { value: multilineText } })
      expect(screen.getByRole("textbox")).toHaveValue(multilineText)
    })
  })

  describe("validation state", () => {
    it("does not have aria-invalid when valid", () => {
      render(Textarea)
      expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid")
    })

    it("has aria-invalid when invalid", () => {
      render(Textarea, { props: { invalid: true } })
      expect(screen.getByRole("textbox")).toHaveAttribute(
        "aria-invalid",
        "true",
      )
    })
  })

  describe("native attributes", () => {
    it("applies placeholder", () => {
      render(Textarea, { props: { placeholder: "Enter message..." } })
      expect(
        screen.getByPlaceholderText("Enter message..."),
      ).toBeInTheDocument()
    })

    it("applies disabled state", () => {
      render(Textarea, { props: { disabled: true } })
      expect(screen.getByRole("textbox")).toBeDisabled()
    })

    it("applies required attribute", () => {
      render(Textarea, { props: { required: true } })
      expect(screen.getByRole("textbox")).toBeRequired()
    })

    it("applies name attribute", () => {
      const { container } = render(Textarea, { props: { name: "message" } })
      expect(
        container.querySelector('textarea[name="message"]'),
      ).toBeInTheDocument()
    })

    it("applies rows attribute", () => {
      const { container } = render(Textarea, { props: { rows: 6 } })
      expect(container.querySelector("textarea")).toHaveAttribute("rows", "6")
    })
  })

  describe("custom styling", () => {
    it("applies custom class", () => {
      const { container } = render(Textarea, {
        props: { class: "resize-none" },
      })
      expect(container.querySelector(".resize-none")).toBeInTheDocument()
    })

    it("preserves textarea class when custom class added", () => {
      const { container } = render(Textarea, { props: { class: "h-32" } })
      const textarea = container.querySelector("textarea")
      expect(textarea).toHaveClass("textarea")
      expect(textarea).toHaveClass("h-32")
    })
  })
})
