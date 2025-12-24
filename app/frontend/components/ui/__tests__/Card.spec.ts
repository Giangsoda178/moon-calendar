/**
 * Card component tests
 */

import { render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"

import Card from "../Card.svelte"

describe("Card", () => {
  describe("rendering", () => {
    it("renders card element", () => {
      const { container } = render(Card)
      expect(container.querySelector(".card")).toBeInTheDocument()
    })

    it("renders title", () => {
      render(Card, { props: { title: "Card Title" } })
      expect(screen.getByText("Card Title")).toBeInTheDocument()
    })

    it("renders description", () => {
      render(Card, { props: { description: "Card description text." } })
      expect(screen.getByText("Card description text.")).toBeInTheDocument()
    })

    it("renders title and description in header", () => {
      render(Card, { props: { title: "Title", description: "Description" } })
      expect(screen.getByText("Title").closest("header")).toBeInTheDocument()
      expect(
        screen.getByText("Description").closest("header"),
      ).toBeInTheDocument()
    })
  })

  describe("sections", () => {
    it("renders header when title provided", () => {
      const { container } = render(Card, { props: { title: "Header" } })
      expect(container.querySelector("header")).toBeInTheDocument()
    })

    it("does not render header when no title/description/header slot", () => {
      const { container } = render(Card)
      expect(container.querySelector("header")).not.toBeInTheDocument()
    })
  })

  describe("custom styling", () => {
    it("applies custom class to container", () => {
      const { container } = render(Card, { props: { class: "max-w-md" } })
      expect(container.querySelector(".card")).toHaveClass("max-w-md")
    })

    it("applies headerClass to header", () => {
      const { container } = render(Card, {
        props: { title: "Title", headerClass: "p-6" },
      })
      expect(container.querySelector("header")).toHaveClass("p-6")
    })
  })
})
