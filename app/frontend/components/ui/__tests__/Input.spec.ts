/**
 * Input component tests
 */

import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"

import Input from "../Input.svelte"

describe("Input", () => {
  describe("rendering", () => {
    it("renders input element", () => {
      render(Input)
      expect(screen.getByRole("textbox")).toBeInTheDocument()
    })

    it("renders with text type by default", () => {
      const { container } = render(Input)
      expect(container.querySelector('input[type="text"]')).toBeInTheDocument()
    })

    it("applies input base class", () => {
      const { container } = render(Input)
      expect(container.querySelector(".input")).toBeInTheDocument()
    })
  })

  describe("input types", () => {
    it("renders email type", () => {
      const { container } = render(Input, { props: { type: "email" } })
      expect(container.querySelector('input[type="email"]')).toBeInTheDocument()
    })

    it("renders password type", () => {
      const { container } = render(Input, { props: { type: "password" } })
      expect(
        container.querySelector('input[type="password"]'),
      ).toBeInTheDocument()
    })

    it("renders number type", () => {
      render(Input, { props: { type: "number" } })
      expect(screen.getByRole("spinbutton")).toBeInTheDocument()
    })
  })

  describe("value handling", () => {
    it("accepts initial value", () => {
      render(Input, { props: { value: "hello" } })
      expect(screen.getByRole("textbox")).toHaveValue("hello")
    })

    it("updates value on input", async () => {
      render(Input, { props: { value: "" } })
      const input = screen.getByRole("textbox")
      await fireEvent.input(input, { target: { value: "world" } })
      expect(input).toHaveValue("world")
    })
  })

  describe("validation state", () => {
    it("does not have aria-invalid when valid", () => {
      render(Input)
      expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid")
    })

    it("has aria-invalid when invalid", () => {
      render(Input, { props: { invalid: true } })
      expect(screen.getByRole("textbox")).toHaveAttribute(
        "aria-invalid",
        "true",
      )
    })
  })

  describe("native attributes", () => {
    it("applies placeholder", () => {
      render(Input, { props: { placeholder: "Enter text..." } })
      expect(screen.getByPlaceholderText("Enter text...")).toBeInTheDocument()
    })

    it("applies disabled state", () => {
      render(Input, { props: { disabled: true } })
      expect(screen.getByRole("textbox")).toBeDisabled()
    })

    it("applies required attribute", () => {
      render(Input, { props: { required: true } })
      expect(screen.getByRole("textbox")).toBeRequired()
    })

    it("applies name attribute", () => {
      const { container } = render(Input, { props: { name: "username" } })
      expect(
        container.querySelector('input[name="username"]'),
      ).toBeInTheDocument()
    })

    it("applies id attribute", () => {
      render(Input, { props: { id: "email-input" } })
      expect(screen.getByRole("textbox")).toHaveAttribute("id", "email-input")
    })
  })

  describe("custom styling", () => {
    it("applies custom class", () => {
      const { container } = render(Input, { props: { class: "w-full" } })
      expect(container.querySelector(".w-full")).toBeInTheDocument()
    })

    it("preserves input class when custom class added", () => {
      const { container } = render(Input, { props: { class: "custom" } })
      const input = container.querySelector("input")
      expect(input).toHaveClass("input")
      expect(input).toHaveClass("custom")
    })
  })
})
