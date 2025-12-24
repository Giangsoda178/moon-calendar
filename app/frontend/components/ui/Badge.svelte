<!--
  @component Badge
  Inline status indicator with multiple variants.

  @example Basic usage
  ```svelte
  <Badge>New</Badge>
  <Badge variant="secondary">Draft</Badge>
  <Badge variant="destructive">Error</Badge>
  <Badge variant="outline">v1.0.0</Badge>
  ```

  @example As SPA link (uses Inertia when available)
  ```svelte
  <script>
    import { kitchenSinkPath } from "@/routes"
  </script>
  <Badge href={kitchenSinkPath()}>Kitchen Sink</Badge>
  <Badge href="/users" inertia>Users</Badge>
  ```

  @example As external link
  ```svelte
  <Badge href="https://example.com" external>External</Badge>
  ```
-->
<script lang="ts">
  import type { Snippet } from "svelte"

  import { analyzeLink, cn, inertiaAction } from "@/utils"

  type Props = {
    /** Visual variant */
    variant?: "primary" | "secondary" | "destructive" | "outline"
    /** Link URL - can be a string or from js_routes (e.g., kitchenSinkPath()) */
    href?: string
    /** Enable SPA navigation (default: true for internal links) */
    inertia?: boolean
    /** Force external link behavior (opens in new tab) */
    external?: boolean
    /** CSS class override */
    class?: string
    /** Content slot */
    children: Snippet
  }

  let {
    variant = "primary",
    href,
    inertia = true,
    external = false,
    class: className,
    children,
  }: Props = $props()

  const variantClasses = {
    primary: "badge",
    secondary: "badge-secondary",
    destructive: "badge-destructive",
    outline: "badge-outline",
  }

  // Analyze link for consistent navigation behavior
  const link = $derived(analyzeLink(href, { inertia, external }))
</script>

{#if link.href && link.useInertia && inertiaAction}
  <!-- SPA navigation with Inertia -->
  <a
    href={link.href}
    class={cn(variantClasses[variant], className)}
    use:inertiaAction
  >
    {@render children()}
  </a>
{:else if link.href}
  <!-- External or fallback navigation -->
  <a
    href={link.href}
    class={cn(variantClasses[variant], className)}
    rel={link.isExternal ? "noopener noreferrer" : undefined}
    target={link.isExternal ? "_blank" : undefined}
  >
    {@render children()}
  </a>
{:else}
  <!-- Static badge -->
  <span class={cn(variantClasses[variant], className)}>
    {@render children()}
  </span>
{/if}
