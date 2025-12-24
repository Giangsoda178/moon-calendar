/**
 * Test utilities for UI component testing
 * Provides helpers for rendering, keyboard events, viewport mocking, and common test data
 */

import { fireEvent } from "@testing-library/svelte"
import { createRawSnippet } from "svelte"

// ============================================================================
// KEYBOARD HELPERS
// ============================================================================

/**
 * Fires a keydown event on an element
 */
export async function pressKey(
  element: HTMLElement,
  key: string,
  options: KeyboardEventInit = {},
): Promise<void> {
  await fireEvent.keyDown(element, { key, ...options })
}

/**
 * Fires multiple keydown events in sequence
 */
export async function pressKeys(
  element: HTMLElement,
  keys: string[],
): Promise<void> {
  for (const key of keys) {
    await pressKey(element, key)
  }
}

/**
 * Common keyboard navigation helpers
 */
export const keyboard = {
  arrowDown: (el: HTMLElement) => pressKey(el, "ArrowDown"),
  arrowUp: (el: HTMLElement) => pressKey(el, "ArrowUp"),
  arrowLeft: (el: HTMLElement) => pressKey(el, "ArrowLeft"),
  arrowRight: (el: HTMLElement) => pressKey(el, "ArrowRight"),
  enter: (el: HTMLElement) => pressKey(el, "Enter"),
  escape: (el: HTMLElement) => pressKey(el, "Escape"),
  space: (el: HTMLElement) => pressKey(el, " "),
  tab: (el: HTMLElement) => pressKey(el, "Tab"),
  shiftTab: (el: HTMLElement) => pressKey(el, "Tab", { shiftKey: true }),
  home: (el: HTMLElement) => pressKey(el, "Home"),
  end: (el: HTMLElement) => pressKey(el, "End"),
}

// ============================================================================
// VIEWPORT MOCKING
// ============================================================================

/**
 * Sets the viewport dimensions for testing responsive behavior
 * Dispatches resize event to trigger handlers
 */
export function setViewport(width: number, height: number): void {
  Object.defineProperty(window, "innerWidth", {
    value: width,
    configurable: true,
  })
  Object.defineProperty(window, "innerHeight", {
    value: height,
    configurable: true,
  })
  window.dispatchEvent(new Event("resize"))
}

/**
 * Common viewport presets
 */
export const viewports = {
  mobile: () => setViewport(375, 667),
  tablet: () => setViewport(768, 1024),
  desktop: () => setViewport(1440, 900),
  wide: () => setViewport(1920, 1080),
}

/**
 * Resets viewport to default test size
 */
export function resetViewport(): void {
  setViewport(1024, 768)
}

// ============================================================================
// TEST DATA FACTORIES
// ============================================================================

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface GroupedOption {
  label: string
  options: SelectOption[]
}

/**
 * Creates mock select options for testing
 */
export function createOptions(count = 3): SelectOption[] {
  return Array.from({ length: count }, (_, i) => ({
    value: `option-${i + 1}`,
    label: `Option ${i + 1}`,
  }))
}

/**
 * Creates mock grouped options for testing
 */
export function createGroupedOptions(
  groups = 2,
  optionsPerGroup = 2,
): GroupedOption[] {
  return Array.from({ length: groups }, (_, g) => ({
    label: `Group ${g + 1}`,
    options: Array.from({ length: optionsPerGroup }, (_, o) => ({
      value: `g${g + 1}-o${o + 1}`,
      label: `Group ${g + 1} Option ${o + 1}`,
    })),
  }))
}

/**
 * Creates mock tab data for testing
 */
export function createTabs(count = 3): { label: string; value: string }[] {
  return Array.from({ length: count }, (_, i) => ({
    label: `Tab ${i + 1}`,
    value: `tab-${i + 1}`,
  }))
}

/**
 * Creates mock accordion items for testing
 */
export function createAccordionItems(
  count = 3,
): { value: string; trigger: string; content: string }[] {
  return Array.from({ length: count }, (_, i) => ({
    value: `item-${i + 1}`,
    trigger: `Item ${i + 1}`,
    content: `Content for item ${i + 1}`,
  }))
}

/**
 * Creates mock table data for testing
 */
export function createTableData(
  rows = 3,
): { id: number; name: string; email: string }[] {
  return Array.from({ length: rows }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
  }))
}

// ============================================================================
// POINTER EVENT HELPERS (for touch/drag testing)
// ============================================================================

/**
 * Simulates a pointer down event
 */
export async function pointerDown(
  element: HTMLElement,
  clientX: number,
  clientY: number,
  pointerId = 1,
): Promise<void> {
  await fireEvent.pointerDown(element, {
    pointerId,
    clientX,
    clientY,
    isPrimary: true,
  })
}

/**
 * Simulates a pointer move event
 */
export async function pointerMove(
  element: HTMLElement,
  clientX: number,
  clientY: number,
  pointerId = 1,
): Promise<void> {
  await fireEvent.pointerMove(element, {
    pointerId,
    clientX,
    clientY,
    isPrimary: true,
  })
}

/**
 * Simulates a pointer up event
 */
export async function pointerUp(
  element: HTMLElement,
  clientX: number,
  clientY: number,
  pointerId = 1,
): Promise<void> {
  await fireEvent.pointerUp(element, {
    pointerId,
    clientX,
    clientY,
    isPrimary: true,
  })
}

/**
 * Simulates a complete drag gesture
 */
export async function drag(
  element: HTMLElement,
  start: { x: number; y: number },
  end: { x: number; y: number },
  steps = 5,
): Promise<void> {
  await pointerDown(element, start.x, start.y)

  const dx = (end.x - start.x) / steps
  const dy = (end.y - start.y) / steps

  for (let i = 1; i <= steps; i++) {
    await pointerMove(element, start.x + dx * i, start.y + dy * i)
  }

  await pointerUp(element, end.x, end.y)
}

// ============================================================================
// WAIT HELPERS
// ============================================================================

/**
 * Waits for animation frames to settle
 */
export function waitForAnimation(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve()
      })
    })
  })
}

/**
 * Waits for a specified number of milliseconds
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ============================================================================
// FOCUS HELPERS
// ============================================================================

/**
 * Gets the currently focused element
 */
export function getFocusedElement(): Element | null {
  return document.activeElement
}

/**
 * Checks if an element has focus
 */
export function hasFocus(element: HTMLElement): boolean {
  return document.activeElement === element
}

// ============================================================================
// SNIPPET HELPERS (Svelte 5)
// ============================================================================

/**
 * Creates a raw snippet for testing components that require children
 * Uses Svelte 5's createRawSnippet API
 */
export function textSnippet(text: string) {
  return createRawSnippet(() => ({
    render: () => `<span>${text}</span>`,
  }))
}

/**
 * Creates a raw snippet with custom HTML
 */
export function htmlSnippet(html: string) {
  return createRawSnippet(() => ({
    render: () => html,
  }))
}
