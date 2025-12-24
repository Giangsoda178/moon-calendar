import type { ThemeVariant } from "@/themes"

// Type definitions
export type Appearance = "light" | "dark" | "system"

// Re-export for convenience
export type { ThemeVariant } from "@/themes"

// Utility functions
const prefersDark = () => {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

const applyAppearance = (appearance: Appearance) => {
  const isDark =
    appearance === "dark" || (appearance === "system" && prefersDark())
  document.documentElement.classList.toggle("dark", isDark)
}

const applyVariant = (variant: ThemeVariant) => {
  if (variant === "default") {
    document.documentElement.removeAttribute("data-theme")
  } else {
    document.documentElement.setAttribute("data-theme", variant)
  }
}

const mediaQuery = () => {
  if (typeof window === "undefined") return null
  return window.matchMedia("(prefers-color-scheme: dark)")
}

const handleSystemThemeChange = () => {
  const current = localStorage.getItem("appearance") as Appearance | null
  applyAppearance(current ?? "system")
  // Update shared state for "system" mode
  if (sharedState.appearance === "system") {
    sharedState.isDark = prefersDark()
  }
}

/**
 * Initialize theme on page load (call from inertia.ts or HTML script)
 */
export function initializeTheme() {
  const savedAppearance =
    (localStorage.getItem("appearance") as Appearance) || "system"
  applyAppearance(savedAppearance)

  const savedVariant =
    (localStorage.getItem("themeVariant") as ThemeVariant) || "default"
  applyVariant(savedVariant)

  mediaQuery()?.addEventListener("change", handleSystemThemeChange)
}

// Module-level shared state (singleton) - all useAppearance() calls share this
const sharedState = $state({
  appearance:
    (typeof localStorage !== "undefined"
      ? (localStorage.getItem("appearance") as Appearance)
      : null) ?? "system",
  variant:
    (typeof localStorage !== "undefined"
      ? (localStorage.getItem("themeVariant") as ThemeVariant)
      : null) ?? "default",
  isDark:
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark"),
})

/**
 * Appearance rune - manages both appearance mode and theme variant
 * Uses shared module-level state so all components stay in sync
 */
export function useAppearance() {
  // Apply changes when state updates
  $effect(() => {
    applyAppearance(sharedState.appearance)
    sharedState.isDark =
      sharedState.appearance === "dark" ||
      (sharedState.appearance === "system" && prefersDark())
  })

  $effect(() => {
    applyVariant(sharedState.variant)
  })

  const update = (value: Appearance) => {
    sharedState.appearance = value
    if (value === "system") {
      localStorage.removeItem("appearance")
    } else {
      localStorage.setItem("appearance", value)
    }
  }

  const updateVariant = (value: ThemeVariant) => {
    sharedState.variant = value
    if (value === "default") {
      localStorage.removeItem("themeVariant")
    } else {
      localStorage.setItem("themeVariant", value)
    }
  }

  return {
    get value() {
      return sharedState.appearance
    },
    get variant() {
      return sharedState.variant
    },
    get isDark() {
      return sharedState.isDark
    },
    update,
    updateVariant,
  }
}
