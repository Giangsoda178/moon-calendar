/**
 * Breadcrumb component tests
 */

import { render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"

import Breadcrumb from "../Breadcrumb.svelte"

const defaultItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Electronics" },
]

describe("Breadcrumb", () => {
  describe("rendering", () => {
    it("renders ordered list", () => {
      const { container } = render(Breadcrumb, {
        props: { items: defaultItems },
      })
      expect(container.querySelector("ol")).toBeInTheDocument()
    })

    it("renders all breadcrumb items", () => {
      render(Breadcrumb, { props: { items: defaultItems } })
      expect(screen.getByText("Home")).toBeInTheDocument()
      expect(screen.getByText("Products")).toBeInTheDocument()
      expect(screen.getByText("Electronics")).toBeInTheDocument()
    })
  })

  describe("links", () => {
    it("renders items with href as links", () => {
      render(Breadcrumb, { props: { items: defaultItems } })
      expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
        "href",
        "/",
      )
      expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute(
        "href",
        "/products",
      )
    })

    it("renders current page (no href) as text", () => {
      render(Breadcrumb, { props: { items: defaultItems } })
      const currentItem = screen.getByText("Electronics")
      expect(currentItem.tagName).toBe("SPAN")
    })

    it("current page has foreground color", () => {
      render(Breadcrumb, { props: { items: defaultItems } })
      const currentItem = screen.getByText("Electronics")
      expect(currentItem).toHaveClass("text-foreground")
    })
  })

  describe("separators", () => {
    it("renders separators between items", () => {
      const { container } = render(Breadcrumb, {
        props: { items: defaultItems },
      })
      // 3 items = 2 separators
      const separators = container.querySelectorAll('[aria-hidden="true"]')
      expect(separators).toHaveLength(2)
    })

    it("renders custom separator when provided", () => {
      render(Breadcrumb, { props: { items: defaultItems, separator: "/" } })
      const separators = screen.getAllByText("/")
      expect(separators).toHaveLength(2)
    })

    it("renders ChevronRight icon by default", () => {
      const { container } = render(Breadcrumb, {
        props: { items: defaultItems },
      })
      expect(container.querySelectorAll("svg")).toHaveLength(2)
    })
  })

  describe("single item", () => {
    it("renders single item without separator", () => {
      const { container } = render(Breadcrumb, {
        props: { items: [{ label: "Home" }] },
      })
      expect(screen.getByText("Home")).toBeInTheDocument()
      expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0)
    })
  })

  describe("custom styling", () => {
    it("applies custom class", () => {
      const { container } = render(Breadcrumb, {
        props: { items: defaultItems, class: "mb-4" },
      })
      expect(container.querySelector("ol")).toHaveClass("mb-4")
    })
  })
})
