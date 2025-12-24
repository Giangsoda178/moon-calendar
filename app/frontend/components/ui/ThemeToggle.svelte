<!--
  @component ThemeToggle
  Compact theme controls for headers. Configurable mode toggle and variant selector.

  @example Basic usage (mode toggle only)
  ```svelte
  <ThemeToggle />
  ```

  @example With variant selector
  ```svelte
  <ThemeToggle showVariants />
  ```

  @example Custom tooltip position (for sidebar placement)
  ```svelte
  <ThemeToggle tooltipSide="right" tooltipAlign="center" />
  ```
-->
<script lang="ts">
  import { Moon, Sun } from "@lucide/svelte"

  import { useAppearance } from "@/runes/use-appearance.svelte"
  import { THEME_VARIANTS, themeVariantKeys } from "@/themes"

  type Props = {
    /** Show light/dark mode toggle button */
    showMode?: boolean
    /** Show theme variant selector */
    showVariants?: boolean
    /** Tooltip position side: top, bottom, left, right */
    tooltipSide?: "top" | "bottom" | "left" | "right"
    /** Tooltip alignment: start, center, end */
    tooltipAlign?: "start" | "center" | "end"
    /** CSS class for container */
    class?: string
  }

  let {
    showMode = true,
    showVariants = false,
    tooltipSide = "bottom",
    tooltipAlign = "end",
    class: className,
  }: Props = $props()

  const appearance = useAppearance()

  function toggleMode() {
    appearance.update(appearance.value === "dark" ? "light" : "dark")
  }

  function handleVariantChange(e: Event) {
    const target = e.target as HTMLSelectElement
    appearance.updateVariant(target.value as typeof appearance.variant)
  }
</script>

<div class="flex items-center gap-2 {className}">
  {#if showVariants}
    <select
      class="select h-8 leading-none"
      value={appearance.variant}
      onchange={handleVariantChange}
    >
      {#each themeVariantKeys as key (key)}
        <option value={key}>{THEME_VARIANTS[key].label}</option>
      {/each}
    </select>
  {/if}

  {#if showMode}
    <button
      type="button"
      aria-label="Toggle dark mode"
      data-tooltip="Toggle dark mode"
      data-side={tooltipSide}
      data-align={tooltipAlign}
      onclick={toggleMode}
      class="btn-icon-outline size-8"
    >
      <span class="hidden dark:block"><Sun class="size-4" /></span>
      <span class="block dark:hidden"><Moon class="size-4" /></span>
    </button>
  {/if}
</div>
