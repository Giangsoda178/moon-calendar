/**
 * Keyboard shortcut parsing utilities
 *
 * Parses shortcut strings like "cmd+k", "ctrl+shift+p", "escape"
 * and matches them against keyboard events.
 */

export type ParsedShortcut = {
  key: string
  meta: boolean
  ctrl: boolean
  alt: boolean
  shift: boolean
}

/**
 * Parse a shortcut string into modifiers and key
 *
 * Format: "[modifiers+]key" where modifiers can be:
 * - cmd/meta - Command key (Mac) / Windows key
 * - ctrl - Control key
 * - alt/opt - Alt/Option key
 * - shift - Shift key
 *
 * @example
 * parseShortcut("cmd+k") // { key: "k", meta: true, ctrl: false, alt: false, shift: false }
 * parseShortcut("ctrl+shift+p") // { key: "p", meta: false, ctrl: true, alt: false, shift: true }
 * parseShortcut("escape") // { key: "escape", meta: false, ctrl: false, alt: false, shift: false }
 */
export function parseShortcut(shortcut: string): ParsedShortcut {
  const parts = shortcut.toLowerCase().split("+")
  const key = parts.pop() || ""

  return {
    key,
    meta: parts.includes("cmd") || parts.includes("meta"),
    ctrl: parts.includes("ctrl"),
    alt: parts.includes("alt") || parts.includes("opt"),
    shift: parts.includes("shift"),
  }
}

/**
 * Check if a keyboard event matches a parsed shortcut
 *
 * Requires exact modifier match to prevent accidental triggers.
 *
 * @example
 * const parsed = parseShortcut("cmd+k")
 * matchesShortcut(event, parsed) // true if Cmd+K pressed, false if Cmd+Shift+K
 */
export function matchesShortcut(
  event: KeyboardEvent,
  parsed: ParsedShortcut,
): boolean {
  const eventKey = event.key.toLowerCase()

  // Check if modifiers match exactly
  const modifiersMatch =
    event.metaKey === parsed.meta &&
    event.ctrlKey === parsed.ctrl &&
    event.altKey === parsed.alt &&
    event.shiftKey === parsed.shift

  // Check if key matches
  const keyMatches = eventKey === parsed.key

  return modifiersMatch && keyMatches
}
