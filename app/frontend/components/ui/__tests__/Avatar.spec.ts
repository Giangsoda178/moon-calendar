/**
 * Avatar component tests
 */

import { render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"

import Avatar from "../Avatar.svelte"

describe("Avatar", () => {
  describe("rendering", () => {
    it("renders container element", () => {
      const { container } = render(Avatar)
      expect(container.querySelector("span")).toBeInTheDocument()
    })

    it("renders image when src provided", () => {
      render(Avatar, { props: { src: "/avatar.png", alt: "User" } })
      expect(screen.getByRole("img")).toHaveAttribute("src", "/avatar.png")
    })

    it("renders fallback text when no src", () => {
      render(Avatar, { props: { fallback: "JD" } })
      expect(screen.getByText("JD")).toBeInTheDocument()
    })

    it("renders default user icon when no src or fallback", () => {
      const { container } = render(Avatar)
      expect(container.querySelector("svg")).toBeInTheDocument()
    })
  })

  describe("sizes", () => {
    it("applies sm size class", () => {
      const { container } = render(Avatar, {
        props: { size: "sm", fallback: "X" },
      })
      expect(container.querySelector("span")).toHaveClass("size-8")
    })

    it("applies md size class (default)", () => {
      const { container } = render(Avatar, {
        props: { size: "md", fallback: "X" },
      })
      expect(container.querySelector("span")).toHaveClass("size-10")
    })

    it("applies lg size class", () => {
      const { container } = render(Avatar, {
        props: { size: "lg", fallback: "X" },
      })
      expect(container.querySelector("span")).toHaveClass("size-12")
    })

    it("applies xl size class", () => {
      const { container } = render(Avatar, {
        props: { size: "xl", fallback: "X" },
      })
      expect(container.querySelector("span")).toHaveClass("size-16")
    })
  })

  describe("shapes", () => {
    it("applies circle shape (default)", () => {
      const { container } = render(Avatar, {
        props: { shape: "circle", fallback: "X" },
      })
      expect(container.querySelector("span")).toHaveClass("rounded-full")
    })

    it("applies square shape", () => {
      const { container } = render(Avatar, {
        props: { shape: "square", fallback: "X" },
      })
      expect(container.querySelector("span")).toHaveClass("rounded-md")
    })
  })

  describe("accessibility", () => {
    it("applies alt text to image", () => {
      render(Avatar, { props: { src: "/avatar.png", alt: "User avatar" } })
      expect(screen.getByRole("img")).toHaveAttribute("alt", "User avatar")
    })

    it("default icon has aria-hidden", () => {
      const { container } = render(Avatar)
      expect(container.querySelector("svg")).toHaveAttribute(
        "aria-hidden",
        "true",
      )
    })
  })

  describe("custom styling", () => {
    it("applies custom class to container", () => {
      const { container } = render(Avatar, {
        props: { class: "ring-2", fallback: "X" },
      })
      expect(container.querySelector("span")).toHaveClass("ring-2")
    })

    it("applies fallbackClass to fallback text", () => {
      render(Avatar, { props: { fallback: "AB", fallbackClass: "text-xl" } })
      expect(screen.getByText("AB")).toHaveClass("text-xl")
    })
  })
})
