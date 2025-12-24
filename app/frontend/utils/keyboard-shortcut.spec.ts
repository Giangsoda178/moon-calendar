import { describe, expect, it } from "vitest"

import { matchesShortcut, parseShortcut } from "./keyboard-shortcut"

// Helper to create mock KeyboardEvent
function createKeyboardEvent(
  key: string,
  modifiers: Partial<{
    metaKey: boolean
    ctrlKey: boolean
    altKey: boolean
    shiftKey: boolean
  }> = {},
): KeyboardEvent {
  return {
    key,
    metaKey: modifiers.metaKey ?? false,
    ctrlKey: modifiers.ctrlKey ?? false,
    altKey: modifiers.altKey ?? false,
    shiftKey: modifiers.shiftKey ?? false,
  } as KeyboardEvent
}

describe("parseShortcut", () => {
  describe("single keys", () => {
    it("parses single letter key", () => {
      expect(parseShortcut("k")).toEqual({
        key: "k",
        meta: false,
        ctrl: false,
        alt: false,
        shift: false,
      })
    })

    it("parses special keys", () => {
      expect(parseShortcut("escape")).toEqual({
        key: "escape",
        meta: false,
        ctrl: false,
        alt: false,
        shift: false,
      })
      expect(parseShortcut("enter")).toEqual({
        key: "enter",
        meta: false,
        ctrl: false,
        alt: false,
        shift: false,
      })
      expect(parseShortcut("f1")).toEqual({
        key: "f1",
        meta: false,
        ctrl: false,
        alt: false,
        shift: false,
      })
    })

    it("parses symbol keys", () => {
      expect(parseShortcut("/")).toEqual({
        key: "/",
        meta: false,
        ctrl: false,
        alt: false,
        shift: false,
      })
    })
  })

  describe("modifier + key combinations", () => {
    it("parses cmd+key", () => {
      expect(parseShortcut("cmd+k")).toEqual({
        key: "k",
        meta: true,
        ctrl: false,
        alt: false,
        shift: false,
      })
    })

    it("parses meta+key (alias for cmd)", () => {
      expect(parseShortcut("meta+k")).toEqual({
        key: "k",
        meta: true,
        ctrl: false,
        alt: false,
        shift: false,
      })
    })

    it("parses ctrl+key", () => {
      expect(parseShortcut("ctrl+p")).toEqual({
        key: "p",
        meta: false,
        ctrl: true,
        alt: false,
        shift: false,
      })
    })

    it("parses alt+key", () => {
      expect(parseShortcut("alt+enter")).toEqual({
        key: "enter",
        meta: false,
        ctrl: false,
        alt: true,
        shift: false,
      })
    })

    it("parses opt+key (alias for alt)", () => {
      expect(parseShortcut("opt+enter")).toEqual({
        key: "enter",
        meta: false,
        ctrl: false,
        alt: true,
        shift: false,
      })
    })

    it("parses shift+key", () => {
      expect(parseShortcut("shift+/")).toEqual({
        key: "/",
        meta: false,
        ctrl: false,
        alt: false,
        shift: true,
      })
    })
  })

  describe("multiple modifiers", () => {
    it("parses cmd+shift+key", () => {
      expect(parseShortcut("cmd+shift+p")).toEqual({
        key: "p",
        meta: true,
        ctrl: false,
        alt: false,
        shift: true,
      })
    })

    it("parses ctrl+shift+key", () => {
      expect(parseShortcut("ctrl+shift+p")).toEqual({
        key: "p",
        meta: false,
        ctrl: true,
        alt: false,
        shift: true,
      })
    })

    it("parses ctrl+alt+key", () => {
      expect(parseShortcut("ctrl+alt+delete")).toEqual({
        key: "delete",
        meta: false,
        ctrl: true,
        alt: true,
        shift: false,
      })
    })

    it("parses all modifiers", () => {
      expect(parseShortcut("cmd+ctrl+alt+shift+k")).toEqual({
        key: "k",
        meta: true,
        ctrl: true,
        alt: true,
        shift: true,
      })
    })

    it("handles modifiers in any order", () => {
      expect(parseShortcut("shift+cmd+k")).toEqual({
        key: "k",
        meta: true,
        ctrl: false,
        alt: false,
        shift: true,
      })
      expect(parseShortcut("alt+ctrl+shift+p")).toEqual({
        key: "p",
        meta: false,
        ctrl: true,
        alt: true,
        shift: true,
      })
    })
  })

  describe("case insensitivity", () => {
    it("normalizes uppercase input", () => {
      expect(parseShortcut("CMD+K")).toEqual({
        key: "k",
        meta: true,
        ctrl: false,
        alt: false,
        shift: false,
      })
    })

    it("normalizes mixed case input", () => {
      expect(parseShortcut("Cmd+Shift+P")).toEqual({
        key: "p",
        meta: true,
        ctrl: false,
        alt: false,
        shift: true,
      })
    })
  })

  describe("edge cases", () => {
    it("handles empty string", () => {
      expect(parseShortcut("")).toEqual({
        key: "",
        meta: false,
        ctrl: false,
        alt: false,
        shift: false,
      })
    })

    it("handles + key alone", () => {
      // "+" splits into ["", ""], last part is ""
      expect(parseShortcut("+")).toEqual({
        key: "",
        meta: false,
        ctrl: false,
        alt: false,
        shift: false,
      })
    })

    it("handles unknown modifiers (ignored)", () => {
      expect(parseShortcut("super+k")).toEqual({
        key: "k",
        meta: false,
        ctrl: false,
        alt: false,
        shift: false,
      })
    })
  })
})

describe("matchesShortcut", () => {
  describe("single key matching", () => {
    it("matches single key press", () => {
      const parsed = parseShortcut("escape")
      const event = createKeyboardEvent("Escape")
      expect(matchesShortcut(event, parsed)).toBe(true)
    })

    it("rejects when modifier is pressed but not expected", () => {
      const parsed = parseShortcut("k")
      const event = createKeyboardEvent("k", { metaKey: true })
      expect(matchesShortcut(event, parsed)).toBe(false)
    })
  })

  describe("modifier + key matching", () => {
    it("matches cmd+key", () => {
      const parsed = parseShortcut("cmd+k")
      const event = createKeyboardEvent("k", { metaKey: true })
      expect(matchesShortcut(event, parsed)).toBe(true)
    })

    it("matches ctrl+key", () => {
      const parsed = parseShortcut("ctrl+p")
      const event = createKeyboardEvent("p", { ctrlKey: true })
      expect(matchesShortcut(event, parsed)).toBe(true)
    })

    it("matches ctrl+shift+key", () => {
      const parsed = parseShortcut("ctrl+shift+p")
      const event = createKeyboardEvent("p", { ctrlKey: true, shiftKey: true })
      expect(matchesShortcut(event, parsed)).toBe(true)
    })
  })

  describe("exact modifier matching", () => {
    it("rejects when extra modifier is pressed", () => {
      const parsed = parseShortcut("cmd+k")
      const event = createKeyboardEvent("k", { metaKey: true, shiftKey: true })
      expect(matchesShortcut(event, parsed)).toBe(false)
    })

    it("rejects when required modifier is missing", () => {
      const parsed = parseShortcut("cmd+shift+k")
      const event = createKeyboardEvent("k", { metaKey: true })
      expect(matchesShortcut(event, parsed)).toBe(false)
    })

    it("rejects wrong modifier", () => {
      const parsed = parseShortcut("cmd+k")
      const event = createKeyboardEvent("k", { ctrlKey: true })
      expect(matchesShortcut(event, parsed)).toBe(false)
    })
  })

  describe("key matching", () => {
    it("is case insensitive for key", () => {
      const parsed = parseShortcut("cmd+k")
      const event = createKeyboardEvent("K", { metaKey: true })
      expect(matchesShortcut(event, parsed)).toBe(true)
    })

    it("rejects wrong key", () => {
      const parsed = parseShortcut("cmd+k")
      const event = createKeyboardEvent("j", { metaKey: true })
      expect(matchesShortcut(event, parsed)).toBe(false)
    })

    it("matches special keys", () => {
      const parsed = parseShortcut("ctrl+enter")
      const event = createKeyboardEvent("Enter", { ctrlKey: true })
      expect(matchesShortcut(event, parsed)).toBe(true)
    })
  })
})
