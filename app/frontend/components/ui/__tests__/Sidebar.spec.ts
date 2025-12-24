/**
 * Sidebar component tests
 */

import { render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"

import type { SidebarMenu } from "../Sidebar.svelte"
import Sidebar from "../Sidebar.svelte"

const simpleMenu: SidebarMenu = [
  {
    type: "group",
    label: "Main",
    items: [
      { label: "Home", url: "/" },
      { label: "Dashboard", url: "/dashboard" },
    ],
  },
]

const menuWithSubmenu: SidebarMenu = [
  {
    type: "group",
    label: "Platform",
    items: [
      { label: "Overview", url: "/overview" },
      {
        type: "submenu",
        label: "Settings",
        items: [
          { label: "General", url: "/settings/general" },
          { label: "Security", url: "/settings/security" },
        ],
      },
    ],
  },
]

const menuWithSeparator: SidebarMenu = [
  {
    type: "group",
    items: [{ label: "Item 1", url: "/1" }],
  },
  { type: "separator" },
  {
    type: "group",
    items: [{ label: "Item 2", url: "/2" }],
  },
]

describe("Sidebar", () => {
  describe("rendering", () => {
    it("renders aside element", () => {
      const { container } = render(Sidebar, { props: { menu: simpleMenu } })
      expect(container.querySelector("aside")).toBeInTheDocument()
    })

    it("renders nav element", () => {
      render(Sidebar, { props: { menu: simpleMenu } })
      expect(screen.getByRole("navigation")).toBeInTheDocument()
    })

    it("has sidebar class", () => {
      const { container } = render(Sidebar, { props: { menu: simpleMenu } })
      expect(container.querySelector(".sidebar")).toBeInTheDocument()
    })

    it("applies aria-label to navigation", () => {
      render(Sidebar, { props: { menu: simpleMenu, label: "Main navigation" } })
      expect(screen.getByRole("navigation")).toHaveAttribute(
        "aria-label",
        "Main navigation",
      )
    })
  })

  describe("menu items", () => {
    it("renders menu items as links", () => {
      render(Sidebar, { props: { menu: simpleMenu, open: true } })
      expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument()
      expect(
        screen.getByRole("link", { name: "Dashboard" }),
      ).toBeInTheDocument()
    })

    it("sets href on links", () => {
      render(Sidebar, { props: { menu: simpleMenu, open: true } })
      // Links are resolved to full URLs in jsdom, so check they contain the expected path
      expect(
        screen.getByRole("link", { name: "Home" }).getAttribute("href"),
      ).toMatch(/\/$/)
      expect(
        screen.getByRole("link", { name: "Dashboard" }).getAttribute("href"),
      ).toContain("/dashboard")
    })
  })

  describe("groups", () => {
    it("renders group labels", () => {
      render(Sidebar, { props: { menu: simpleMenu } })
      expect(screen.getByText("Main")).toBeInTheDocument()
    })

    it("renders groups with role=group", () => {
      render(Sidebar, { props: { menu: simpleMenu } })
      expect(screen.getByRole("group")).toBeInTheDocument()
    })

    it("associates group label with group", () => {
      const { container } = render(Sidebar, { props: { menu: simpleMenu } })
      const group = container.querySelector('[role="group"]')
      const labelId = group?.getAttribute("aria-labelledby")
      expect(labelId).toBeTruthy()
      expect(container.querySelector(`#${labelId}`)).toHaveTextContent("Main")
    })
  })

  describe("submenus", () => {
    it("renders submenu as details element", () => {
      const { container } = render(Sidebar, {
        props: { menu: menuWithSubmenu },
      })
      expect(container.querySelector("details")).toBeInTheDocument()
    })

    it("renders submenu label in summary", () => {
      render(Sidebar, { props: { menu: menuWithSubmenu } })
      expect(screen.getByText("Settings")).toBeInTheDocument()
    })

    it("renders submenu items", () => {
      render(Sidebar, { props: { menu: menuWithSubmenu } })
      expect(screen.getByRole("link", { name: "General" })).toBeInTheDocument()
      expect(screen.getByRole("link", { name: "Security" })).toBeInTheDocument()
    })

    it("respects submenu open prop", () => {
      const openMenu: SidebarMenu = [
        {
          type: "group",
          items: [
            {
              type: "submenu",
              label: "Open Menu",
              open: true,
              items: [{ label: "Sub Item", url: "/sub" }],
            },
          ],
        },
      ]
      const { container } = render(Sidebar, { props: { menu: openMenu } })
      expect(container.querySelector("details")).toHaveAttribute("open")
    })
  })

  describe("separators", () => {
    it("renders separators as hr elements", () => {
      const { container } = render(Sidebar, {
        props: { menu: menuWithSeparator },
      })
      expect(container.querySelector("hr")).toBeInTheDocument()
    })
  })

  describe("side prop", () => {
    it("sets data-side=left by default", () => {
      const { container } = render(Sidebar, { props: { menu: simpleMenu } })
      expect(container.querySelector("aside")).toHaveAttribute(
        "data-side",
        "left",
      )
    })

    it("sets data-side=right when side=right", () => {
      const { container } = render(Sidebar, {
        props: { menu: simpleMenu, side: "right" },
      })
      expect(container.querySelector("aside")).toHaveAttribute(
        "data-side",
        "right",
      )
    })
  })

  describe("open state attributes", () => {
    // Note: The Sidebar component uses sidebarState global and $effect for state sync
    // The aria-hidden and inert attributes are controlled reactively based on internal state
    // Testing these requires integration with the sidebarState rune which initializes based on window size

    it("has aria-hidden attribute", () => {
      const { container } = render(Sidebar, { props: { menu: simpleMenu } })
      // Just verify the attribute exists (value depends on window.innerWidth and sidebarState)
      expect(container.querySelector("aside")).toHaveAttribute("aria-hidden")
    })
  })

  describe("custom styling", () => {
    it("applies custom class", () => {
      const { container } = render(Sidebar, {
        props: { menu: simpleMenu, class: "w-64" },
      })
      expect(container.querySelector("aside")).toHaveClass("w-64")
    })

    it("applies contentClass to content section", () => {
      const { container } = render(Sidebar, {
        props: { menu: simpleMenu, contentClass: "px-4" },
      })
      expect(container.querySelector("section")).toHaveClass("px-4")
    })
  })

  describe("custom ID", () => {
    it("uses provided ID", () => {
      const { container } = render(Sidebar, {
        props: { id: "main-sidebar", menu: simpleMenu },
      })
      expect(container.querySelector("aside")).toHaveAttribute(
        "id",
        "main-sidebar",
      )
    })
  })
})
