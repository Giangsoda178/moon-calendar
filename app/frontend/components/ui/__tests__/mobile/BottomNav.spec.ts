/**
 * BottomNav component tests
 */

import { Bell, House, LayoutGrid, Search, Settings, User } from "@lucide/svelte"
import { render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"

import BottomNav from "../../mobile/BottomNav.svelte"

// Track the current mock URL
let mockUrl = "/"

// Mock @inertiajs/svelte since it's used for current path detection
vi.mock("@inertiajs/svelte", () => ({
  page: {
    subscribe: vi.fn((callback) => {
      callback({ url: mockUrl })
      return { unsubscribe: vi.fn() }
    }),
  },
}))

// Helper to set mock URL before rendering
function setMockUrl(url: string) {
  mockUrl = url
}

const defaultItems = [
  { icon: House, label: "Home", href: "/" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Bell, label: "Alerts", href: "/alerts" },
  { icon: User, label: "Profile", href: "/profile" },
]

// Kitchen sink mobile scenario - all paths share /kitchen_sink/mobile prefix
const kitchenSinkMobileItems = [
  { icon: House, label: "Home", href: "/kitchen_sink/mobile" },
  {
    icon: LayoutGrid,
    label: "Components",
    href: "/kitchen_sink/mobile/components",
  },
  { icon: Settings, label: "Settings", href: "/kitchen_sink/mobile/settings" },
]

describe("BottomNav", () => {
  describe("rendering", () => {
    it("renders nav element", () => {
      const { container } = render(BottomNav, {
        props: { items: defaultItems },
      })
      expect(container.querySelector("nav")).toBeInTheDocument()
    })

    it("has aria-label for accessibility", () => {
      const { container } = render(BottomNav, {
        props: { items: defaultItems },
      })
      expect(container.querySelector("nav")).toHaveAttribute(
        "aria-label",
        "Main navigation",
      )
    })

    it("has fixed positioning", () => {
      const { container } = render(BottomNav, {
        props: { items: defaultItems },
      })
      expect(container.querySelector("nav")).toHaveClass("fixed")
    })

    it("is positioned at bottom", () => {
      const { container } = render(BottomNav, {
        props: { items: defaultItems },
      })
      expect(container.querySelector("nav")).toHaveClass("bottom-0")
    })
  })

  describe("items prop", () => {
    it("renders all items", () => {
      render(BottomNav, { props: { items: defaultItems } })
      expect(screen.getByText("Home")).toBeInTheDocument()
      expect(screen.getByText("Search")).toBeInTheDocument()
      expect(screen.getByText("Alerts")).toBeInTheDocument()
      expect(screen.getByText("Profile")).toBeInTheDocument()
    })

    it("renders correct number of links", () => {
      render(BottomNav, { props: { items: defaultItems } })
      expect(screen.getAllByRole("link")).toHaveLength(4)
    })

    it("each item has correct href", () => {
      render(BottomNav, { props: { items: defaultItems } })
      expect(screen.getByRole("link", { name: /Home/i })).toHaveAttribute(
        "href",
        "/",
      )
      expect(screen.getByRole("link", { name: /Search/i })).toHaveAttribute(
        "href",
        "/search",
      )
      expect(screen.getByRole("link", { name: /Alerts/i })).toHaveAttribute(
        "href",
        "/alerts",
      )
      expect(screen.getByRole("link", { name: /Profile/i })).toHaveAttribute(
        "href",
        "/profile",
      )
    })
  })

  describe("badge support", () => {
    it("renders numeric badge", () => {
      const itemsWithBadge = [
        { icon: House, label: "Home", href: "/" },
        { icon: Bell, label: "Alerts", href: "/alerts", badge: 5 },
      ]
      render(BottomNav, { props: { items: itemsWithBadge } })
      expect(screen.getByText("5")).toBeInTheDocument()
    })

    it("renders dot badge when badge is true", () => {
      const itemsWithDot = [
        { icon: House, label: "Home", href: "/" },
        { icon: Bell, label: "Alerts", href: "/alerts", badge: true },
      ]
      const { container } = render(BottomNav, {
        props: { items: itemsWithDot },
      })
      // Dot badge has size-2 class
      expect(container.querySelector(".size-2")).toBeInTheDocument()
    })
  })

  describe("custom styling", () => {
    it("applies custom class", () => {
      const { container } = render(BottomNav, {
        props: { items: defaultItems, class: "custom-nav" },
      })
      expect(container.querySelector("nav")).toHaveClass("custom-nav")
    })
  })

  describe("safe area", () => {
    it("has bottom safe area padding", () => {
      const { container } = render(BottomNav, {
        props: { items: defaultItems },
      })
      // pb-safe is on a child div, not nav
      expect(container.querySelector(".pb-safe")).toBeInTheDocument()
    })
  })

  describe("isActive - table-driven tests", () => {
    // Table-driven test cases for easy addition of new patterns
    // Format: [description, currentUrl, href, expectedActive]
    const testCases: [string, string, string, boolean][] = [
      // Basic exact matching
      ["root path matches root href", "/", "/", true],
      ["search path matches search href", "/search", "/search", true],
      ["different paths don't match", "/search", "/", false],
      ["different paths don't match (reverse)", "/", "/search", false],

      // Query params - should be stripped
      [
        "path with query params matches href",
        "/search?q=test",
        "/search",
        true,
      ],
      [
        "path with query params doesn't match wrong href",
        "/search?q=test",
        "/",
        false,
      ],
      [
        "complex query params",
        "/search?q=test&page=2&sort=asc",
        "/search",
        true,
      ],

      // Hash fragments - should be stripped
      ["path with hash matches href", "/search#results", "/search", true],
      [
        "path with hash doesn't match wrong href",
        "/search#results",
        "/",
        false,
      ],

      // Combined query + hash
      [
        "path with query and hash matches href",
        "/search?q=test#results",
        "/search",
        true,
      ],
      [
        "hash before query (edge case)",
        "/search#section?fake=param",
        "/search",
        true,
      ],

      // Similar prefixes - should NOT match
      [
        "/search does NOT match /searchresults",
        "/searchresults",
        "/search",
        false,
      ],
      [
        "/searchresults matches itself",
        "/searchresults",
        "/searchresults",
        true,
      ],
      ["/api does NOT match /api-v2", "/api-v2", "/api", false],

      // Kitchen sink mobile scenario - shared prefix paths
      [
        "kitchen sink: home matches home",
        "/kitchen_sink/mobile",
        "/kitchen_sink/mobile",
        true,
      ],
      [
        "kitchen sink: settings matches settings",
        "/kitchen_sink/mobile/settings",
        "/kitchen_sink/mobile/settings",
        true,
      ],
      [
        "kitchen sink: components matches components",
        "/kitchen_sink/mobile/components",
        "/kitchen_sink/mobile/components",
        true,
      ],
      [
        "kitchen sink: home does NOT match settings (prefix bug)",
        "/kitchen_sink/mobile/settings",
        "/kitchen_sink/mobile",
        false,
      ],
      [
        "kitchen sink: home does NOT match components (prefix bug)",
        "/kitchen_sink/mobile/components",
        "/kitchen_sink/mobile",
        false,
      ],
      [
        "kitchen sink: settings with query params",
        "/kitchen_sink/mobile/settings?tab=theme",
        "/kitchen_sink/mobile/settings",
        true,
      ],
      [
        "kitchen sink: settings query doesn't match home",
        "/kitchen_sink/mobile/settings?tab=theme",
        "/kitchen_sink/mobile",
        false,
      ],

      // Trailing slash edge cases
      ["/mobile/ href matches /mobile/ URL", "/mobile/", "/mobile/", true],
      [
        "/mobile/ href does NOT match /mobile/settings",
        "/mobile/settings",
        "/mobile/",
        false,
      ],
      [
        "/mobile href does NOT match /mobile/settings",
        "/mobile/settings",
        "/mobile",
        false,
      ],
      ["/mobile href matches /mobile URL", "/mobile", "/mobile", true],
      [
        "URL with trailing slash, href without (strict)",
        "/mobile/",
        "/mobile",
        false,
      ],
      [
        "URL without trailing slash, href with (strict)",
        "/mobile",
        "/mobile/",
        false,
      ],

      // Deep nesting
      ["deep path matches exactly", "/a/b/c/d/e", "/a/b/c/d/e", true],
      ["deep path doesn't match parent", "/a/b/c/d/e", "/a/b/c/d", false],
      ["deep path doesn't match child", "/a/b/c/d", "/a/b/c/d/e", false],

      // Edge cases (note: empty href not tested as it doesn't render as valid link)
      ["single slash variations", "/", "/", true],
    ]

    it.each(testCases)(
      "%s",
      (description, currentUrl, href, expectedActive) => {
        setMockUrl(currentUrl)
        const items = [
          { icon: House, label: "Test", href },
          { icon: Bell, label: "Other", href: "/other-unique-path" },
        ]
        render(BottomNav, { props: { items } })
        const testLink = screen.getByRole("link", { name: /Test/i })
        if (expectedActive) {
          expect(testLink).toHaveAttribute("aria-current", "page")
        } else {
          expect(testLink).not.toHaveAttribute("aria-current")
        }
      },
    )
  })

  describe("active state - single active item", () => {
    it("only marks one item as active at a time (defaultItems)", () => {
      setMockUrl("/search")
      render(BottomNav, { props: { items: defaultItems } })
      const activeLinks = screen
        .getAllByRole("link")
        .filter((link) => link.getAttribute("aria-current") === "page")
      expect(activeLinks).toHaveLength(1)
    })

    it("only marks one item as active at a time (kitchenSinkMobileItems)", () => {
      setMockUrl("/kitchen_sink/mobile/components")
      render(BottomNav, { props: { items: kitchenSinkMobileItems } })
      const activeLinks = screen
        .getAllByRole("link")
        .filter((link) => link.getAttribute("aria-current") === "page")
      expect(activeLinks).toHaveLength(1)
    })
  })
})
