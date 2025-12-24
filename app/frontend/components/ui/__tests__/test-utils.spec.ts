/**
 * Verification tests for test utilities
 * Ensures the testing infrastructure works correctly
 */

import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  createAccordionItems,
  createGroupedOptions,
  createOptions,
  createTableData,
  createTabs,
  getFocusedElement,
  hasFocus,
  keyboard,
  pointerDown,
  pointerMove,
  pointerUp,
  pressKey,
  pressKeys,
  resetViewport,
  setViewport,
  viewports,
} from "./test-utils"

describe("Test Utilities", () => {
  describe("Keyboard helpers", () => {
    let element: HTMLButtonElement

    beforeEach(() => {
      element = document.createElement("button")
      document.body.appendChild(element)
    })

    it("pressKey fires keydown event", async () => {
      const handler = vi.fn()
      element.addEventListener("keydown", handler)

      await pressKey(element, "Enter")

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].key).toBe("Enter")
    })

    it("pressKey supports modifiers", async () => {
      const handler = vi.fn()
      element.addEventListener("keydown", handler)

      await pressKey(element, "Tab", { shiftKey: true })

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].shiftKey).toBe(true)
    })

    it("pressKeys fires multiple keydown events", async () => {
      const handler = vi.fn()
      element.addEventListener("keydown", handler)

      await pressKeys(element, ["ArrowDown", "ArrowDown", "Enter"])

      expect(handler).toHaveBeenCalledTimes(3)
    })

    it("keyboard shortcuts work", async () => {
      const handler = vi.fn()
      element.addEventListener("keydown", handler)

      await keyboard.arrowDown(element)
      expect(handler.mock.calls[0][0].key).toBe("ArrowDown")

      await keyboard.enter(element)
      expect(handler.mock.calls[1][0].key).toBe("Enter")

      await keyboard.escape(element)
      expect(handler.mock.calls[2][0].key).toBe("Escape")
    })
  })

  describe("Viewport mocking", () => {
    beforeEach(() => {
      resetViewport()
    })

    it("setViewport changes window dimensions", () => {
      setViewport(375, 667)

      expect(window.innerWidth).toBe(375)
      expect(window.innerHeight).toBe(667)
    })

    it("setViewport triggers resize event", () => {
      const handler = vi.fn()
      window.addEventListener("resize", handler)

      setViewport(768, 1024)

      expect(handler).toHaveBeenCalledTimes(1)

      window.removeEventListener("resize", handler)
    })

    it("viewport presets work", () => {
      viewports.mobile()
      expect(window.innerWidth).toBe(375)

      viewports.tablet()
      expect(window.innerWidth).toBe(768)

      viewports.desktop()
      expect(window.innerWidth).toBe(1440)
    })

    it("resetViewport restores default", () => {
      setViewport(375, 667)
      resetViewport()

      expect(window.innerWidth).toBe(1024)
      expect(window.innerHeight).toBe(768)
    })
  })

  describe("Test data factories", () => {
    it("createOptions generates correct structure", () => {
      const options = createOptions(3)

      expect(options).toHaveLength(3)
      expect(options[0]).toEqual({ value: "option-1", label: "Option 1" })
      expect(options[1]).toEqual({ value: "option-2", label: "Option 2" })
    })

    it("createGroupedOptions generates nested structure", () => {
      const groups = createGroupedOptions(2, 2)

      expect(groups).toHaveLength(2)
      expect(groups[0].label).toBe("Group 1")
      expect(groups[0].options).toHaveLength(2)
      expect(groups[0].options[0].value).toBe("g1-o1")
    })

    it("createTabs generates tab data", () => {
      const tabs = createTabs(3)

      expect(tabs).toHaveLength(3)
      expect(tabs[0]).toEqual({ label: "Tab 1", value: "tab-1" })
    })

    it("createAccordionItems generates accordion data", () => {
      const items = createAccordionItems(2)

      expect(items).toHaveLength(2)
      expect(items[0]).toEqual({
        value: "item-1",
        trigger: "Item 1",
        content: "Content for item 1",
      })
    })

    it("createTableData generates table rows", () => {
      const data = createTableData(3)

      expect(data).toHaveLength(3)
      expect(data[0]).toEqual({
        id: 1,
        name: "User 1",
        email: "user1@example.com",
      })
    })
  })

  describe("Pointer event helpers", () => {
    let element: HTMLDivElement

    beforeEach(() => {
      element = document.createElement("div")
      document.body.appendChild(element)
    })

    it("pointerDown fires event with coordinates", async () => {
      const handler = vi.fn()
      element.addEventListener("pointerdown", handler)

      await pointerDown(element, 100, 200)

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].clientX).toBe(100)
      expect(handler.mock.calls[0][0].clientY).toBe(200)
    })

    it("pointerMove fires event with coordinates", async () => {
      const handler = vi.fn()
      element.addEventListener("pointermove", handler)

      await pointerMove(element, 150, 250)

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].clientX).toBe(150)
    })

    it("pointerUp fires event with coordinates", async () => {
      const handler = vi.fn()
      element.addEventListener("pointerup", handler)

      await pointerUp(element, 200, 300)

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].clientX).toBe(200)
    })
  })

  describe("Focus helpers", () => {
    let element: HTMLButtonElement

    beforeEach(() => {
      element = document.createElement("button")
      document.body.appendChild(element)
    })

    it("getFocusedElement returns active element", () => {
      element.focus()
      expect(getFocusedElement()).toBe(element)
    })

    it("hasFocus returns true when element is focused", () => {
      element.focus()
      expect(hasFocus(element)).toBe(true)
    })

    it("hasFocus returns false when element is not focused", () => {
      expect(hasFocus(element)).toBe(false)
    })
  })
})
