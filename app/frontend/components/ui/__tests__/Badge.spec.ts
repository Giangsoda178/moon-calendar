/**
 * Badge component tests
 */

import { render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"

import Badge from "../Badge.svelte"

import { textSnippet } from "./test-utils"

describe("Badge", () => {
  describe("rendering", () => {
    it("renders as span by default (no href)", () => {
      const { container } = render(Badge, {
        props: { children: textSnippet("Status") },
      })
      const span = container.querySelector("span.badge")
      expect(span).toBeInTheDocument()
    })

    it("renders children content", () => {
      render(Badge, { props: { children: textSnippet("New") } })
      expect(screen.getByText("New")).toBeInTheDocument()
    })

    it("applies default variant class", () => {
      const { container } = render(Badge, {
        props: { children: textSnippet("Test") },
      })
      expect(container.querySelector(".badge")).toBeInTheDocument()
    })
  })

  describe("variants", () => {
    it("applies primary variant (default)", () => {
      const { container } = render(Badge, {
        props: { variant: "primary", children: textSnippet("Primary") },
      })
      expect(container.querySelector(".badge")).toBeInTheDocument()
    })

    it("applies secondary variant", () => {
      const { container } = render(Badge, {
        props: { variant: "secondary", children: textSnippet("Secondary") },
      })
      expect(container.querySelector(".badge-secondary")).toBeInTheDocument()
    })

    it("applies destructive variant", () => {
      const { container } = render(Badge, {
        props: { variant: "destructive", children: textSnippet("Error") },
      })
      expect(container.querySelector(".badge-destructive")).toBeInTheDocument()
    })

    it("applies outline variant", () => {
      const { container } = render(Badge, {
        props: { variant: "outline", children: textSnippet("v1.0") },
      })
      expect(container.querySelector(".badge-outline")).toBeInTheDocument()
    })
  })

  describe("link behavior", () => {
    it("renders as link when href provided", () => {
      render(Badge, {
        props: {
          href: "https://example.com",
          external: true,
          children: textSnippet("Link"),
        },
      })
      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("href", "https://example.com")
    })

    it("adds external link attributes when external=true", () => {
      render(Badge, {
        props: {
          href: "https://example.com",
          external: true,
          children: textSnippet("External"),
        },
      })
      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("target", "_blank")
      expect(link).toHaveAttribute("rel", "noopener noreferrer")
    })
  })

  describe("custom styling", () => {
    it("applies custom class", () => {
      const { container } = render(Badge, {
        props: { class: "custom-class", children: textSnippet("Custom") },
      })
      expect(container.querySelector(".custom-class")).toBeInTheDocument()
    })
  })
})
