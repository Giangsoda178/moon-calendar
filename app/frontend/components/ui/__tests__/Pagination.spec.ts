/**
 * Pagination component tests
 */

import { fireEvent, render, screen } from "@testing-library/svelte"
import { beforeAll, describe, expect, it, vi } from "vitest"

import Pagination from "../Pagination.svelte"

// Mock window.matchMedia for IsMobile rune
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false, // Always return desktop mode for tests
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

describe("Pagination", () => {
  describe("rendering", () => {
    it("renders navigation element", () => {
      render(Pagination, { props: { totalItems: 100, perPage: 10 } })
      expect(screen.getByRole("navigation")).toBeInTheDocument()
    })

    it("has aria-label", () => {
      render(Pagination, { props: { totalItems: 100, perPage: 10 } })
      expect(screen.getByRole("navigation")).toHaveAttribute(
        "aria-label",
        "Pagination",
      )
    })

    it("renders page buttons", () => {
      render(Pagination, { props: { totalItems: 50, perPage: 10, page: 1 } })
      // Should show pages 1-5
      expect(screen.getByRole("button", { name: "Page 1" })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Page 5" })).toBeInTheDocument()
    })
  })

  describe("navigation buttons", () => {
    it("renders previous button", () => {
      render(Pagination, { props: { totalItems: 100, perPage: 10 } })
      expect(
        screen.getByRole("button", { name: "Previous page" }),
      ).toBeInTheDocument()
    })

    it("renders next button", () => {
      render(Pagination, { props: { totalItems: 100, perPage: 10 } })
      expect(
        screen.getByRole("button", { name: "Next page" }),
      ).toBeInTheDocument()
    })

    it("renders first/last buttons when showEdges=true", () => {
      render(Pagination, {
        props: { totalItems: 100, perPage: 10, showEdges: true },
      })
      expect(
        screen.getByRole("button", { name: "First page" }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: "Last page" }),
      ).toBeInTheDocument()
    })

    it("hides first/last buttons when showEdges=false", () => {
      render(Pagination, {
        props: { totalItems: 100, perPage: 10, showEdges: false },
      })
      expect(
        screen.queryByRole("button", { name: "First page" }),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole("button", { name: "Last page" }),
      ).not.toBeInTheDocument()
    })
  })

  describe("disabled states", () => {
    it("disables previous on first page", () => {
      render(Pagination, { props: { totalItems: 100, perPage: 10, page: 1 } })
      expect(
        screen.getByRole("button", { name: "Previous page" }),
      ).toBeDisabled()
    })

    it("disables first page button on first page", () => {
      render(Pagination, { props: { totalItems: 100, perPage: 10, page: 1 } })
      expect(screen.getByRole("button", { name: "First page" })).toBeDisabled()
    })

    it("disables next on last page", () => {
      render(Pagination, { props: { totalItems: 100, perPage: 10, page: 10 } })
      expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled()
    })

    it("disables last page button on last page", () => {
      render(Pagination, { props: { totalItems: 100, perPage: 10, page: 10 } })
      expect(screen.getByRole("button", { name: "Last page" })).toBeDisabled()
    })
  })

  describe("page navigation", () => {
    it("goes to next page on next click", async () => {
      const onChange = vi.fn()
      render(Pagination, {
        props: { totalItems: 100, perPage: 10, page: 1, onchange: onChange },
      })
      await fireEvent.click(screen.getByRole("button", { name: "Next page" }))
      expect(onChange).toHaveBeenCalledWith(2)
    })

    it("goes to previous page on previous click", async () => {
      const onChange = vi.fn()
      render(Pagination, {
        props: { totalItems: 100, perPage: 10, page: 5, onchange: onChange },
      })
      await fireEvent.click(
        screen.getByRole("button", { name: "Previous page" }),
      )
      expect(onChange).toHaveBeenCalledWith(4)
    })

    it("goes to first page on first click", async () => {
      const onChange = vi.fn()
      render(Pagination, {
        props: { totalItems: 100, perPage: 10, page: 5, onchange: onChange },
      })
      await fireEvent.click(screen.getByRole("button", { name: "First page" }))
      expect(onChange).toHaveBeenCalledWith(1)
    })

    it("goes to last page on last click", async () => {
      const onChange = vi.fn()
      render(Pagination, {
        props: { totalItems: 100, perPage: 10, page: 1, onchange: onChange },
      })
      await fireEvent.click(screen.getByRole("button", { name: "Last page" }))
      expect(onChange).toHaveBeenCalledWith(10)
    })

    it("goes to specific page on page button click", async () => {
      const onChange = vi.fn()
      render(Pagination, {
        props: { totalItems: 50, perPage: 10, page: 1, onchange: onChange },
      })
      await fireEvent.click(screen.getByRole("button", { name: "Page 3" }))
      expect(onChange).toHaveBeenCalledWith(3)
    })
  })

  describe("current page indicator", () => {
    it("marks current page with aria-current", () => {
      render(Pagination, { props: { totalItems: 50, perPage: 10, page: 3 } })
      expect(screen.getByRole("button", { name: "Page 3" })).toHaveAttribute(
        "aria-current",
        "page",
      )
    })

    it("other pages do not have aria-current", () => {
      render(Pagination, { props: { totalItems: 50, perPage: 10, page: 3 } })
      expect(
        screen.getByRole("button", { name: "Page 1" }),
      ).not.toHaveAttribute("aria-current")
    })
  })

  describe("ellipsis", () => {
    it("shows ellipsis for many pages", () => {
      render(Pagination, { props: { totalItems: 200, perPage: 10, page: 10 } })
      expect(screen.getAllByText("...")).toHaveLength(2)
    })

    it("hides left ellipsis near start", () => {
      render(Pagination, { props: { totalItems: 200, perPage: 10, page: 1 } })
      // Only right ellipsis
      expect(screen.getAllByText("...")).toHaveLength(1)
    })

    it("hides right ellipsis near end", () => {
      render(Pagination, { props: { totalItems: 200, perPage: 10, page: 20 } })
      // Only left ellipsis
      expect(screen.getAllByText("...")).toHaveLength(1)
    })
  })

  describe("total pages calculation", () => {
    it("calculates total pages from totalItems and perPage", () => {
      render(Pagination, { props: { totalItems: 45, perPage: 10, page: 1 } })
      expect(screen.getByRole("button", { name: "Page 5" })).toBeInTheDocument()
    })

    it("uses totalPages prop if provided", () => {
      render(Pagination, { props: { totalPages: 8, page: 1 } })
      expect(
        screen.getByRole("button", { name: "Last page" }),
      ).toBeInTheDocument()
    })
  })

  describe("pagy integration", () => {
    it("uses pagy data when provided", () => {
      const pagy = { page: 3, last: 10, count: 100 }
      render(Pagination, { props: { pagy } })
      expect(screen.getByRole("button", { name: "Page 3" })).toHaveAttribute(
        "aria-current",
        "page",
      )
    })
  })

  describe("custom styling", () => {
    it("applies custom class", () => {
      const { container } = render(Pagination, {
        props: { totalItems: 50, perPage: 10, class: "justify-center" },
      })
      expect(container.querySelector("nav")).toHaveClass("justify-center")
    })
  })
})
