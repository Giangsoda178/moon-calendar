/**
 * Progress component tests
 */

import { render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"

import Progress from "../Progress.svelte"

describe("Progress", () => {
  describe("rendering", () => {
    it("renders progressbar role", () => {
      render(Progress, { props: { value: 50 } })
      expect(screen.getByRole("progressbar")).toBeInTheDocument()
    })

    it("has default value of 0", () => {
      render(Progress)
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuenow",
        "0",
      )
    })
  })

  describe("aria attributes", () => {
    it("sets aria-valuenow", () => {
      render(Progress, { props: { value: 66 } })
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuenow",
        "66",
      )
    })

    it("sets aria-valuemin to 0", () => {
      render(Progress, { props: { value: 50 } })
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuemin",
        "0",
      )
    })

    it("sets aria-valuemax", () => {
      render(Progress, { props: { value: 50, max: 100 } })
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuemax",
        "100",
      )
    })

    it("supports custom max value", () => {
      render(Progress, { props: { value: 25, max: 50 } })
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuemax",
        "50",
      )
    })
  })

  describe("indicator width", () => {
    it("calculates correct percentage", () => {
      const { container } = render(Progress, { props: { value: 75, max: 100 } })
      const indicator = container.querySelector('[class*="h-full"]')
      expect(indicator).toHaveStyle({ width: "75%" })
    })

    it("caps percentage at 100%", () => {
      const { container } = render(Progress, {
        props: { value: 150, max: 100 },
      })
      const indicator = container.querySelector('[class*="h-full"]')
      expect(indicator).toHaveStyle({ width: "100%" })
    })

    it("handles zero max without division by zero", () => {
      const { container } = render(Progress, { props: { value: 50, max: 0 } })
      const indicator = container.querySelector('[class*="h-full"]')
      expect(indicator).toHaveStyle({ width: "0%" })
    })

    it("handles 0 value", () => {
      const { container } = render(Progress, { props: { value: 0, max: 100 } })
      const indicator = container.querySelector('[class*="h-full"]')
      expect(indicator).toHaveStyle({ width: "0%" })
    })
  })

  describe("custom styling", () => {
    it("applies custom class to track", () => {
      render(Progress, { props: { value: 50, class: "h-3" } })
      expect(screen.getByRole("progressbar")).toHaveClass("h-3")
    })

    it("applies indicatorClass to indicator", () => {
      const { container } = render(Progress, {
        props: { value: 50, indicatorClass: "bg-green-500" },
      })
      const indicator = container.querySelector('[class*="h-full"]')
      expect(indicator).toHaveClass("bg-green-500")
    })
  })
})
