/**
 * Empty component tests
 */

import { render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"

import Empty from "../Empty.svelte"

describe("Empty", () => {
  describe("rendering", () => {
    it("renders container element", () => {
      const { container } = render(Empty)
      expect(container.firstElementChild).toBeInTheDocument()
    })

    it("renders title", () => {
      render(Empty, { props: { title: "No Projects Yet" } })
      expect(screen.getByText("No Projects Yet")).toBeInTheDocument()
    })

    it("renders description", () => {
      render(Empty, { props: { description: "Create your first project." } })
      expect(screen.getByText("Create your first project.")).toBeInTheDocument()
    })

    it("renders title and description together", () => {
      render(Empty, {
        props: {
          title: "Empty State",
          description: "Nothing to show here.",
        },
      })
      expect(screen.getByText("Empty State")).toBeInTheDocument()
      expect(screen.getByText("Nothing to show here.")).toBeInTheDocument()
    })
  })

  describe("variants", () => {
    it("applies default variant (no border)", () => {
      const { container } = render(Empty, { props: { variant: "default" } })
      expect(container.firstElementChild).not.toHaveClass("border")
    })

    it("applies outline variant (with border)", () => {
      const { container } = render(Empty, { props: { variant: "outline" } })
      expect(container.firstElementChild).toHaveClass("border")
    })
  })

  describe("custom styling", () => {
    it("applies custom class", () => {
      const { container } = render(Empty, { props: { class: "min-h-[400px]" } })
      expect(container.firstElementChild).toHaveClass("min-h-[400px]")
    })
  })
})
