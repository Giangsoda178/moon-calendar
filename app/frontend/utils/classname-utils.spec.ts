import { cn } from "./classname-utils"

describe("cn", () => {
  describe("basic merging", () => {
    it("merges multiple class strings", () => {
      expect(cn("px-2", "py-1", "text-sm")).toBe("px-2 py-1 text-sm")
    })

    it("handles single class", () => {
      expect(cn("btn")).toBe("btn")
    })

    it("handles empty inputs", () => {
      expect(cn()).toBe("")
      expect(cn("")).toBe("")
    })
  })

  describe("tailwind conflict resolution", () => {
    it("resolves padding conflicts (last wins)", () => {
      expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4")
    })

    it("resolves background color conflicts", () => {
      expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500")
    })

    it("resolves text color conflicts", () => {
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500")
    })

    it("resolves margin conflicts", () => {
      expect(cn("m-2", "m-4")).toBe("m-4")
      expect(cn("mx-2", "mx-4")).toBe("mx-4")
    })

    it("resolves font size conflicts", () => {
      expect(cn("text-sm", "text-lg")).toBe("text-lg")
    })

    it("resolves width/height conflicts", () => {
      expect(cn("w-4", "w-8")).toBe("w-8")
      expect(cn("h-4", "h-8")).toBe("h-8")
    })

    it("resolves flex conflicts", () => {
      expect(cn("flex-row", "flex-col")).toBe("flex-col")
    })

    it("resolves border radius conflicts", () => {
      expect(cn("rounded", "rounded-lg")).toBe("rounded-lg")
    })
  })

  describe("boolean conditionals", () => {
    it("filters out false values", () => {
      expect(cn("btn", false, "btn-primary")).toBe("btn btn-primary")
    })

    it("filters out null values", () => {
      expect(cn("btn", null, "btn-primary")).toBe("btn btn-primary")
    })

    it("filters out undefined values", () => {
      expect(cn("btn", undefined, "btn-primary")).toBe("btn btn-primary")
    })

    it("handles conditional expressions", () => {
      const isActive = true
      const isDisabled = false
      expect(
        cn("btn", isActive && "btn-active", isDisabled && "btn-disabled"),
      ).toBe("btn btn-active")
    })

    it("handles multiple conditionals", () => {
      const size: string = "lg"
      expect(
        cn(
          "btn",
          size === "lg" && "text-lg py-3",
          size === "sm" && "text-sm py-1",
          size === "md" && "text-base py-2",
        ),
      ).toBe("btn text-lg py-3")
    })
  })

  describe("object syntax", () => {
    it("includes classes with truthy values", () => {
      expect(cn({ "btn-active": true, "btn-disabled": false })).toBe(
        "btn-active",
      )
    })

    it("handles all falsy object values", () => {
      expect(
        cn({ "class-a": false, "class-b": null, "class-c": undefined }),
      ).toBe("")
    })

    it("handles all truthy object values", () => {
      expect(cn({ "class-a": true, "class-b": 1, "class-c": "yes" })).toBe(
        "class-a class-b class-c",
      )
    })

    it("combines object syntax with strings", () => {
      expect(cn("base", { active: true, disabled: false }, "extra")).toBe(
        "base active extra",
      )
    })
  })

  describe("arrays", () => {
    it("handles array of classes", () => {
      expect(cn(["px-2", "py-1"])).toBe("px-2 py-1")
    })

    it("handles nested arrays", () => {
      expect(cn(["px-2", ["py-1", "text-sm"]])).toBe("px-2 py-1 text-sm")
    })

    it("handles mixed arrays with conditionals", () => {
      const shouldInclude = false
      expect(cn(["base", shouldInclude && "excluded", "included"])).toBe(
        "base included",
      )
    })
  })

  describe("component override pattern", () => {
    it("allows consumer to override internal classes", () => {
      const internalClasses = "px-4 bg-gray-100"
      const consumerClasses = "px-2 bg-blue-500"
      // Consumer classes override internal, order may vary
      const result = cn(internalClasses, consumerClasses)
      expect(result).toContain("px-2")
      expect(result).toContain("bg-blue-500")
      expect(result).not.toContain("px-4")
      expect(result).not.toContain("bg-gray-100")
    })

    it("allows partial overrides", () => {
      const internal = "px-4 py-2 bg-gray-100 text-black"
      const override = "px-2"
      expect(cn(internal, override)).toBe("py-2 bg-gray-100 text-black px-2")
    })
  })

  describe("complex combinations", () => {
    it("handles mixed inputs with conflicts", () => {
      const hasError = true
      expect(
        cn("base-class", "text-lg py-3", {
          "border-red-500": hasError,
          "border-gray-300": !hasError,
        }),
      ).toBe("base-class text-lg py-3 border-red-500")
    })

    it("handles undefined in complex combinations", () => {
      const className: string | undefined = undefined
      expect(cn("btn", className, { active: true })).toBe("btn active")
    })
  })

  describe("edge cases", () => {
    it("handles whitespace-only strings", () => {
      expect(cn("   ", "btn")).toBe("btn")
    })

    it("handles classes with numbers", () => {
      expect(cn("p-2", "m-4", "w-1/2")).toBe("p-2 m-4 w-1/2")
    })

    it("handles arbitrary values", () => {
      expect(cn("w-[200px]", "h-[100px]")).toBe("w-[200px] h-[100px]")
    })

    it("handles important modifiers", () => {
      // !important keeps both - no automatic conflict resolution for !important
      const result = cn("!p-4", "p-2")
      expect(result).toContain("!p-4")
    })

    it("handles responsive prefixes", () => {
      expect(cn("sm:p-2", "sm:p-4")).toBe("sm:p-4")
      expect(cn("md:bg-red-500", "md:bg-blue-500")).toBe("md:bg-blue-500")
    })

    it("handles state variants", () => {
      expect(cn("hover:bg-red-500", "hover:bg-blue-500")).toBe(
        "hover:bg-blue-500",
      )
      expect(cn("focus:ring-2", "focus:ring-4")).toBe("focus:ring-4")
    })

    it("handles dark mode", () => {
      expect(cn("dark:bg-gray-900", "dark:bg-gray-800")).toBe(
        "dark:bg-gray-800",
      )
    })
  })
})
