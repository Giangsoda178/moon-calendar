/**
 * AppBar component tests
 */

import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"

import AppBar from "../../mobile/AppBar.svelte"
import { htmlSnippet } from "../test-utils"

describe("AppBar", () => {
  describe("rendering", () => {
    it("renders nav element", () => {
      const { container } = render(AppBar)
      expect(container.querySelector("nav")).toBeInTheDocument()
    })

    it("has aria-label for accessibility", () => {
      const { container } = render(AppBar)
      expect(container.querySelector("nav")).toHaveAttribute(
        "aria-label",
        "Page navigation",
      )
    })

    it("renders title when provided", () => {
      render(AppBar, { props: { title: "Settings" } })
      expect(
        screen.getByRole("heading", { name: "Settings" }),
      ).toBeInTheDocument()
    })

    it("renders subtitle when provided", () => {
      render(AppBar, { props: { title: "John Doe", subtitle: "Online" } })
      expect(screen.getByText("Online")).toBeInTheDocument()
    })

    it("does not render title when not provided", () => {
      render(AppBar)
      expect(screen.queryByRole("heading")).not.toBeInTheDocument()
    })
  })

  describe("back button with href", () => {
    it("renders back link when backHref provided", () => {
      render(AppBar, { props: { title: "Settings", backHref: "/" } })
      expect(screen.getByRole("link", { name: "Go back" })).toBeInTheDocument()
    })

    it("back link has correct href", () => {
      render(AppBar, { props: { title: "Settings", backHref: "/home" } })
      // href is converted to absolute URL by jsdom
      expect(
        screen.getByRole("link", { name: "Go back" }).getAttribute("href"),
      ).toContain("/home")
    })

    it("does not render back button when hideBack is true", () => {
      render(AppBar, {
        props: { title: "Settings", backHref: "/", hideBack: true },
      })
      expect(screen.queryByLabelText("Go back")).not.toBeInTheDocument()
    })
  })

  describe("back button with callback", () => {
    it("renders back button when onback provided", () => {
      const onback = vi.fn()
      render(AppBar, { props: { title: "Settings", onback } })
      expect(
        screen.getByRole("button", { name: "Go back" }),
      ).toBeInTheDocument()
    })

    it("calls onback when back button clicked", async () => {
      const onback = vi.fn()
      render(AppBar, { props: { title: "Settings", onback } })
      await fireEvent.click(screen.getByRole("button", { name: "Go back" }))
      expect(onback).toHaveBeenCalled()
    })

    it("does not render back button when hideBack is true with onback", () => {
      const onback = vi.fn()
      render(AppBar, { props: { title: "Settings", onback, hideBack: true } })
      expect(screen.queryByLabelText("Go back")).not.toBeInTheDocument()
    })
  })

  describe("no back button", () => {
    it("does not render back button when neither backHref nor onback provided", () => {
      render(AppBar, { props: { title: "Settings" } })
      expect(screen.queryByLabelText("Go back")).not.toBeInTheDocument()
    })

    it("renders spacer when no back button", () => {
      const { container } = render(AppBar, { props: { title: "Settings" } })
      // Should have spacer divs (size-10)
      expect(container.querySelectorAll(".size-10").length).toBeGreaterThan(0)
    })
  })

  describe("title alignment", () => {
    it("defaults to left alignment", () => {
      const { container } = render(AppBar, { props: { title: "Settings" } })
      const titleArea = container.querySelector(".flex-1")
      expect(titleArea).not.toHaveClass("items-center")
    })

    it("centers title when titleAlign=center", () => {
      const { container } = render(AppBar, {
        props: { title: "Settings", titleAlign: "center" },
      })
      const titleArea = container.querySelector(".flex-1")
      expect(titleArea).toHaveClass("items-center")
    })
  })

  describe("transparent mode", () => {
    it("has border and background by default", () => {
      const { container } = render(AppBar, { props: { title: "Settings" } })
      expect(container.querySelector("nav")).toHaveClass("border-b")
    })

    it("removes border when transparent", () => {
      const { container } = render(AppBar, {
        props: { title: "Settings", transparent: true },
      })
      expect(container.querySelector("nav")).toHaveClass("bg-transparent")
      expect(container.querySelector("nav")).not.toHaveClass("border-b")
    })
  })

  describe("actions slot", () => {
    it("renders actions when provided", () => {
      const actions = htmlSnippet('<button class="test-action">Save</button>')
      render(AppBar, { props: { title: "Settings", actions } })
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
    })

    it("does not render actions container when no actions", () => {
      const { container } = render(AppBar, { props: { title: "Settings" } })
      // Should have spacer instead of actions container
      const nav = container.querySelector("nav")
      expect(nav?.querySelector(".gap-1")).not.toBeInTheDocument()
    })
  })

  describe("custom styling", () => {
    it("applies custom class to nav", () => {
      const { container } = render(AppBar, {
        props: { title: "Settings", class: "sticky-top" },
      })
      expect(container.querySelector("nav")).toHaveClass("sticky-top")
    })
  })

  describe("accessibility", () => {
    it("title is h1 element", () => {
      render(AppBar, { props: { title: "Settings" } })
      const heading = screen.getByRole("heading", { level: 1 })
      expect(heading).toHaveTextContent("Settings")
    })

    it("back button has aria-label", () => {
      render(AppBar, { props: { title: "Settings", backHref: "/" } })
      expect(screen.getByLabelText("Go back")).toBeInTheDocument()
    })
  })
})
