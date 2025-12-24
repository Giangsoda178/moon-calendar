/**
 * SafeArea component tests
 */

import { render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"

import SafeArea from "../../mobile/SafeArea.svelte"
import { textSnippet } from "../test-utils"

describe("SafeArea", () => {
  const defaultChildren = textSnippet("Content")

  describe("rendering", () => {
    it("renders div wrapper", () => {
      const { container } = render(SafeArea, {
        props: { children: defaultChildren },
      })
      expect(container.querySelector("div")).toBeInTheDocument()
    })

    it("renders children content", () => {
      render(SafeArea, { props: { children: defaultChildren } })
      expect(screen.getByText("Content")).toBeInTheDocument()
    })
  })

  describe("individual safe areas", () => {
    it("applies top safe area padding", () => {
      const { container } = render(SafeArea, {
        props: { top: true, children: defaultChildren },
      })
      expect(container.firstElementChild).toHaveClass("pt-safe")
    })

    it("applies bottom safe area padding", () => {
      const { container } = render(SafeArea, {
        props: { bottom: true, children: defaultChildren },
      })
      expect(container.firstElementChild).toHaveClass("pb-safe")
    })

    it("applies left safe area padding", () => {
      const { container } = render(SafeArea, {
        props: { left: true, children: defaultChildren },
      })
      expect(container.firstElementChild).toHaveClass("pl-safe")
    })

    it("applies right safe area padding", () => {
      const { container } = render(SafeArea, {
        props: { right: true, children: defaultChildren },
      })
      expect(container.firstElementChild).toHaveClass("pr-safe")
    })
  })

  describe("combined safe areas", () => {
    it("applies top and bottom together", () => {
      const { container } = render(SafeArea, {
        props: { top: true, bottom: true, children: defaultChildren },
      })
      expect(container.firstElementChild).toHaveClass("pt-safe")
      expect(container.firstElementChild).toHaveClass("pb-safe")
    })

    it("applies left and right together", () => {
      const { container } = render(SafeArea, {
        props: { left: true, right: true, children: defaultChildren },
      })
      expect(container.firstElementChild).toHaveClass("pl-safe")
      expect(container.firstElementChild).toHaveClass("pr-safe")
    })

    it("applies all four sides individually", () => {
      const { container } = render(SafeArea, {
        props: {
          top: true,
          bottom: true,
          left: true,
          right: true,
          children: defaultChildren,
        },
      })
      expect(container.firstElementChild).toHaveClass("pt-safe")
      expect(container.firstElementChild).toHaveClass("pb-safe")
      expect(container.firstElementChild).toHaveClass("pl-safe")
      expect(container.firstElementChild).toHaveClass("pr-safe")
    })
  })

  describe("all prop", () => {
    it("applies all safe area padding with p-safe", () => {
      const { container } = render(SafeArea, {
        props: { all: true, children: defaultChildren },
      })
      expect(container.firstElementChild).toHaveClass("p-safe")
    })

    it("all overrides individual sides", () => {
      const { container } = render(SafeArea, {
        props: { all: true, top: true, children: defaultChildren },
      })
      // Should use p-safe instead of individual classes
      expect(container.firstElementChild).toHaveClass("p-safe")
      expect(container.firstElementChild).not.toHaveClass("pt-safe")
    })
  })

  describe("no safe areas", () => {
    it("applies no safe area classes by default", () => {
      const { container } = render(SafeArea, {
        props: { children: defaultChildren },
      })
      const element = container.firstElementChild!
      expect(element).not.toHaveClass("pt-safe")
      expect(element).not.toHaveClass("pb-safe")
      expect(element).not.toHaveClass("pl-safe")
      expect(element).not.toHaveClass("pr-safe")
      expect(element).not.toHaveClass("p-safe")
    })
  })

  describe("custom styling", () => {
    it("applies custom class", () => {
      const { container } = render(SafeArea, {
        props: { class: "bg-background", children: defaultChildren },
      })
      expect(container.firstElementChild).toHaveClass("bg-background")
    })

    it("combines custom class with safe area classes", () => {
      const { container } = render(SafeArea, {
        props: { top: true, class: "bg-background", children: defaultChildren },
      })
      expect(container.firstElementChild).toHaveClass("pt-safe")
      expect(container.firstElementChild).toHaveClass("bg-background")
    })
  })

  describe("common use cases", () => {
    it("top safe area for headers", () => {
      const { container } = render(SafeArea, {
        props: { top: true, class: "bg-background", children: defaultChildren },
      })
      expect(container.firstElementChild).toHaveClass("pt-safe")
      expect(container.firstElementChild).toHaveClass("bg-background")
    })

    it("bottom safe area for footers", () => {
      const { container } = render(SafeArea, {
        props: { bottom: true, children: defaultChildren },
      })
      expect(container.firstElementChild).toHaveClass("pb-safe")
    })

    it("all safe areas for full-screen content", () => {
      const { container } = render(SafeArea, {
        props: { all: true, children: defaultChildren },
      })
      expect(container.firstElementChild).toHaveClass("p-safe")
    })
  })
})
