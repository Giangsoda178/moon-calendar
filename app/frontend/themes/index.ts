/**
 * Theme Registry - Single Source of Truth
 *
 * To add a new theme:
 * 1. Create themes/yourtheme.css with [data-theme="yourtheme"] selectors
 * 2. Add entry here: yourtheme: { label: "Your Theme" }
 * 3. Import CSS in themes/index.css: @import "./yourtheme.css";
 *
 * That's it! Type safety and UI will auto-update.
 */
export const THEME_VARIANTS = {
  default: { label: "Default" },
  claude: { label: "Claude" },
  blackpink: { label: "Black & Pink" },
  myfoodlink: { label: "MyFoodLink" },
} as const

export type ThemeVariant = keyof typeof THEME_VARIANTS

export const themeVariantKeys = Object.keys(THEME_VARIANTS) as ThemeVariant[]

export const getThemeLabel = (variant: ThemeVariant): string =>
  THEME_VARIANTS[variant].label
