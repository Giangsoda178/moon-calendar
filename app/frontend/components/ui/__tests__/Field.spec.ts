/**
 * Field component tests
 */

import { render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"

import Field from "../Field.svelte"

import { htmlSnippet, textSnippet } from "./test-utils"

describe("Field", () => {
  describe("rendering", () => {
    it("renders field container", () => {
      const { container } = render(Field, {
        props: { children: textSnippet("Input") },
      })
      expect(container.querySelector(".field")).toBeInTheDocument()
    })

    it("renders children content", () => {
      render(Field, { props: { children: textSnippet("Child Content") } })
      expect(screen.getByText("Child Content")).toBeInTheDocument()
    })
  })

  describe("label", () => {
    it("renders label when provided", () => {
      render(Field, {
        props: { label: "Email", children: textSnippet("Input") },
      })
      expect(screen.getByText("Email")).toBeInTheDocument()
    })

    it("renders label as label element", () => {
      const { container } = render(Field, {
        props: { label: "Username", children: textSnippet("Input") },
      })
      expect(container.querySelector("label")).toBeInTheDocument()
    })

    it("shows required indicator when required", () => {
      render(Field, {
        props: {
          label: "Password",
          required: true,
          children: textSnippet("Input"),
        },
      })
      expect(screen.getByText("*")).toBeInTheDocument()
    })

    it("required indicator has destructive styling", () => {
      const { container } = render(Field, {
        props: {
          label: "Field",
          required: true,
          children: textSnippet("Input"),
        },
      })
      expect(container.querySelector(".text-destructive")).toBeInTheDocument()
    })
  })

  describe("description", () => {
    it("renders description when provided", () => {
      render(Field, {
        props: {
          description: "Enter your email address",
          children: textSnippet("Input"),
        },
      })
      expect(screen.getByText("Enter your email address")).toBeInTheDocument()
    })

    it("hides description when error present", () => {
      render(Field, {
        props: {
          description: "Help text",
          error: "Error message",
          children: textSnippet("Input"),
        },
      })
      expect(screen.queryByText("Help text")).not.toBeInTheDocument()
    })
  })

  describe("error handling", () => {
    it("renders error message", () => {
      render(Field, {
        props: {
          error: "This field is required",
          children: textSnippet("Input"),
        },
      })
      expect(screen.getByText("This field is required")).toBeInTheDocument()
    })

    it("renders error with alert role", () => {
      render(Field, {
        props: { error: "Error!", children: textSnippet("Input") },
      })
      expect(screen.getByRole("alert")).toBeInTheDocument()
    })

    it("renders multiple errors as list", () => {
      render(Field, {
        props: {
          error: ["Error 1", "Error 2"],
          children: textSnippet("Input"),
        },
      })
      expect(screen.getByText("Error 1")).toBeInTheDocument()
      expect(screen.getByText("Error 2")).toBeInTheDocument()
    })

    it("sets data-invalid when error present", () => {
      const { container } = render(Field, {
        props: { error: "Error", children: textSnippet("Input") },
      })
      expect(container.querySelector("[data-invalid]")).toBeInTheDocument()
    })

    it("does not set data-invalid when no error", () => {
      const { container } = render(Field, {
        props: { children: textSnippet("Input") },
      })
      expect(container.querySelector("[data-invalid]")).not.toBeInTheDocument()
    })
  })

  describe("orientation", () => {
    it("has vertical orientation by default", () => {
      const { container } = render(Field, {
        props: { children: textSnippet("Input") },
      })
      expect(
        container.querySelector("[data-orientation]"),
      ).not.toBeInTheDocument()
    })

    it("sets horizontal orientation", () => {
      const { container } = render(Field, {
        props: { orientation: "horizontal", children: textSnippet("Input") },
      })
      expect(
        container.querySelector('[data-orientation="horizontal"]'),
      ).toBeInTheDocument()
    })
  })

  describe("custom styling", () => {
    it("applies custom class", () => {
      const { container } = render(Field, {
        props: { class: "max-w-md", children: textSnippet("Input") },
      })
      expect(container.querySelector(".max-w-md")).toBeInTheDocument()
    })

    it("preserves field class when custom class added", () => {
      const { container } = render(Field, {
        props: { class: "custom", children: textSnippet("Input") },
      })
      const field = container.querySelector("div")
      expect(field).toHaveClass("field")
      expect(field).toHaveClass("custom")
    })
  })

  describe("custom label snippet", () => {
    it("renders labelSnippet instead of label prop", () => {
      render(Field, {
        props: {
          label: "Should not show",
          labelSnippet: htmlSnippet("<h3>Custom Label</h3>"),
          children: textSnippet("Input"),
        },
      })
      expect(screen.getByText("Custom Label")).toBeInTheDocument()
      expect(screen.queryByText("Should not show")).not.toBeInTheDocument()
    })
  })
})
