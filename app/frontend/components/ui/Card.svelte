<!--
  @component Card
  Container with header, content, and footer sections.

  @example Basic usage
  ```svelte
  <Card title="Card Title" description="Card description text.">
    <p>Card content goes here.</p>
  </Card>
  ```

  @example With footer
  ```svelte
  <Card title="Settings">
    <p>Configure your preferences below.</p>

    {#snippet footer()}
      <button class="btn">Save Changes</button>
    {/snippet}
  </Card>
  ```

  @example Custom header
  ```svelte
  <Card>
    {#snippet header()}
      <div class="flex items-center justify-between">
        <h2>Custom Header</h2>
        <button class="btn-sm-icon-ghost"><Settings /></button>
      </div>
    {/snippet}

    <p>Card with custom header layout.</p>
  </Card>
  ```
-->
<script lang="ts">
  import type { Snippet } from "svelte"

  import { cn } from "@/utils"

  type Props = {
    /** Card title */
    title?: string
    /** Card description (below title) */
    description?: string
    /** CSS class for container */
    class?: string
    /** CSS class for header */
    headerClass?: string
    /** CSS class for content section */
    contentClass?: string
    /** CSS class for footer */
    footerClass?: string
    /** Header slot (replaces title/description) */
    header?: Snippet
    /** Main content slot */
    children?: Snippet
    /** Footer slot */
    footer?: Snippet
  }

  let {
    title,
    description,
    class: className,
    headerClass,
    contentClass,
    footerClass,
    header,
    children,
    footer,
  }: Props = $props()

  const hasHeader = $derived(header || title || description)
</script>

<div class={cn("card", className)}>
  {#if hasHeader}
    <header class={headerClass}>
      {#if header}
        {@render header()}
      {:else}
        {#if title}
          <h2>{title}</h2>
        {/if}
        {#if description}
          <p>{description}</p>
        {/if}
      {/if}
    </header>
  {/if}

  {#if children}
    <section class={contentClass}>
      {@render children()}
    </section>
  {/if}

  {#if footer}
    <footer class={footerClass}>
      {@render footer()}
    </footer>
  {/if}
</div>
