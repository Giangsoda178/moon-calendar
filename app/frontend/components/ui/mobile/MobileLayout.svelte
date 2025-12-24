<!--
  @component MobileLayout
  Full-screen mobile app layout with header/content/footer structure.
  Automatically handles safe areas for notched devices.

  @example Basic usage with AppBar and BottomNav
  ```svelte
  <script lang="ts">
    import MobileLayout from "@/components/ui/mobile/MobileLayout.svelte"
    import AppBar from "@/components/ui/mobile/AppBar.svelte"
    import BottomNav from "@/components/ui/mobile/BottomNav.svelte"
  </script>

  <MobileLayout>
    {#snippet header()}
      <AppBar title="Dashboard" />
    {/snippet}

    <main class="p-4">
      <h1>Page content</h1>
    </main>

    {#snippet footer()}
      <BottomNav items={navItems} />
    {/snippet}
  </MobileLayout>
  ```

  @example Content only (no header/footer)
  ```svelte
  <MobileLayout>
    <div class="p-4">
      Full screen content with safe areas
    </div>
  </MobileLayout>
  ```

  @example With background color
  ```svelte
  <MobileLayout class="bg-muted">
    {#snippet header()}
      <AppBar title="Settings" />
    {/snippet}
    <div class="p-4">Content</div>
  </MobileLayout>
  ```
-->
<script lang="ts">
  import type { Snippet } from "svelte"

  import { cn } from "@/utils"

  type Props = {
    /** Header slot (typically AppBar) */
    header?: Snippet
    /** Footer slot (typically BottomNav) */
    footer?: Snippet
    /** Main content (default slot) */
    children: Snippet
    /** Additional CSS classes for outer container */
    class?: string
    /** Additional CSS classes for content area */
    contentClass?: string
  }

  let {
    header,
    footer,
    children,
    class: className,
    contentClass,
  }: Props = $props()
</script>

<div class={cn("mobile-layout bg-background flex h-full flex-col", className)}>
  {#if header}
    <header class="pt-safe shrink-0">
      {@render header()}
    </header>
  {:else}
    <!-- Apply top safe area when no header -->
    <div class="pt-safe"></div>
  {/if}

  <main
    class={cn(
      "flex-1 overflow-y-auto overscroll-contain",
      footer && "pb-[calc(3.5rem+var(--safe-area-bottom))]",
      contentClass,
    )}
  >
    {@render children()}
  </main>

  {#if footer}
    <footer class="pb-safe shrink-0">
      {@render footer()}
    </footer>
  {:else}
    <!-- Apply bottom safe area when no footer -->
    <div class="pb-safe"></div>
  {/if}
</div>

<style>
  .mobile-layout {
    /* Prevent pull-to-refresh on the layout itself */
    overscroll-behavior: none;
  }

  main {
    /* iOS smooth scrolling */
    -webkit-overflow-scrolling: touch;
  }
</style>
