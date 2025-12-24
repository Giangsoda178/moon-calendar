/**
 * Skeleton component tests
 */

import { render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"

import Skeleton from "../Skeleton.svelte"

describe("Skeleton", () => {
  describe("rendering", () => {
    it("renders a div element", () => {
      const { container } = render(Skeleton)
      expect(container.querySelector("div")).toBeInTheDocument()
    })

    it("has aria-hidden for accessibility", () => {
      const { container } = render(Skeleton)
      expect(container.querySelector("div")).toHaveAttribute(
        "aria-hidden",
        "true",
      )
    })

    it("has pulse animation class", () => {
      const { container } = render(Skeleton)
      expect(container.querySelector("div")).toHaveClass("animate-pulse")
    })

    it("has muted background", () => {
      const { container } = render(Skeleton)
      expect(container.querySelector("div")).toHaveClass("bg-muted")
    })
  })

  describe("rounded variants", () => {
    it("applies none rounded class", () => {
      const { container } = render(Skeleton, { props: { rounded: "none" } })
      expect(container.querySelector("div")).toHaveClass("rounded-none")
    })

    it("applies sm rounded class", () => {
      const { container } = render(Skeleton, { props: { rounded: "sm" } })
      expect(container.querySelector("div")).toHaveClass("rounded-sm")
    })

    it("applies md rounded class (default)", () => {
      const { container } = render(Skeleton, { props: { rounded: "md" } })
      expect(container.querySelector("div")).toHaveClass("rounded-md")
    })

    it("applies lg rounded class", () => {
      const { container } = render(Skeleton, { props: { rounded: "lg" } })
      expect(container.querySelector("div")).toHaveClass("rounded-lg")
    })

    it("applies full rounded class", () => {
      const { container } = render(Skeleton, { props: { rounded: "full" } })
      expect(container.querySelector("div")).toHaveClass("rounded-full")
    })
  })

  describe("dimensions", () => {
    it("applies width style", () => {
      const { container } = render(Skeleton, { props: { width: "200px" } })
      expect(container.querySelector("div")).toHaveStyle({ width: "200px" })
    })

    it("applies height style", () => {
      const { container } = render(Skeleton, { props: { height: "50px" } })
      expect(container.querySelector("div")).toHaveStyle({ height: "50px" })
    })
  })

  describe("custom styling", () => {
    it("applies custom class", () => {
      const { container } = render(Skeleton, { props: { class: "h-4 w-48" } })
      expect(container.querySelector("div")).toHaveClass("h-4", "w-48")
    })
  })
})
