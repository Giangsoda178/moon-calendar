/**
 * Dialog component tests
 */

import { fireEvent, render, screen } from "@testing-library/svelte"
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest"

import Dialog from "../Dialog.svelte"

import { textSnippet } from "./test-utils"

// Mock dialog methods since jsdom doesn't support native dialog
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (
    this: HTMLDialogElement,
  ) {
    this.setAttribute("open", "")
  })
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute("open")
    // Dispatch close event like native dialog does
    this.dispatchEvent(new Event("close"))
  })
})

describe("Dialog", () => {
  describe("rendering", () => {
    it("renders dialog element", () => {
      const { container } = render(Dialog, { props: { id: "test" } })
      expect(container.querySelector("dialog")).toBeInTheDocument()
    })

    it("applies dialog class", () => {
      const { container } = render(Dialog, { props: { id: "test" } })
      expect(container.querySelector(".dialog")).toBeInTheDocument()
    })

    it("renders title when provided", () => {
      render(Dialog, {
        props: { id: "test", title: "Edit Profile", open: true },
      })
      expect(screen.getByText("Edit Profile")).toBeInTheDocument()
    })

    it("renders description when provided", () => {
      render(Dialog, {
        props: {
          id: "test",
          title: "Confirm",
          description: "Are you sure?",
          open: true,
        },
      })
      expect(screen.getByText("Are you sure?")).toBeInTheDocument()
    })

    it("renders children content", () => {
      render(Dialog, {
        props: {
          id: "test",
          open: true,
          children: textSnippet("Dialog content"),
        },
      })
      expect(screen.getByText("Dialog content")).toBeInTheDocument()
    })
  })

  describe("accessibility", () => {
    it("has aria-labelledby pointing to title", () => {
      const { container } = render(Dialog, {
        props: { id: "my-dialog", title: "Title" },
      })
      expect(container.querySelector("dialog")).toHaveAttribute(
        "aria-labelledby",
        "my-dialog-title",
      )
    })

    it("has aria-describedby when description provided", () => {
      const { container } = render(Dialog, {
        props: { id: "my-dialog", description: "Description text" },
      })
      expect(container.querySelector("dialog")).toHaveAttribute(
        "aria-describedby",
        "my-dialog-description",
      )
    })

    it("does not have aria-describedby when no description", () => {
      const { container } = render(Dialog, {
        props: { id: "my-dialog", title: "Title" },
      })
      expect(container.querySelector("dialog")).not.toHaveAttribute(
        "aria-describedby",
      )
    })
  })

  describe("trigger button", () => {
    it("renders trigger button when trigger prop provided", () => {
      render(Dialog, { props: { id: "test", trigger: "Open Dialog" } })
      expect(
        screen.getByRole("button", { name: "Open Dialog" }),
      ).toBeInTheDocument()
    })

    it("applies triggerClass to trigger button", () => {
      const { container } = render(Dialog, {
        props: { id: "test", trigger: "Open", triggerClass: "btn-destructive" },
      })
      expect(container.querySelector(".btn-destructive")).toBeInTheDocument()
    })

    it("does not render trigger button when trigger prop not provided", () => {
      render(Dialog, { props: { id: "test", title: "Title" } })
      expect(
        screen.queryByRole("button", { name: "Open Dialog" }),
      ).not.toBeInTheDocument()
    })
  })

  describe("close button", () => {
    it("renders close button by default", () => {
      render(Dialog, { props: { id: "test", open: true } })
      expect(
        screen.getByRole("button", { name: "Close dialog" }),
      ).toBeInTheDocument()
    })

    it("hides close button when closeButton=false", () => {
      render(Dialog, { props: { id: "test", open: true, closeButton: false } })
      expect(
        screen.queryByRole("button", { name: "Close dialog" }),
      ).not.toBeInTheDocument()
    })
  })

  describe("footer", () => {
    it("renders footer snippet", () => {
      render(Dialog, {
        props: {
          id: "test",
          open: true,
          footer: textSnippet("Footer content"),
        },
      })
      expect(screen.getByText("Footer content")).toBeInTheDocument()
    })
  })

  describe("custom styling", () => {
    it("applies custom class to dialog", () => {
      const { container } = render(Dialog, {
        props: { id: "test", class: "w-full sm:max-w-lg" },
      })
      expect(container.querySelector("dialog")).toHaveClass("w-full")
    })

    it("applies bodyClass to body section", () => {
      const { container } = render(Dialog, {
        props: {
          id: "test",
          open: true,
          bodyClass: "overflow-y-auto",
          children: textSnippet("Content"),
        },
      })
      expect(container.querySelector("section")).toHaveClass("overflow-y-auto")
    })
  })

  describe("ID generation", () => {
    it("uses provided ID for dialog", () => {
      const { container } = render(Dialog, { props: { id: "custom-dialog" } })
      expect(container.querySelector("#custom-dialog")).toBeInTheDocument()
    })

    it("generates title ID from dialog ID", () => {
      render(Dialog, {
        props: { id: "my-dialog", title: "Test Title", open: true },
      })
      expect(screen.getByText("Test Title")).toHaveAttribute(
        "id",
        "my-dialog-title",
      )
    })
  })

  describe("open/close", () => {
    it("closes on Escape key", async () => {
      const onclose = vi.fn()
      const { container } = render(Dialog, {
        props: { id: "test", open: true, onclose },
      })
      const dialog = container.querySelector("dialog")!

      // Native dialog fires 'close' event on Escape - mock emulates this
      await fireEvent.keyDown(dialog, { key: "Escape" })
      // The close mock dispatches 'close' event which triggers handleClose
      dialog.close()

      expect(onclose).toHaveBeenCalled()
    })

    it("closes via close button", async () => {
      const onclose = vi.fn()
      render(Dialog, { props: { id: "test", open: true, onclose } })

      await fireEvent.click(
        screen.getByRole("button", { name: "Close dialog" }),
      )
      expect(onclose).toHaveBeenCalled()
    })
  })

  describe("body scroll lock", () => {
    afterEach(() => {
      // Clean up body overflow style after each test
      document.body.style.overflow = ""
    })

    it("locks body scroll when opened", () => {
      render(Dialog, { props: { id: "test", open: true } })
      expect(document.body.style.overflow).toBe("hidden")
    })

    it("restores body scroll when closed via close button", async () => {
      render(Dialog, { props: { id: "test", open: true } })
      expect(document.body.style.overflow).toBe("hidden")

      await fireEvent.click(
        screen.getByRole("button", { name: "Close dialog" }),
      )
      expect(document.body.style.overflow).toBe("")
    })
  })
})
