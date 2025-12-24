<!--
  @component Alert
  Callout for important information with optional icon and action buttons.

  @example Basic usage
  ```svelte
  <Alert title="Heads up!" description="This action cannot be undone." />
  ```

  @example Destructive variant
  ```svelte
  <Alert variant="destructive" title="Error" description="Failed to save changes." />
  ```

  @example With icon
  ```svelte
  <script>
    import { AlertCircle } from "@lucide/svelte"
  </script>
  <Alert title="Warning">
    {#snippet icon()}<AlertCircle />{/snippet}
    Please review before continuing.
  </Alert>
  ```

  @example Confirm dialog pattern (with footer actions)
  ```svelte
  <Alert title="Update available">
    {#snippet icon()}<CircleCheck />{/snippet}
    Version 2.0 is now available with new features.
    {#snippet footer()}
      <button class="btn-sm">Update now</button>
      <button class="btn-sm-ghost">Later</button>
    {/snippet}
  </Alert>
  ```
-->
<script lang="ts">
  import type { Snippet } from "svelte"

  import { cn } from "@/utils"

  type Props = {
    /** Visual variant */
    variant?: "default" | "destructive"
    /** Alert title */
    title?: string
    /** Alert description */
    description?: string
    /** CSS class for container */
    class?: string
    /** Icon slot (renders in grid column) */
    icon?: Snippet
    /** Children slot (replaces description if provided) */
    children?: Snippet
    /** Footer slot for action buttons (confirm dialog pattern) */
    footer?: Snippet
  }

  let {
    variant = "default",
    title,
    description,
    class: className,
    icon,
    children,
    footer,
  }: Props = $props()

  const variantClasses = {
    default: "alert",
    destructive: "alert-destructive",
  }
</script>

{#snippet content()}
  {#if title}<h2>{title}</h2>{/if}
  {#if children}
    <section>{@render children()}</section>
  {:else if description}
    <section><p>{description}</p></section>
  {/if}
{/snippet}

<div class={cn(variantClasses[variant], className)} role="alert">
  {#if icon}{@render icon()}{/if}

  {#if footer}
    <!-- Flex row: content left, action buttons right (like Toaster) -->
    <div class="flex items-center gap-3">
      <div class="flex-1">{@render content()}</div>
      <footer class="flex flex-col gap-2">{@render footer()}</footer>
    </div>
  {:else}
    {@render content()}
  {/if}
</div>
