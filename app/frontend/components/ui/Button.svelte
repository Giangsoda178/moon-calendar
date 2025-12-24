<!--
  @component Button
  Button with variants, sizes, and SPA Link support.

  @example Basic usage
  ```svelte
  <Button>Click me</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="destructive">Delete</Button>
  ```

  @example Size variants
  ```svelte
  <Button size="sm">Small</Button>
  <Button size="lg">Large</Button>
  <Button size="icon"><Settings /></Button>
  ```

  @example As SPA Link (uses Inertia when available)
  ```svelte
  <script>
    import { kitchenSinkPath } from "@/routes"
  </script>
  <Button href={kitchenSinkPath()}>Go to Kitchen Sink</Button>
  <Button href="/logout" method="post" variant="destructive">Logout</Button>
  ```

  @example As external link
  ```svelte
  <Button href="https://example.com" external>External Site</Button>
  ```

  @example With loading state
  ```svelte
  <Button loading={isSubmitting} disabled={isSubmitting}>
    {isSubmitting ? "Saving..." : "Save"}
  </Button>
  ```

  @example With click handler
  ```svelte
  <Button onclick={() => console.log("clicked!")}>Click me</Button>
  ```

  @example Preserve scroll/state on navigation
  ```svelte
  <Button href="/search" preserveScroll preserveState>Search</Button>
  ```

  @example With conditional variant (active state)
  ```svelte
  <Button
    active={isSelected}
    variant="secondary"
    activeVariant="primary"
  >
    Toggle
  </Button>
  ```

  @example With data attributes (e.g., tooltips)
  ```svelte
  <Button variant="outline" data-tooltip="Click me!">Hover</Button>
  ```
-->
<script lang="ts">
  import { LoaderCircle } from "@lucide/svelte"
  import type { Snippet } from "svelte"

  import { analyzeLink, cn, inertiaAction } from "@/utils"

  type Variant =
    | "primary"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link"

  // Rest props type for data-*, aria-*, and other common attributes
  // Uses Record for flexibility while maintaining some type safety
  type RestProps = Record<`data-${string}`, string | undefined> &
    Record<`aria-${string}`, string | boolean | undefined> & {
      id?: string
      role?: string
      tabindex?: number
      style?: string
    }

  type Props = {
    /** Visual variant */
    variant?: Variant
    /** Size variant */
    size?: "default" | "sm" | "lg" | "icon" | "sm-icon" | "lg-icon"
    /** Active state for conditional variant switching */
    active?: boolean
    /** Variant to use when active (defaults to "primary") */
    activeVariant?: Variant
    /** Render as Link (navigation) */
    href?: string
    /** HTTP method for SPA navigation (default: GET) */
    method?: "get" | "post" | "put" | "patch" | "delete"
    /** Data to send with navigation */
    data?: FormData | Record<string, string | Blob>
    /** Preserve scroll position after navigation */
    preserveScroll?: boolean
    /** Preserve component state after navigation */
    preserveState?: boolean
    /** Enable SPA navigation (default: true for internal links) */
    inertia?: boolean
    /** Force external link behavior (opens in new tab) */
    external?: boolean
    /** Button type (only applies when no href) */
    type?: "button" | "submit" | "reset"
    /** Disabled state */
    disabled?: boolean
    /** Loading state (shows spinner) */
    loading?: boolean
    /** Click handler */
    onclick?: (event: MouseEvent) => void
    /** CSS class override */
    class?: string
    /** Content slot */
    children: Snippet
  } & RestProps

  let {
    variant = "primary",
    size = "default",
    active,
    activeVariant = "primary",
    href,
    method = "get",
    data,
    preserveScroll = false,
    preserveState,
    inertia = true,
    external = false,
    type = "button",
    disabled = false,
    loading = false,
    onclick,
    class: className,
    children,
    ...rest
  }: Props = $props()

  // Cast rest props for spreading onto elements
  const restProps = rest as Record<string, unknown>

  // CSS class lookup by size and variant
  // Pattern: btn, btn-secondary, btn-sm-destructive, btn-icon-ghost, etc.
  const buttonClasses: Record<string, Record<string, string>> = {
    default: {
      primary: "btn",
      secondary: "btn-secondary",
      destructive: "btn-destructive",
      outline: "btn-outline",
      ghost: "btn-ghost",
      link: "btn-link",
    },
    sm: {
      primary: "btn-sm",
      secondary: "btn-sm-secondary",
      destructive: "btn-sm-destructive",
      outline: "btn-sm-outline",
      ghost: "btn-sm-ghost",
      link: "btn-sm-link",
    },
    lg: {
      primary: "btn-lg",
      secondary: "btn-lg-secondary",
      destructive: "btn-lg-destructive",
      outline: "btn-lg-outline",
      ghost: "btn-lg-ghost",
      link: "btn-lg-link",
    },
    icon: {
      primary: "btn-icon",
      secondary: "btn-icon-secondary",
      destructive: "btn-icon-destructive",
      outline: "btn-icon-outline",
      ghost: "btn-icon-ghost",
      link: "btn-icon-link",
    },
    "sm-icon": {
      primary: "btn-sm-icon",
      secondary: "btn-sm-icon-secondary",
      destructive: "btn-sm-icon-destructive",
      outline: "btn-sm-icon-outline",
      ghost: "btn-sm-icon-ghost",
      link: "btn-sm-icon-link",
    },
    "lg-icon": {
      primary: "btn-lg-icon",
      secondary: "btn-lg-icon-secondary",
      destructive: "btn-lg-icon-destructive",
      outline: "btn-lg-icon-outline",
      ghost: "btn-lg-icon-ghost",
      link: "btn-lg-icon-link",
    },
  }

  // Use activeVariant when active, otherwise use variant
  const effectiveVariant = $derived(active ? activeVariant : variant)
  const classes = $derived(buttonClasses[size][effectiveVariant])

  // Analyze link for consistent navigation behavior
  const link = $derived(analyzeLink(href, { inertia, external }))

  // Navigation options for Inertia
  const navOptions = $derived({
    method,
    data,
    preserveScroll,
    preserveState: preserveState ?? method !== "get",
  })
</script>

{#if link.href && link.useInertia && !disabled && inertiaAction}
  <!-- SPA navigation with Inertia -->
  <a
    href={link.href}
    use:inertiaAction={navOptions}
    class={cn(classes, className)}
    {onclick}
    {...restProps}
  >
    {#if loading}
      <LoaderCircle class="animate-spin" />
    {/if}
    {@render children()}
  </a>
{:else if link.href && !disabled}
  <!-- External or fallback navigation -->
  <a
    href={link.href}
    class={cn(classes, className)}
    rel={link.isExternal ? "noopener noreferrer" : undefined}
    target={link.isExternal ? "_blank" : undefined}
    {onclick}
    {...restProps}
  >
    {#if loading}
      <LoaderCircle class="animate-spin" />
    {/if}
    {@render children()}
  </a>
{:else}
  <!-- Button element -->
  <button
    {type}
    disabled={disabled || loading}
    class={cn(classes, className)}
    {onclick}
    {...restProps}
  >
    {#if loading}
      <LoaderCircle class="animate-spin" />
    {/if}
    {@render children()}
  </button>
{/if}
