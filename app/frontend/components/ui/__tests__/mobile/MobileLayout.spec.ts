/**
 * MobileLayout component tests
 */

import { render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"

import MobileLayout from "../../mobile/MobileLayout.svelte"
import { textSnippet } from "../test-utils"

describe("MobileLayout", () => {
  const defaultChildren = textSnippet("Main content")

  describe("rendering", () => {
    it("renders layout container", () => {
      const { container } = render(MobileLayout, {
        props: { children: defaultChildren },
      })
      expect(container.querySelector(".mobile-layout")).toBeInTheDocument()
    })

    it("renders children content", () => {
      render(MobileLayout, { props: { children: defaultChildren } })
      expect(screen.getByText("Main content")).toBeInTheDocument()
    })

    it("renders main element", () => {
      const { container } = render(MobileLayout, {
        props: { children: defaultChildren },
      })
      expect(container.querySelector("main")).toBeInTheDocument()
    })
  })

  describe("header slot", () => {
    it("renders header when provided", () => {
      const header = textSnippet("Header content")
      render(MobileLayout, { props: { header, children: defaultChildren } })
      expect(screen.getByText("Header content")).toBeInTheDocument()
    })

    it("wraps header in header element", () => {
      const header = textSnippet("Header content")
      const { container } = render(MobileLayout, {
        props: { header, children: defaultChildren },
      })
      expect(container.querySelector("header")).toBeInTheDocument()
    })

    it("header has top safe area padding", () => {
      const header = textSnippet("Header content")
      const { container } = render(MobileLayout, {
        props: { header, children: defaultChildren },
      })
      expect(container.querySelector("header")).toHaveClass("pt-safe")
    })

    it("applies safe area spacer when no header", () => {
      const { container } = render(MobileLayout, {
        props: { children: defaultChildren },
      })
      // Should have pt-safe spacer div when no header
      expect(container.querySelector(".pt-safe")).toBeInTheDocument()
    })
  })

  describe("footer slot", () => {
    it("renders footer when provided", () => {
      const footer = textSnippet("Footer content")
      render(MobileLayout, { props: { footer, children: defaultChildren } })
      expect(screen.getByText("Footer content")).toBeInTheDocument()
    })

    it("wraps footer in footer element", () => {
      const footer = textSnippet("Footer content")
      const { container } = render(MobileLayout, {
        props: { footer, children: defaultChildren },
      })
      expect(container.querySelector("footer")).toBeInTheDocument()
    })

    it("footer has bottom safe area padding", () => {
      const footer = textSnippet("Footer content")
      const { container } = render(MobileLayout, {
        props: { footer, children: defaultChildren },
      })
      expect(container.querySelector("footer")).toHaveClass("pb-safe")
    })

    it("applies safe area spacer when no footer", () => {
      const { container } = render(MobileLayout, {
        props: { children: defaultChildren },
      })
      // Should have pb-safe spacer div when no footer
      expect(container.querySelector(".pb-safe")).toBeInTheDocument()
    })
  })

  describe("layout structure", () => {
    it("uses flex column layout", () => {
      const { container } = render(MobileLayout, {
        props: { children: defaultChildren },
      })
      expect(container.querySelector(".mobile-layout")).toHaveClass("flex-col")
    })

    it("takes full height", () => {
      const { container } = render(MobileLayout, {
        props: { children: defaultChildren },
      })
      expect(container.querySelector(".mobile-layout")).toHaveClass("h-full")
    })

    it("main area is flex-1 for expansion", () => {
      const { container } = render(MobileLayout, {
        props: { children: defaultChildren },
      })
      expect(container.querySelector("main")).toHaveClass("flex-1")
    })

    it("main has overflow-y-auto for scrolling", () => {
      const { container } = render(MobileLayout, {
        props: { children: defaultChildren },
      })
      expect(container.querySelector("main")).toHaveClass("overflow-y-auto")
    })

    it("header shrinks to fit content", () => {
      const header = textSnippet("Header")
      const { container } = render(MobileLayout, {
        props: { header, children: defaultChildren },
      })
      expect(container.querySelector("header")).toHaveClass("shrink-0")
    })

    it("footer shrinks to fit content", () => {
      const footer = textSnippet("Footer")
      const { container } = render(MobileLayout, {
        props: { footer, children: defaultChildren },
      })
      expect(container.querySelector("footer")).toHaveClass("shrink-0")
    })
  })

  describe("overscroll behavior", () => {
    it("main has overscroll-contain", () => {
      const { container } = render(MobileLayout, {
        props: { children: defaultChildren },
      })
      expect(container.querySelector("main")).toHaveClass("overscroll-contain")
    })
  })

  describe("custom styling", () => {
    it("applies custom class to container", () => {
      const { container } = render(MobileLayout, {
        props: { children: defaultChildren, class: "bg-muted" },
      })
      expect(container.querySelector(".mobile-layout")).toHaveClass("bg-muted")
    })

    it("applies contentClass to main", () => {
      const { container } = render(MobileLayout, {
        props: { children: defaultChildren, contentClass: "p-4" },
      })
      expect(container.querySelector("main")).toHaveClass("p-4")
    })
  })

  describe("background", () => {
    it("has background color class", () => {
      const { container } = render(MobileLayout, {
        props: { children: defaultChildren },
      })
      expect(container.querySelector(".mobile-layout")).toHaveClass(
        "bg-background",
      )
    })
  })

  describe("full layout with header and footer", () => {
    it("renders complete layout structure", () => {
      const header = textSnippet("Header")
      const footer = textSnippet("Footer")
      const { container } = render(MobileLayout, {
        props: { header, footer, children: defaultChildren },
      })

      expect(container.querySelector("header")).toBeInTheDocument()
      expect(container.querySelector("main")).toBeInTheDocument()
      expect(container.querySelector("footer")).toBeInTheDocument()
      expect(screen.getByText("Header")).toBeInTheDocument()
      expect(screen.getByText("Main content")).toBeInTheDocument()
      expect(screen.getByText("Footer")).toBeInTheDocument()
    })
  })
})
