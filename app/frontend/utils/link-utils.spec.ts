import {
  analyzeLink,
  isAnchorUrl,
  isExternalUrl,
  sanitizeHref,
} from "./link-utils"

describe("sanitizeHref", () => {
  describe("allowed URLs", () => {
    it("allows absolute paths starting with /", () => {
      expect(sanitizeHref("/")).toBe("/")
      expect(sanitizeHref("/users")).toBe("/users")
      expect(sanitizeHref("/kitchen-sink")).toBe("/kitchen-sink")
      expect(sanitizeHref("/api/v1/users")).toBe("/api/v1/users")
      expect(sanitizeHref("/path?query=value")).toBe("/path?query=value")
      expect(sanitizeHref("/path#anchor")).toBe("/path#anchor")
    })

    it("allows https URLs", () => {
      expect(sanitizeHref("https://example.com")).toBe("https://example.com")
      expect(sanitizeHref("https://example.com/path")).toBe(
        "https://example.com/path",
      )
      expect(sanitizeHref("HTTPS://EXAMPLE.COM")).toBe("HTTPS://EXAMPLE.COM")
    })

    it("allows http URLs", () => {
      expect(sanitizeHref("http://example.com")).toBe("http://example.com")
      expect(sanitizeHref("HTTP://localhost:3000")).toBe(
        "HTTP://localhost:3000",
      )
    })

    it("allows anchor links", () => {
      expect(sanitizeHref("#")).toBe("#")
      expect(sanitizeHref("#section")).toBe("#section")
      expect(sanitizeHref("#my-anchor-link")).toBe("#my-anchor-link")
    })

    it("allows mailto links", () => {
      expect(sanitizeHref("mailto:user@example.com")).toBe(
        "mailto:user@example.com",
      )
      expect(sanitizeHref("MAILTO:USER@EXAMPLE.COM")).toBe(
        "MAILTO:USER@EXAMPLE.COM",
      )
      expect(sanitizeHref("mailto:user@example.com?subject=Hello")).toBe(
        "mailto:user@example.com?subject=Hello",
      )
    })

    it("allows tel links", () => {
      expect(sanitizeHref("tel:+1234567890")).toBe("tel:+1234567890")
      expect(sanitizeHref("TEL:+1-800-555-1234")).toBe("TEL:+1-800-555-1234")
    })
  })

  describe("blocked URLs", () => {
    it("blocks javascript: protocol (XSS)", () => {
      expect(sanitizeHref("javascript:alert(1)")).toBeUndefined()
      expect(sanitizeHref("javascript:void(0)")).toBeUndefined()
      expect(sanitizeHref("JAVASCRIPT:ALERT(1)")).toBeUndefined()
      expect(sanitizeHref("JavaScript:alert('xss')")).toBeUndefined()
    })

    it("blocks data: protocol", () => {
      expect(
        sanitizeHref("data:text/html,<script>alert(1)</script>"),
      ).toBeUndefined()
      expect(sanitizeHref("data:image/svg+xml,...")).toBeUndefined()
      expect(sanitizeHref("DATA:text/html,...")).toBeUndefined()
    })

    it("blocks vbscript: protocol", () => {
      expect(sanitizeHref("vbscript:msgbox(1)")).toBeUndefined()
      expect(sanitizeHref("VBSCRIPT:MSGBOX(1)")).toBeUndefined()
    })

    it("blocks relative paths (not suitable for Inertia routing)", () => {
      expect(sanitizeHref("./path")).toBeUndefined()
      expect(sanitizeHref("../parent")).toBeUndefined()
      expect(sanitizeHref("path/to/page")).toBeUndefined()
      expect(sanitizeHref("users/123")).toBeUndefined()
    })

    it("blocks unknown protocols", () => {
      expect(sanitizeHref("file:///etc/passwd")).toBeUndefined()
      expect(sanitizeHref("ftp://example.com")).toBeUndefined()
      expect(sanitizeHref("custom://protocol")).toBeUndefined()
    })
  })

  describe("edge cases", () => {
    it("returns undefined for empty/falsy inputs", () => {
      expect(sanitizeHref(undefined)).toBeUndefined()
      expect(sanitizeHref("")).toBeUndefined()
    })

    it("handles URLs with special characters", () => {
      expect(sanitizeHref("/search?q=hello%20world")).toBe(
        "/search?q=hello%20world",
      )
      expect(sanitizeHref("https://example.com/path?foo=bar&baz=qux")).toBe(
        "https://example.com/path?foo=bar&baz=qux",
      )
    })
  })
})

describe("analyzeLink", () => {
  describe("internal links", () => {
    it("enables Inertia for absolute paths", () => {
      const result = analyzeLink("/users")
      expect(result).toEqual({
        href: "/users",
        isExternal: false,
        isAnchor: false,
        useInertia: true,
      })
    })

    it("handles paths with query strings", () => {
      const result = analyzeLink("/search?q=test")
      expect(result.href).toBe("/search?q=test")
      expect(result.useInertia).toBe(true)
    })

    it("handles paths with hash fragments", () => {
      const result = analyzeLink("/page#section")
      expect(result.href).toBe("/page#section")
      expect(result.useInertia).toBe(true)
      expect(result.isAnchor).toBe(false) // path with hash, not pure anchor
    })
  })

  describe("external links", () => {
    it("detects https as external", () => {
      const result = analyzeLink("https://example.com")
      expect(result).toEqual({
        href: "https://example.com",
        isExternal: true,
        isAnchor: false,
        useInertia: false,
      })
    })

    it("detects http as external", () => {
      const result = analyzeLink("http://localhost:3000")
      expect(result.isExternal).toBe(true)
      expect(result.useInertia).toBe(false)
    })

    it("can force external behavior", () => {
      const result = analyzeLink("/api/download", { external: true })
      expect(result).toEqual({
        href: "/api/download",
        isExternal: true,
        isAnchor: false,
        useInertia: false,
      })
    })
  })

  describe("anchor links", () => {
    it("detects pure anchors", () => {
      const result = analyzeLink("#section")
      expect(result).toEqual({
        href: "#section",
        isExternal: false,
        isAnchor: true,
        useInertia: false,
      })
    })

    it("handles empty anchor", () => {
      const result = analyzeLink("#")
      expect(result.isAnchor).toBe(true)
      expect(result.useInertia).toBe(false)
    })
  })

  describe("options", () => {
    it("can disable Inertia", () => {
      const result = analyzeLink("/legacy", { inertia: false })
      expect(result.useInertia).toBe(false)
      expect(result.isExternal).toBe(false)
    })

    it("respects inertia=true but still disables for external", () => {
      const result = analyzeLink("https://example.com", { inertia: true })
      expect(result.useInertia).toBe(false) // external overrides
      expect(result.isExternal).toBe(true)
    })

    it("respects inertia=true but still disables for anchors", () => {
      const result = analyzeLink("#section", { inertia: true })
      expect(result.useInertia).toBe(false) // anchor overrides
      expect(result.isAnchor).toBe(true)
    })

    it("combines external and inertia options", () => {
      const result = analyzeLink("/download", { external: true, inertia: true })
      expect(result.isExternal).toBe(true)
      expect(result.useInertia).toBe(false) // external wins
    })
  })

  describe("blocked/invalid URLs", () => {
    it("returns safe defaults for javascript: URLs", () => {
      const result = analyzeLink("javascript:alert(1)")
      expect(result).toEqual({
        href: undefined,
        isExternal: false,
        isAnchor: false,
        useInertia: false,
      })
    })

    it("returns safe defaults for data: URLs", () => {
      const result = analyzeLink("data:text/html,<script>alert(1)</script>")
      expect(result.href).toBeUndefined()
      expect(result.useInertia).toBe(false)
    })

    it("returns safe defaults for undefined", () => {
      const result = analyzeLink(undefined)
      expect(result.href).toBeUndefined()
      expect(result.useInertia).toBe(false)
    })

    it("returns safe defaults for empty string", () => {
      const result = analyzeLink("")
      expect(result.href).toBeUndefined()
      expect(result.useInertia).toBe(false)
    })

    it("returns safe defaults for relative paths", () => {
      const result = analyzeLink("./relative")
      expect(result.href).toBeUndefined()
      expect(result.useInertia).toBe(false)
    })
  })
})

describe("isExternalUrl", () => {
  it("returns true for https URLs", () => {
    expect(isExternalUrl("https://example.com")).toBe(true)
    expect(isExternalUrl("https://example.com/path")).toBe(true)
  })

  it("returns true for http URLs", () => {
    expect(isExternalUrl("http://example.com")).toBe(true)
    expect(isExternalUrl("http://localhost:3000")).toBe(true)
  })

  it("returns false for internal paths", () => {
    expect(isExternalUrl("/users")).toBe(false)
    expect(isExternalUrl("/")).toBe(false)
  })

  it("returns false for anchors", () => {
    expect(isExternalUrl("#section")).toBe(false)
  })

  it("returns false for empty/undefined", () => {
    expect(isExternalUrl(undefined)).toBe(false)
    expect(isExternalUrl("")).toBe(false)
  })
})

describe("isAnchorUrl", () => {
  it("returns true for anchor links", () => {
    expect(isAnchorUrl("#")).toBe(true)
    expect(isAnchorUrl("#section")).toBe(true)
    expect(isAnchorUrl("#my-anchor")).toBe(true)
  })

  it("returns false for paths with anchors", () => {
    expect(isAnchorUrl("/page#section")).toBe(false)
  })

  it("returns false for internal paths", () => {
    expect(isAnchorUrl("/users")).toBe(false)
  })

  it("returns false for external URLs", () => {
    expect(isAnchorUrl("https://example.com")).toBe(false)
  })

  it("returns false for empty/undefined", () => {
    expect(isAnchorUrl(undefined)).toBe(false)
    expect(isAnchorUrl("")).toBe(false)
  })
})
