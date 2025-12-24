<!--
  @component AppBar
  Top navigation bar for mobile apps with back button, title, and actions.
  Follows Basecoat styling patterns with proper focus states and transitions.

  @example Basic with back button
  ```svelte
  <AppBar title="Settings" backHref="/" />
  ```

  @example With actions
  ```svelte
  <script>
    import { Save, Share } from "@lucide/svelte"
  </script>

  <AppBar title="Edit Profile" backHref="/profile">
    {#snippet actions()}
      <button class="btn-sm-icon-ghost" onclick={handleSave}>
        <Save class="size-5" />
      </button>
    {/snippet}
  </AppBar>
  ```

  @example With subtitle
  ```svelte
  <AppBar title="John Doe" subtitle="Online" backHref="/contacts" />
  ```

  @example Transparent (for scroll effects)
  ```svelte
  <AppBar title="Gallery" transparent />
  ```

  @example Center title (iOS style)
  ```svelte
  <AppBar title="Settings" backHref="/" titleAlign="center" />
  ```

  @example Custom back action
  ```svelte
  <AppBar title="Form" onback={() => confirmLeave()} />
  ```
-->
<script lang="ts">
  import { ChevronLeft } from "@lucide/svelte"
  import type { Snippet } from "svelte"

  import { cn, inertiaAction } from "@/utils"

  type Props = {
    /** Page title */
    title?: string
    /** Optional subtitle */
    subtitle?: string
    /** Back button href (uses Inertia navigation) */
    backHref?: string
    /** Custom back button click handler */
    onback?: () => void
    /** Hide back button */
    hideBack?: boolean
    /** Title alignment */
    titleAlign?: "left" | "center"
    /** Transparent background */
    transparent?: boolean
    /** Additional CSS classes */
    class?: string
    /** Actions slot (right side buttons) */
    actions?: Snippet
  }

  let {
    title,
    subtitle,
    backHref,
    onback,
    hideBack = false,
    titleAlign = "left",
    transparent = false,
    class: className,
    actions,
  }: Props = $props()

  let showBack = $derived(!hideBack && (backHref || onback))

  function handleBackClick() {
    if (onback) {
      onback()
    }
  }
</script>

<nav
  class={cn(
    "flex h-14 items-center gap-2",
    showBack || titleAlign === "center" ? "px-2" : "px-4",
    !transparent && "border-border bg-background border-b shadow-sm",
    transparent && "bg-transparent",
    className,
  )}
  aria-label="Page navigation"
>
  <!-- Back button -->
  {#if showBack}
    {#if backHref}
      <a
        href={backHref}
        use:inertiaAction
        class="text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex size-10 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label="Go back"
      >
        <ChevronLeft class="size-6" />
      </a>
    {:else}
      <button
        type="button"
        onclick={handleBackClick}
        class="text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex size-10 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label="Go back"
      >
        <ChevronLeft class="size-6" />
      </button>
    {/if}
  {:else if titleAlign === "center"}
    <!-- Spacer for centered title balance -->
    <div class="size-10"></div>
  {/if}

  <!-- Title area -->
  <div
    class={cn(
      "flex min-w-0 flex-1 flex-col",
      titleAlign === "center" && "items-center",
      !showBack && titleAlign !== "center" && "pl-2",
    )}
  >
    {#if title}
      <h1 class="truncate text-base leading-none font-semibold tracking-tight">
        {title}
      </h1>
    {/if}
    {#if subtitle}
      <p class="text-muted-foreground mt-1 truncate text-xs">
        {subtitle}
      </p>
    {/if}
  </div>

  <!-- Actions slot -->
  {#if actions}
    <div class="flex items-center gap-1">
      {@render actions()}
    </div>
  {:else}
    <!-- Spacer when no actions but back button exists -->
    <div class="size-10"></div>
  {/if}
</nav>
