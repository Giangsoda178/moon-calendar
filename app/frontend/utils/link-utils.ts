/**
 * Link validation and analysis utilities.
 * Provides XSS-safe href validation and navigation behavior detection.
 */

/**
 * Safe URL patterns for href validation.
 * Allows: absolute paths, http(s) URLs, anchors, mailto, tel
 * Blocks: javascript:, data:, vbscript:, relative paths
 */
const SAFE_HREF_PATTERN = /^(https?:\/\/|\/|#|mailto:|tel:)/i

/**
 * Validates href to prevent XSS attacks via dangerous URL protocols.
 * Only allows safe URL patterns suitable for Inertia.js SPA routing.
 *
 * @param href - The URL to validate
 * @returns The URL if safe, undefined if blocked or empty
 *
 * @example Safe URLs (returns the URL)
 * sanitizeHref("/users")           // => "/users"
 * sanitizeHref("https://example.com") // => "https://example.com"
 * sanitizeHref("#section")         // => "#section"
 * sanitizeHref("mailto:hi@x.com")  // => "mailto:hi@x.com"
 * sanitizeHref("tel:+1234567890")  // => "tel:+1234567890"
 *
 * @example Blocked URLs (returns undefined)
 * sanitizeHref("javascript:alert(1)") // => undefined
 * sanitizeHref("data:text/html,...")  // => undefined
 * sanitizeHref("./relative/path")     // => undefined
 * sanitizeHref("path/without/slash")  // => undefined
 * sanitizeHref(undefined)             // => undefined
 * sanitizeHref("")                    // => undefined
 */
export function sanitizeHref(href: string | undefined): string | undefined {
  if (!href) return undefined
  return SAFE_HREF_PATTERN.test(href) ? href : undefined
}

/**
 * Link analysis result for consistent navigation handling.
 * Used by Button, Badge, Sidebar, and other link-capable components.
 */
export type LinkAnalysis = {
  /** Sanitized URL (undefined if blocked) */
  href: string | undefined
  /** Whether the link is external (http/https to different origin) */
  isExternal: boolean
  /** Whether the link is an anchor (#hash) */
  isAnchor: boolean
  /** Whether to use Inertia for SPA navigation */
  useInertia: boolean
}

/**
 * Options for link analysis behavior overrides.
 */
export type LinkAnalysisOptions = {
  /** Force Inertia SPA navigation on/off (default: true for internal links) */
  inertia?: boolean
  /** Force external link behavior (default: auto-detect from URL) */
  external?: boolean
}

/**
 * Analyzes a URL to determine navigation behavior.
 * Provides consistent link handling across components.
 *
 * @param url - The URL to analyze
 * @param options - Override options for navigation behavior
 * @returns LinkAnalysis object with href and behavior flags
 *
 * @example Basic internal link
 * analyzeLink("/users")
 * // => { href: "/users", isExternal: false, isAnchor: false, useInertia: true }
 *
 * @example External link (auto-detected)
 * analyzeLink("https://example.com")
 * // => { href: "https://example.com", isExternal: true, isAnchor: false, useInertia: false }
 *
 * @example Anchor link
 * analyzeLink("#section")
 * // => { href: "#section", isExternal: false, isAnchor: true, useInertia: false }
 *
 * @example Force external behavior
 * analyzeLink("/api/download", { external: true })
 * // => { href: "/api/download", isExternal: true, isAnchor: false, useInertia: false }
 *
 * @example Disable Inertia
 * analyzeLink("/legacy-page", { inertia: false })
 * // => { href: "/legacy-page", isExternal: false, isAnchor: false, useInertia: false }
 *
 * @example Invalid/blocked URL
 * analyzeLink("javascript:alert(1)")
 * // => { href: undefined, isExternal: false, isAnchor: false, useInertia: false }
 */
export function analyzeLink(
  url: string | undefined,
  options?: LinkAnalysisOptions,
): LinkAnalysis {
  const href = sanitizeHref(url)
  const forceExternal = options?.external ?? false
  const allowInertia = options?.inertia ?? true

  if (!href) {
    return {
      href: undefined,
      isExternal: false,
      isAnchor: false,
      useInertia: false,
    }
  }

  const isAnchor = href.startsWith("#")
  const isExternal = forceExternal || href.startsWith("http")
  const useInertia = allowInertia && !isExternal && !isAnchor

  return { href, isExternal, isAnchor, useInertia }
}

/**
 * Checks if a URL is an external link (http/https).
 *
 * @param url - The URL to check
 * @returns true if external, false otherwise
 *
 * @example
 * isExternalUrl("https://example.com") // => true
 * isExternalUrl("http://localhost")    // => true
 * isExternalUrl("/users")              // => false
 * isExternalUrl("#section")            // => false
 */
export function isExternalUrl(url: string | undefined): boolean {
  if (!url) return false
  return url.startsWith("http://") || url.startsWith("https://")
}

/**
 * Checks if a URL is an anchor link (#hash).
 *
 * @param url - The URL to check
 * @returns true if anchor, false otherwise
 *
 * @example
 * isAnchorUrl("#section")   // => true
 * isAnchorUrl("#")          // => true
 * isAnchorUrl("/users")     // => false
 * isAnchorUrl("/path#hash") // => false (path with anchor, not pure anchor)
 */
export function isAnchorUrl(url: string | undefined): boolean {
  if (!url) return false
  return url.startsWith("#")
}
