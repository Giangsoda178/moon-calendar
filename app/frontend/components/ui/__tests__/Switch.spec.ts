/**
 * Switch component tests
 */

import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"

import Switch from "../Switch.svelte"

describe("Switch", () => {
  describe("rendering", () => {
    it("renders switch input", () => {
      render(Switch)
      expect(screen.getByRole("switch")).toBeInTheDocument()
    })

    it("is a checkbox with switch role", () => {
      const { container } = render(Switch)
      const input = container.querySelector('input[type="checkbox"]')
      expect(input).toHaveAttribute("role", "switch")
    })

    it("applies input base class", () => {
      const { container } = render(Switch)
      expect(container.querySelector(".input")).toBeInTheDocument()
    })
  })

  describe("checked state", () => {
    it("is unchecked by default", () => {
      render(Switch)
      expect(screen.getByRole("switch")).not.toBeChecked()
    })

    it("can be checked initially", () => {
      render(Switch, { props: { checked: true } })
      expect(screen.getByRole("switch")).toBeChecked()
    })

    it("toggles checked state on click", async () => {
      render(Switch)
      const switchEl = screen.getByRole("switch")
      expect(switchEl).not.toBeChecked()
      await fireEvent.click(switchEl)
      expect(switchEl).toBeChecked()
    })
  })

  describe("accessibility", () => {
    it("has aria-checked=false when unchecked", () => {
      render(Switch)
      expect(screen.getByRole("switch")).toHaveAttribute(
        "aria-checked",
        "false",
      )
    })

    it("has aria-checked=true when checked", () => {
      render(Switch, { props: { checked: true } })
      expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true")
    })

    it("updates aria-checked on toggle", async () => {
      render(Switch)
      const switchEl = screen.getByRole("switch")
      expect(switchEl).toHaveAttribute("aria-checked", "false")
      await fireEvent.click(switchEl)
      expect(switchEl).toHaveAttribute("aria-checked", "true")
    })
  })

  describe("native attributes", () => {
    it("applies disabled state", () => {
      render(Switch, { props: { disabled: true } })
      expect(screen.getByRole("switch")).toBeDisabled()
    })

    it("applies name attribute", () => {
      const { container } = render(Switch, { props: { name: "darkMode" } })
      expect(
        container.querySelector('input[name="darkMode"]'),
      ).toBeInTheDocument()
    })

    it("applies id attribute", () => {
      render(Switch, { props: { id: "theme-switch" } })
      expect(screen.getByRole("switch")).toHaveAttribute("id", "theme-switch")
    })
  })

  describe("custom styling", () => {
    it("applies custom class", () => {
      const { container } = render(Switch, { props: { class: "scale-125" } })
      expect(container.querySelector(".scale-125")).toBeInTheDocument()
    })

    it("preserves input class when custom class added", () => {
      const { container } = render(Switch, { props: { class: "custom" } })
      const switchEl = container.querySelector("input")
      expect(switchEl).toHaveClass("input")
      expect(switchEl).toHaveClass("custom")
    })
  })
})
