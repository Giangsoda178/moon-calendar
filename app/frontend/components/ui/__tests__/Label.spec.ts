/**
 * Label component tests
 */

import { render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"

import Label from "../Label.svelte"

import { textSnippet } from "./test-utils"

describe("Label", () => {
  describe("rendering", () => {
    it("renders label element", () => {
      const { container } = render(Label, {
        props: { children: textSnippet("Email") },
      })
      expect(container.querySelector("label")).toBeInTheDocument()
    })

    it("renders children content", () => {
      render(Label, { props: { children: textSnippet("Username") } })
      expect(screen.getByText("Username")).toBeInTheDocument()
    })

    it("has label base class", () => {
      const { container } = render(Label, {
        props: { children: textSnippet("Name") },
      })
      expect(container.querySelector(".label")).toBeInTheDocument()
    })
  })

  describe("for attribute", () => {
    it("renders without for attribute when not provided", () => {
      const { container } = render(Label, {
        props: { children: textSnippet("Label") },
      })
      expect(container.querySelector("label")).not.toHaveAttribute("for")
    })

    it("applies for attribute when provided", () => {
      const { container } = render(Label, {
        props: { for: "email-input", children: textSnippet("Email") },
      })
      expect(container.querySelector("label")).toHaveAttribute(
        "for",
        "email-input",
      )
    })
  })

  describe("custom styling", () => {
    it("applies custom class", () => {
      const { container } = render(Label, {
        props: { class: "text-sm font-bold", children: textSnippet("Custom") },
      })
      const label = container.querySelector("label")
      expect(label).toHaveClass("text-sm")
      expect(label).toHaveClass("font-bold")
    })

    it("preserves label class when custom class added", () => {
      const { container } = render(Label, {
        props: { class: "cursor-pointer", children: textSnippet("Click") },
      })
      const label = container.querySelector("label")
      expect(label).toHaveClass("label")
      expect(label).toHaveClass("cursor-pointer")
    })
  })
})
