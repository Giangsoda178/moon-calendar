/**
 * BottomNavItem component tests
 */

import { Bell, House } from "@lucide/svelte"
import { render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"

import BottomNavItem from "../../mobile/BottomNavItem.svelte"

describe("BottomNavItem", () => {
  const defaultProps = {
    icon: House,
    label: "Home",
    href: "/",
  }

  describe("rendering", () => {
    it("renders link element", () => {
      render(BottomNavItem, { props: defaultProps })
      expect(screen.getByRole("link")).toBeInTheDocument()
    })

    it("displays label text", () => {
      render(BottomNavItem, { props: defaultProps })
      expect(screen.getByText("Home")).toBeInTheDocument()
    })

    it("has correct href", () => {
      render(BottomNavItem, { props: defaultProps })
      // href is converted to absolute URL by jsdom
      expect(screen.getByRole("link").getAttribute("href")).toContain("/")
    })

    it("renders icon", () => {
      const { container } = render(BottomNavItem, { props: defaultProps })
      // Lucide icons render as SVG
      expect(container.querySelector("svg")).toBeInTheDocument()
    })
  })

  describe("active state", () => {
    it("has aria-current=page when active", () => {
      render(BottomNavItem, { props: { ...defaultProps, active: true } })
      expect(screen.getByRole("link")).toHaveAttribute("aria-current", "page")
    })

    it("does not have aria-current when not active", () => {
      render(BottomNavItem, { props: defaultProps })
      expect(screen.getByRole("link")).not.toHaveAttribute("aria-current")
    })

    it("applies primary color when active", () => {
      render(BottomNavItem, { props: { ...defaultProps, active: true } })
      expect(screen.getByRole("link")).toHaveClass("text-primary")
    })

    it("applies muted color when not active", () => {
      render(BottomNavItem, { props: defaultProps })
      expect(screen.getByRole("link")).toHaveClass("text-muted-foreground")
    })
  })

  describe("badge", () => {
    it("shows numeric badge", () => {
      render(BottomNavItem, { props: { ...defaultProps, badge: 5 } })
      expect(screen.getByText("5")).toBeInTheDocument()
    })

    it("shows large numeric badge", () => {
      render(BottomNavItem, { props: { ...defaultProps, badge: 99 } })
      expect(screen.getByText("99")).toBeInTheDocument()
    })

    it("shows dot badge when badge is true", () => {
      const { container } = render(BottomNavItem, {
        props: { ...defaultProps, badge: true },
      })
      // Dot badge has size-2 class (no text)
      const dotBadge = container.querySelector(".size-2")
      expect(dotBadge).toBeInTheDocument()
      expect(dotBadge).toHaveClass("rounded-full")
    })

    it("does not show badge when undefined", () => {
      const { container } = render(BottomNavItem, { props: defaultProps })
      expect(
        container.querySelector(".rounded-full.bg-destructive"),
      ).not.toBeInTheDocument()
    })

    it("does not show badge when false", () => {
      const { container } = render(BottomNavItem, {
        props: { ...defaultProps, badge: false },
      })
      expect(
        container.querySelector(".rounded-full.bg-destructive"),
      ).not.toBeInTheDocument()
    })

    it("badge has destructive styling", () => {
      const { container } = render(BottomNavItem, {
        props: { ...defaultProps, badge: 3 },
      })
      expect(container.querySelector(".bg-destructive")).toBeInTheDocument()
    })
  })

  describe("custom styling", () => {
    it("applies custom class", () => {
      render(BottomNavItem, {
        props: { ...defaultProps, class: "custom-item" },
      })
      expect(screen.getByRole("link")).toHaveClass("custom-item")
    })
  })

  describe("accessibility", () => {
    it("link has focus-visible styles", () => {
      render(BottomNavItem, { props: defaultProps })
      expect(screen.getByRole("link")).toHaveClass("focus-visible:ring-2")
    })

    it("displays icon and label for screen readers", () => {
      render(BottomNavItem, {
        props: { icon: Bell, label: "Notifications", href: "/notifications" },
      })
      // Label should be visible as text
      expect(screen.getByText("Notifications")).toBeInTheDocument()
    })
  })

  describe("layout", () => {
    it("uses flex column layout", () => {
      render(BottomNavItem, { props: defaultProps })
      expect(screen.getByRole("link")).toHaveClass("flex-col")
    })

    it("centers content", () => {
      render(BottomNavItem, { props: defaultProps })
      expect(screen.getByRole("link")).toHaveClass("items-center")
      expect(screen.getByRole("link")).toHaveClass("justify-center")
    })

    it("has flex-1 for equal spacing", () => {
      render(BottomNavItem, { props: defaultProps })
      expect(screen.getByRole("link")).toHaveClass("flex-1")
    })
  })
})
