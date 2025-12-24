<script lang="ts">
  import type { SVGAttributes } from "svelte/elements"

  type Props = SVGAttributes<SVGSVGElement> & {
    invert?: boolean
    noBackground?: boolean
  }

  let {
    class: className,
    invert = false,
    noBackground = false,
    ...restProps
  }: Props = $props()

  const bgColor = $derived(
    invert ? "var(--primary, #fafafa)" : "var(--primary-foreground, #0a0a0a)",
  )
  const fgColor = $derived(
    noBackground
      ? "currentColor"
      : invert
        ? "var(--primary-foreground, #0a0a0a)"
        : "var(--primary, #fafafa)",
  )
  // Accent dot: use --logo-highlight on dark bg, --logo-highlight-foreground on light bg
  // Fallback ensures contrast: fgColor (light on dark, dark on light)
  // noBackground: use --logo-highlight with currentColor fallback (shows orange on default theme)
  const highlightColor = $derived(
    noBackground
      ? "var(--logo-highlight, currentColor)"
      : invert
        ? "var(--logo-highlight-foreground, var(--primary-foreground, #0a0a0a))"
        : "var(--logo-highlight, var(--primary, #fafafa))",
  )
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 375 375"
  class={className}
  {...restProps}
>
  {#if !noBackground}
    <defs>
      <clipPath id="logo-clip">
        <path
          d="M 75 0 L 300 0 C 341.421875 0 375 33.578125 375 75 L 375 300 C 375 341.421875 341.421875 375 300 375 L 75 375 C 33.578125 375 0 341.421875 0 300 L 0 75 C 0 33.578125 33.578125 0 75 0 Z"
        />
      </clipPath>
    </defs>
    <!-- Background with rounded corners -->
    <g clip-path="url(#logo-clip)">
      <rect x="-82.5" width="540" fill={bgColor} height="540" y="-82.5" />
    </g>
  {/if}
  <!-- Letter L -->
  <g fill={fgColor}>
    <g transform="translate(35.616406, 270.624438)">
      <path
        d="M 98.171875 -24.578125 L 98.171875 0 L 0 0 L 0 -171.890625 L 24.578125 -171.890625 L 24.578125 -122.75 L 98.171875 -122.75 L 98.171875 -98.171875 L 122.75 -98.171875 L 122.75 -24.578125 Z M 24.578125 -24.578125 L 97.9375 -24.578125 L 97.9375 -98.171875 L 24.578125 -98.171875 Z"
      />
    </g>
  </g>
  <!-- Letter M -->
  <g fill={fgColor}>
    <g transform="translate(175.593652, 270.624438)">
      <path
        d="M 122.75 -98.171875 L 122.75 0 L 98.171875 0 L 98.171875 -98.171875 L 24.578125 -98.171875 L 24.578125 0 L 0 0 L 0 -122.75 L 98.171875 -122.75 L 98.171875 -98.171875 Z"
      />
    </g>
  </g>
  <!-- Accent dot -->
  <g fill={highlightColor}>
    <g transform="translate(315.577325, 270.624438)">
      <path d="M 0 -24.578125 L 24.578125 -24.578125 L 24.578125 0 L 0 0 Z" />
    </g>
  </g>
</svg>
