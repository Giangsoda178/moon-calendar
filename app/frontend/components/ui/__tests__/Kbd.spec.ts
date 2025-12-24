/**
 * Kbd component tests
 */

import { render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"

import Kbd from "../Kbd.svelte"

import { textSnippet } from "./test-utils"

describe("Kbd", () => {
  describe("rendering", () => {
    it("renders kbd element", () => {
      const { container } = render(Kbd, {
        props: { children: textSnippet("⌘K") },
      })
      expect(container.querySelector("kbd")).toBeInTheDocument()
    })

    it("renders children content", () => {
      render(Kbd, { props: { children: textSnippet("Enter") } })
      expect(screen.getByText("Enter")).toBeInTheDocument()
    })

    it("has kbd base class", () => {
      const { container } = render(Kbd, {
        props: { children: textSnippet("Esc") },
      })
      expect(container.querySelector(".kbd")).toBeInTheDocument()
    })
  })

  describe("custom styling", () => {
    it("applies custom class", () => {
      const { container } = render(Kbd, {
        props: { class: "text-lg", children: textSnippet("A") },
      })
      expect(container.querySelector(".text-lg")).toBeInTheDocument()
    })

    it("preserves kbd class when custom class added", () => {
      const { container } = render(Kbd, {
        props: { class: "custom", children: textSnippet("B") },
      })
      const kbd = container.querySelector("kbd")
      expect(kbd).toHaveClass("kbd")
      expect(kbd).toHaveClass("custom")
    })
  })

  describe("content variations", () => {
    it("renders modifier keys", () => {
      render(Kbd, { props: { children: textSnippet("⌘") } })
      expect(screen.getByText("⌘")).toBeInTheDocument()
    })

    it("renders special keys", () => {
      render(Kbd, { props: { children: textSnippet("⏎") } })
      expect(screen.getByText("⏎")).toBeInTheDocument()
    })
  })
})
