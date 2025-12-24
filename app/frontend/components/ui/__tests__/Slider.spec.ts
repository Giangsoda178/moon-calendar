/**
 * Slider component tests
 */

import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"

import Slider from "../Slider.svelte"

describe("Slider", () => {
  describe("rendering", () => {
    it("renders range input", () => {
      render(Slider)
      expect(screen.getByRole("slider")).toBeInTheDocument()
    })

    it("applies input base class", () => {
      const { container } = render(Slider)
      expect(container.querySelector(".input")).toBeInTheDocument()
    })
  })

  describe("value handling", () => {
    it("has default value of 0", () => {
      render(Slider)
      expect(screen.getByRole("slider")).toHaveValue("0")
    })

    it("accepts initial value", () => {
      render(Slider, { props: { value: 50 } })
      expect(screen.getByRole("slider")).toHaveValue("50")
    })

    it("updates value on input", async () => {
      render(Slider)
      const slider = screen.getByRole("slider")
      await fireEvent.input(slider, { target: { value: "75" } })
      expect(slider).toHaveValue("75")
    })

    it("calls onchange callback", async () => {
      const onChange = vi.fn()
      render(Slider, { props: { onchange: onChange } })
      await fireEvent.input(screen.getByRole("slider"), {
        target: { value: "30" },
      })
      expect(onChange).toHaveBeenCalledWith(30)
    })
  })

  describe("range attributes", () => {
    it("has default min of 0", () => {
      render(Slider)
      expect(screen.getByRole("slider")).toHaveAttribute("min", "0")
    })

    it("has default max of 100", () => {
      render(Slider)
      expect(screen.getByRole("slider")).toHaveAttribute("max", "100")
    })

    it("has default step of 1", () => {
      render(Slider)
      expect(screen.getByRole("slider")).toHaveAttribute("step", "1")
    })

    it("accepts custom min", () => {
      render(Slider, { props: { min: 10 } })
      expect(screen.getByRole("slider")).toHaveAttribute("min", "10")
    })

    it("accepts custom max", () => {
      render(Slider, { props: { max: 200 } })
      expect(screen.getByRole("slider")).toHaveAttribute("max", "200")
    })

    it("accepts custom step", () => {
      render(Slider, { props: { step: 5 } })
      expect(screen.getByRole("slider")).toHaveAttribute("step", "5")
    })
  })

  describe("CSS variable", () => {
    it("sets --slider-value CSS variable", () => {
      const { container } = render(Slider, { props: { value: 50 } })
      const input = container.querySelector("input")
      expect(input).toHaveStyle("--slider-value: 50%")
    })

    it("calculates percentage correctly at min", () => {
      const { container } = render(Slider, {
        props: { value: 0, min: 0, max: 100 },
      })
      const input = container.querySelector("input")
      expect(input).toHaveStyle("--slider-value: 0%")
    })

    it("calculates percentage correctly at max", () => {
      const { container } = render(Slider, {
        props: { value: 100, min: 0, max: 100 },
      })
      const input = container.querySelector("input")
      expect(input).toHaveStyle("--slider-value: 100%")
    })

    it("calculates percentage correctly with custom range", () => {
      const { container } = render(Slider, {
        props: { value: 50, min: 0, max: 200 },
      })
      const input = container.querySelector("input")
      expect(input).toHaveStyle("--slider-value: 25%")
    })
  })

  describe("disabled state", () => {
    it("applies disabled attribute", () => {
      render(Slider, { props: { disabled: true } })
      expect(screen.getByRole("slider")).toBeDisabled()
    })

    it("has disabled styling", () => {
      const { container } = render(Slider, { props: { disabled: true } })
      expect(container.querySelector("input")).toHaveClass("cursor-not-allowed")
      expect(container.querySelector("input")).toHaveClass("opacity-50")
    })
  })

  describe("form integration", () => {
    it("applies name attribute", () => {
      const { container } = render(Slider, { props: { name: "volume" } })
      expect(
        container.querySelector('input[name="volume"]'),
      ).toBeInTheDocument()
    })

    it("applies id attribute", () => {
      render(Slider, { props: { id: "brightness-slider" } })
      expect(screen.getByRole("slider")).toHaveAttribute(
        "id",
        "brightness-slider",
      )
    })
  })

  describe("custom styling", () => {
    it("applies custom class", () => {
      const { container } = render(Slider, { props: { class: "h-2" } })
      expect(container.querySelector("input")).toHaveClass("h-2")
    })

    it("preserves input and w-full classes", () => {
      const { container } = render(Slider, { props: { class: "custom" } })
      const input = container.querySelector("input")
      expect(input).toHaveClass("input")
      expect(input).toHaveClass("w-full")
      expect(input).toHaveClass("custom")
    })
  })
})
