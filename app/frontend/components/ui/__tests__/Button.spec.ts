/**
 * Button component tests
 */

import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"

import Button from "../Button.svelte"

import { textSnippet } from "./test-utils"

describe("Button", () => {
  describe("rendering", () => {
    it("renders button element by default", () => {
      render(Button, { props: { children: textSnippet("Click me") } })
      expect(screen.getByRole("button")).toBeInTheDocument()
    })

    it("renders children content", () => {
      render(Button, { props: { children: textSnippet("Submit") } })
      expect(screen.getByText("Submit")).toBeInTheDocument()
    })

    it("has type=button by default", () => {
      render(Button, { props: { children: textSnippet("Button") } })
      expect(screen.getByRole("button")).toHaveAttribute("type", "button")
    })
  })

  describe("variants", () => {
    it("applies primary variant (default)", () => {
      const { container } = render(Button, {
        props: { children: textSnippet("Primary") },
      })
      expect(container.querySelector(".btn")).toBeInTheDocument()
    })

    it("applies secondary variant", () => {
      const { container } = render(Button, {
        props: { variant: "secondary", children: textSnippet("Secondary") },
      })
      expect(container.querySelector(".btn-secondary")).toBeInTheDocument()
    })

    it("applies destructive variant", () => {
      const { container } = render(Button, {
        props: { variant: "destructive", children: textSnippet("Delete") },
      })
      expect(container.querySelector(".btn-destructive")).toBeInTheDocument()
    })

    it("applies outline variant", () => {
      const { container } = render(Button, {
        props: { variant: "outline", children: textSnippet("Outline") },
      })
      expect(container.querySelector(".btn-outline")).toBeInTheDocument()
    })

    it("applies ghost variant", () => {
      const { container } = render(Button, {
        props: { variant: "ghost", children: textSnippet("Ghost") },
      })
      expect(container.querySelector(".btn-ghost")).toBeInTheDocument()
    })

    it("applies link variant", () => {
      const { container } = render(Button, {
        props: { variant: "link", children: textSnippet("Link") },
      })
      expect(container.querySelector(".btn-link")).toBeInTheDocument()
    })
  })

  describe("sizes", () => {
    it("applies sm size", () => {
      const { container } = render(Button, {
        props: { size: "sm", children: textSnippet("Small") },
      })
      expect(container.querySelector(".btn-sm")).toBeInTheDocument()
    })

    it("applies lg size", () => {
      const { container } = render(Button, {
        props: { size: "lg", children: textSnippet("Large") },
      })
      expect(container.querySelector(".btn-lg")).toBeInTheDocument()
    })

    it("applies icon size", () => {
      const { container } = render(Button, {
        props: { size: "icon", children: textSnippet("X") },
      })
      expect(container.querySelector(".btn-icon")).toBeInTheDocument()
    })
  })

  describe("button types", () => {
    it("can be submit type", () => {
      render(Button, {
        props: { type: "submit", children: textSnippet("Submit") },
      })
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit")
    })

    it("can be reset type", () => {
      render(Button, {
        props: { type: "reset", children: textSnippet("Reset") },
      })
      expect(screen.getByRole("button")).toHaveAttribute("type", "reset")
    })
  })

  describe("disabled state", () => {
    it("applies disabled attribute", () => {
      render(Button, {
        props: { disabled: true, children: textSnippet("Disabled") },
      })
      expect(screen.getByRole("button")).toBeDisabled()
    })

    it("is disabled when loading", () => {
      render(Button, {
        props: { loading: true, children: textSnippet("Loading") },
      })
      expect(screen.getByRole("button")).toBeDisabled()
    })
  })

  describe("loading state", () => {
    it("shows spinner when loading", () => {
      const { container } = render(Button, {
        props: { loading: true, children: textSnippet("Loading...") },
      })
      expect(container.querySelector(".animate-spin")).toBeInTheDocument()
    })

    it("still shows children when loading", () => {
      render(Button, {
        props: { loading: true, children: textSnippet("Saving") },
      })
      expect(screen.getByText("Saving")).toBeInTheDocument()
    })
  })

  describe("click handling", () => {
    it("calls onclick when clicked", async () => {
      const handleClick = vi.fn()
      render(Button, {
        props: { onclick: handleClick, children: textSnippet("Click") },
      })
      await fireEvent.click(screen.getByRole("button"))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it("disabled button has disabled attribute", () => {
      const handleClick = vi.fn()
      render(Button, {
        props: {
          onclick: handleClick,
          disabled: true,
          children: textSnippet("Click"),
        },
      })
      // Note: In browsers, disabled buttons don't fire click events
      // Here we verify the disabled attribute is set correctly
      expect(screen.getByRole("button")).toBeDisabled()
    })
  })

  describe("link behavior", () => {
    it("renders as anchor when href provided", () => {
      render(Button, { props: { href: "/page", children: textSnippet("Go") } })
      expect(screen.getByRole("link")).toBeInTheDocument()
    })

    it("sets href attribute", () => {
      render(Button, {
        props: { href: "/dashboard", children: textSnippet("Dashboard") },
      })
      // Links are resolved to full URLs in jsdom
      expect(screen.getByRole("link").getAttribute("href")).toContain(
        "/dashboard",
      )
    })

    it("adds external link attributes when external=true", () => {
      render(Button, {
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

    it("renders as button when disabled even with href", () => {
      render(Button, {
        props: { href: "/page", disabled: true, children: textSnippet("Link") },
      })
      expect(screen.getByRole("button")).toBeInTheDocument()
    })
  })

  describe("active state", () => {
    it("uses activeVariant when active", () => {
      const { container } = render(Button, {
        props: {
          active: true,
          variant: "ghost",
          activeVariant: "secondary",
          children: textSnippet("Active"),
        },
      })
      expect(container.querySelector(".btn-secondary")).toBeInTheDocument()
    })

    it("uses default variant when not active", () => {
      const { container } = render(Button, {
        props: {
          active: false,
          variant: "ghost",
          activeVariant: "secondary",
          children: textSnippet("Inactive"),
        },
      })
      expect(container.querySelector(".btn-ghost")).toBeInTheDocument()
    })
  })

  describe("custom styling", () => {
    it("applies custom class", () => {
      const { container } = render(Button, {
        props: { class: "w-full", children: textSnippet("Full Width") },
      })
      expect(container.querySelector(".w-full")).toBeInTheDocument()
    })
  })

  describe("rest props", () => {
    it("passes data attributes", () => {
      render(Button, {
        props: { "data-testid": "my-button", children: textSnippet("Test") },
      })
      expect(screen.getByTestId("my-button")).toBeInTheDocument()
    })

    it("passes aria attributes", () => {
      render(Button, {
        props: { "aria-label": "Close dialog", children: textSnippet("X") },
      })
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "Close dialog",
      )
    })

    it("passes id attribute", () => {
      render(Button, {
        props: { id: "submit-btn", children: textSnippet("Submit") },
      })
      expect(screen.getByRole("button")).toHaveAttribute("id", "submit-btn")
    })
  })
})
