/**
 * Alert component tests
 */

import { render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"

import Alert from "../Alert.svelte"

describe("Alert", () => {
  describe("rendering", () => {
    it("renders alert role", () => {
      render(Alert, { props: { title: "Test" } })
      expect(screen.getByRole("alert")).toBeInTheDocument()
    })

    it("renders title", () => {
      render(Alert, { props: { title: "Heads up!" } })
      expect(screen.getByText("Heads up!")).toBeInTheDocument()
    })

    it("renders description", () => {
      render(Alert, { props: { description: "This is important." } })
      expect(screen.getByText("This is important.")).toBeInTheDocument()
    })

    it("renders title and description together", () => {
      render(Alert, {
        props: { title: "Warning", description: "Please review." },
      })
      expect(screen.getByText("Warning")).toBeInTheDocument()
      expect(screen.getByText("Please review.")).toBeInTheDocument()
    })
  })

  describe("variants", () => {
    it("applies default variant class", () => {
      render(Alert, { props: { title: "Info" } })
      expect(screen.getByRole("alert")).toHaveClass("alert")
    })

    it("applies destructive variant class", () => {
      render(Alert, { props: { variant: "destructive", title: "Error" } })
      expect(screen.getByRole("alert")).toHaveClass("alert-destructive")
    })
  })

  describe("custom styling", () => {
    it("applies custom class", () => {
      render(Alert, { props: { title: "Test", class: "my-custom-class" } })
      expect(screen.getByRole("alert")).toHaveClass("my-custom-class")
    })
  })
})
