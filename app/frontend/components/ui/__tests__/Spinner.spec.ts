/**
 * Spinner component tests
 */

import { render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"

import Spinner from "../Spinner.svelte"

describe("Spinner", () => {
  describe("rendering", () => {
    it("renders with status role", () => {
      render(Spinner)
      expect(screen.getByRole("status")).toBeInTheDocument()
    })

    it("has default aria-label", () => {
      render(Spinner)
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Loading",
      )
    })

    it("has animate-spin class", () => {
      render(Spinner)
      expect(screen.getByRole("status")).toHaveClass("animate-spin")
    })
  })

  describe("sizes", () => {
    it("applies small size class", () => {
      render(Spinner, { props: { size: "sm" } })
      expect(screen.getByRole("status")).toHaveClass("size-3")
    })

    it("applies medium size class (default)", () => {
      render(Spinner, { props: { size: "md" } })
      expect(screen.getByRole("status")).toHaveClass("size-4")
    })

    it("applies large size class", () => {
      render(Spinner, { props: { size: "lg" } })
      expect(screen.getByRole("status")).toHaveClass("size-6")
    })
  })

  describe("accessibility", () => {
    it("supports custom aria-label", () => {
      render(Spinner, { props: { label: "Processing request" } })
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Processing request",
      )
    })
  })

  describe("custom styling", () => {
    it("applies custom class", () => {
      render(Spinner, { props: { class: "text-primary" } })
      expect(screen.getByRole("status")).toHaveClass("text-primary")
    })
  })
})
